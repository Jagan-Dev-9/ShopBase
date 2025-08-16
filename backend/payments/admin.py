from django.contrib import admin
from .models import Payment

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'product_name', 'amount', 'status', 'created_at']
    list_filter = ['status', 'created_at', 'currency']
    search_fields = ['user__username', 'user__email', 'product_name', 'stripe_checkout_session_id']
    readonly_fields = ['stripe_checkout_session_id', 'created_at', 'updated_at']
    ordering = ['-created_at']
