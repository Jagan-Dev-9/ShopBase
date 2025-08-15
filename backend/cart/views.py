from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Cart, CartItem
from products.models import Product
from .serializers import CartSerializer, CartItemSerializer, AddToCartSerializer

class CartView(generics.RetrieveAPIView):
    """Get current user's cart"""
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        cart, created = Cart.objects.get_or_create(user=self.request.user)
        return cart

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def add_to_cart(request):
    """Add product to cart or update quantity"""
    serializer = AddToCartSerializer(data=request.data)
    if serializer.is_valid():
        product_id = serializer.validated_data['product_id']
        quantity = serializer.validated_data['quantity']
        
        try:
            product = Product.objects.get(id=product_id, is_active=True)
            cart, created = Cart.objects.get_or_create(user=request.user)
            
            # Check if item already exists in cart
            cart_item, item_created = CartItem.objects.get_or_create(
                cart=cart,
                product=product,
                defaults={'quantity': quantity}
            )
            
            if not item_created:
                # Update existing item quantity
                new_quantity = cart_item.quantity + quantity
                if new_quantity > product.stock:
                    return Response({
                        'error': f'Cannot add {quantity} items. Only {product.stock - cart_item.quantity} more available.'
                    }, status=status.HTTP_400_BAD_REQUEST)
                cart_item.quantity = new_quantity
                cart_item.save()
            else:
                # Validate stock for new item
                if quantity > product.stock:
                    cart_item.delete()  # Remove the created item
                    return Response({
                        'error': f'Only {product.stock} items available in stock'
                    }, status=status.HTTP_400_BAD_REQUEST)
            
            # Return updated cart
            cart_serializer = CartSerializer(cart)
            return Response({
                'message': 'Product added to cart successfully',
                'cart': cart_serializer.data
            }, status=status.HTTP_200_OK)
            
        except Product.DoesNotExist:
            return Response({
                'error': 'Product not found'
            }, status=status.HTTP_404_NOT_FOUND)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([permissions.IsAuthenticated])
def update_cart_item(request, item_id):
    """Update cart item quantity"""
    try:
        cart_item = CartItem.objects.get(
            id=item_id,
            cart__user=request.user
        )
        
        quantity = request.data.get('quantity')
        if not quantity or not isinstance(quantity, int) or quantity <= 0:
            return Response({
                'error': 'Valid quantity is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if quantity > cart_item.product.stock:
            return Response({
                'error': f'Only {cart_item.product.stock} items available in stock'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        cart_item.quantity = quantity
        cart_item.save()
        
        serializer = CartItemSerializer(cart_item)
        return Response({
            'message': 'Cart item updated successfully',
            'item': serializer.data
        }, status=status.HTTP_200_OK)
        
    except CartItem.DoesNotExist:
        return Response({
            'error': 'Cart item not found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def remove_cart_item(request, item_id):
    """Remove item from cart"""
    try:
        cart_item = CartItem.objects.get(
            id=item_id,
            cart__user=request.user
        )
        product_name = cart_item.product.name
        cart_item.delete()
        
        return Response({
            'message': f'{product_name} removed from cart successfully'
        }, status=status.HTTP_200_OK)
        
    except CartItem.DoesNotExist:
        return Response({
            'error': 'Cart item not found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def clear_cart(request):
    """Clear all items from cart"""
    try:
        cart = Cart.objects.get(user=request.user)
        items_count = cart.items.count()
        cart.items.all().delete()
        
        return Response({
            'message': f'{items_count} items removed from cart'
        }, status=status.HTTP_200_OK)
        
    except Cart.DoesNotExist:
        return Response({
            'message': 'Cart is already empty'
        }, status=status.HTTP_200_OK)
