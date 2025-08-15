from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import User

User = get_user_model()

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    
    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'role', 'first_name', 'last_name')
        extra_kwargs = {
            'role': {'read_only': True},  # Users can't set their own role
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        # Remove password from validated_data and handle separately
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

class UserSerializer(serializers.ModelSerializer):
    """Full user serializer for admin operations"""
    password = serializers.CharField(write_only=True, required=False, validators=[validate_password])
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'role', 'first_name', 'last_name', 'date_joined', 'is_active']
        extra_kwargs = {
            'password': {'write_only': True},
            'date_joined': {'read_only': True},
        }

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance

class UserDisplaySerializer(serializers.ModelSerializer):
    """Serializer for displaying user info (no sensitive data)"""
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role', 'first_name', 'last_name', 'date_joined', 'is_active')
