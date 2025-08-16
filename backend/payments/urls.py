from django.urls import path
from . import views

app_name = 'payments'

urlpatterns = [
    path('create-checkout-session/', views.create_checkout_session, name='create_checkout_session'),
    path('create-cart-checkout-session/', views.create_cart_checkout_session, name='create_cart_checkout_session'),
    path('webhook/', views.stripe_webhook, name='stripe_webhook'),
    path('history/', views.payment_history, name='payment_history'),
]
