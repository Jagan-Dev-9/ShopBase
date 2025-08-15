from django.urls import path
from .views import (
    RegisterView, UserMeView, UserListCreateView, 
    UserRetrieveUpdateDeleteView, user_profile, toggle_user_status
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # Authentication endpoints
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # User profile endpoints
    path('me/', UserMeView.as_view(), name='user-me'),
    path('profile/', user_profile, name='user-profile'),
    
    # Admin user management endpoints
    path('users/', UserListCreateView.as_view(), name='user-list-create'),
    path('users/<int:pk>/', UserRetrieveUpdateDeleteView.as_view(), name='user-detail'),
    path('users/<int:user_id>/toggle-status/', toggle_user_status, name='toggle-user-status'),
]
