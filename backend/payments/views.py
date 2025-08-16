import stripe
from django.conf import settings
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Payment
from .serializers import CreateCheckoutSessionSerializer, PaymentSerializer

stripe.api_key = settings.STRIPE_SECRET_KEY

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_checkout_session(request):
    """Create a Stripe checkout session for payment"""
    serializer = CreateCheckoutSessionSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        product_name = serializer.validated_data['product_name']
        amount = serializer.validated_data['amount']
        
        # Convert amount to cents for Stripe
        amount_cents = int(float(amount) * 100)
        
        # Create Stripe checkout session
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'product_data': {
                        'name': product_name,
                    },
                    'unit_amount': amount_cents,
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url=request.build_absolute_uri('/') + 'payment/success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url=request.build_absolute_uri('/') + 'payment/cancel',
            metadata={
                'user_id': request.user.id,
                'product_name': product_name,
            }
        )
        
        # Save payment record
        Payment.objects.create(
            user=request.user,
            stripe_checkout_session_id=checkout_session.id,
            amount=amount,
            product_name=product_name,
            status='pending'
        )
        
        return Response({
            'session_id': checkout_session.id,
            'session_url': checkout_session.url
        }, status=status.HTTP_201_CREATED)
        
    except stripe.error.StripeError as e:
        return Response({
            'error': f'Stripe error: {str(e)}'
        }, status=status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        return Response({
            'error': f'Server error: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_cart_checkout_session(request):
    """Create a Stripe checkout session for entire cart"""
    try:
        # Get user's cart
        from cart.models import Cart
        cart = Cart.objects.get(user=request.user)
        
        if not cart.items.exists():
            return Response({
                'error': 'Cart is empty'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Create line items for each cart item
        line_items = []
        for item in cart.items.all():
            line_items.append({
                'price_data': {
                    'currency': 'usd',
                    'product_data': {
                        'name': item.product.name,
                    },
                    'unit_amount': int(float(item.product.price) * 100),
                },
                'quantity': item.quantity,
            })
        
        # Create Stripe checkout session
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=line_items,
            mode='payment',
            success_url=request.build_absolute_uri('/') + 'payment/success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url=request.build_absolute_uri('/') + 'payment/cancel',
            metadata={
                'user_id': request.user.id,
                'cart_checkout': 'true',
                'total_items': str(cart.total_items),
            }
        )
        
        # Save payment record
        Payment.objects.create(
            user=request.user,
            stripe_checkout_session_id=checkout_session.id,
            amount=cart.total_price,
            product_name=f"Cart Checkout ({cart.total_items} items)",
            status='pending'
        )
        
        return Response({
            'session_id': checkout_session.id,
            'session_url': checkout_session.url
        }, status=status.HTTP_201_CREATED)
        
    except Cart.DoesNotExist:
        return Response({
            'error': 'Cart not found'
        }, status=status.HTTP_404_NOT_FOUND)
        
    except stripe.error.StripeError as e:
        return Response({
            'error': f'Stripe error: {str(e)}'
        }, status=status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        return Response({
            'error': f'Server error: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@csrf_exempt
@api_view(['POST'])
def stripe_webhook(request):
    """Handle Stripe webhook events"""
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    endpoint_secret = settings.STRIPE_WEBHOOK_SECRET

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except ValueError:
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError:
        return HttpResponse(status=400)

    # Handle the checkout.session.completed event
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        
        try:
            payment = Payment.objects.get(
                stripe_checkout_session_id=session['id']
            )
            payment.status = 'completed'
            payment.save()
            
            # If this was a cart checkout, clear the cart
            if session.get('metadata', {}).get('cart_checkout') == 'true':
                from cart.models import Cart
                try:
                    cart = Cart.objects.get(user=payment.user)
                    cart.items.all().delete()
                except Cart.DoesNotExist:
                    pass
                    
        except Payment.DoesNotExist:
            pass

    return HttpResponse(status=200)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def payment_history(request):
    """Get user's payment history"""
    payments = Payment.objects.filter(user=request.user).order_by('-created_at')
    serializer = PaymentSerializer(payments, many=True)
    return Response(serializer.data)
