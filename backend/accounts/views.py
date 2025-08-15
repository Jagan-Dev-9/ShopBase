from rest_framework import generics, permissions
from .models import User
from .serializers import UserRegisterSerializer, UserDisplaySerializer

class UserRegisterView(generics.CreateAPIView):
	queryset = User.objects.all()
	serializer_class = UserRegisterSerializer
	permission_classes = [permissions.AllowAny]

class UserMeView(generics.RetrieveAPIView):
	serializer_class = UserDisplaySerializer
	permission_classes = [permissions.IsAuthenticated]

	def get_object(self):
		return self.request.user

# Create your views here.
