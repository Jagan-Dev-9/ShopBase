from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .models import User
from .serializers import UserRegisterSerializer, UserDisplaySerializer, UserSerializer

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    """User registration endpoint"""
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer
    permission_classes = [permissions.AllowAny]

class UserMeView(generics.RetrieveUpdateAPIView):
    """Get and update current user profile"""
    serializer_class = UserDisplaySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class UserListCreateView(generics.ListCreateAPIView):
    """Admin endpoint to list and create users"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        return User.objects.all().order_by('-date_joined')

class UserRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    """Admin endpoint to get, update, or delete a specific user"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return UserDisplaySerializer
        return UserSerializer

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_profile(request):
    """Get current user profile with additional info"""
    serializer = UserDisplaySerializer(request.user)
    return Response({
        'user': serializer.data,
        'is_admin': request.user.role == 'admin',
        'permissions': {
            'can_manage_users': request.user.role == 'admin',
            'can_manage_products': request.user.role == 'admin',
        }
    })

@api_view(['POST'])
@permission_classes([permissions.IsAdminUser])
def toggle_user_status(request, user_id):
    """Toggle user active status"""
    try:
        user = User.objects.get(id=user_id)
        user.is_active = not user.is_active
        user.save()
        return Response({
            'message': f'User {"activated" if user.is_active else "deactivated"} successfully',
            'is_active': user.is_active
        })
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
