from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    # Fields to display in the user list
    list_display = ('username', 'email', 'first_name', 'last_name', 'role', 'is_active', 'is_staff', 'date_joined')
    
    # Fields that can be used for filtering
    list_filter = ('role', 'is_active', 'is_staff', 'is_superuser', 'date_joined')
    
    # Fields that can be searched
    search_fields = ('username', 'email', 'first_name', 'last_name')
    
    # How many users to show per page
    list_per_page = 25
    
    # Fields that can be edited directly from the list view
    list_editable = ('role', 'is_active')
    
    # Ordering
    ordering = ('-date_joined',)
    
    # Fieldsets for the user detail/edit page
    fieldsets = (
        (None, {
            'fields': ('username', 'password')
        }),
        ('Personal info', {
            'fields': ('first_name', 'last_name', 'email')
        }),
        ('Permissions', {
            'fields': ('role', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
            'classes': ('collapse',)
        }),
        ('Important dates', {
            'fields': ('last_login', 'date_joined'),
            'classes': ('collapse',)
        }),
    )
    
    # Fields for adding a new user
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'role', 'first_name', 'last_name'),
        }),
    )
    
    # Make date_joined and last_login read-only
    readonly_fields = ('date_joined', 'last_login')
    
    # Add custom actions
    actions = ['make_admin', 'make_user', 'activate_users', 'deactivate_users']
    
    def make_admin(self, request, queryset):
        """Make selected users admins"""
        count = queryset.update(role='admin')
        self.message_user(request, f'{count} users were successfully made admins.')
    make_admin.short_description = "Make selected users admins"
    
    def make_user(self, request, queryset):
        """Make selected users regular users"""
        count = queryset.update(role='user')
        self.message_user(request, f'{count} users were successfully made regular users.')
    make_user.short_description = "Make selected users regular users"
    
    def activate_users(self, request, queryset):
        """Activate selected users"""
        count = queryset.update(is_active=True)
        self.message_user(request, f'{count} users were successfully activated.')
    activate_users.short_description = "Activate selected users"
    
    def deactivate_users(self, request, queryset):
        """Deactivate selected users"""
        count = queryset.update(is_active=False)
        self.message_user(request, f'{count} users were successfully deactivated.')
    deactivate_users.short_description = "Deactivate selected users"
