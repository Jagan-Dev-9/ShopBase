from django.shortcuts import render
from rest_framework import generics, permissions
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Product, Category
from .serializers import ProductSerializer, CategorySerializer

# Category Views
class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]

class CategoryDetailView(generics.RetrieveAPIView):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

# Product Views
class ProductListView(generics.ListAPIView):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'category__slug']
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'created_at', 'name']
    ordering = ['-created_at']
    pagination_class = None  # Disable pagination for products

class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]

class ProductCreateView(generics.CreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAdminUser]  # Only admin

class ProductUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAdminUser]  # Only admin

class ProductDeleteView(generics.DestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAdminUser]  # Only admin

# Products by Category
class ProductsByCategoryView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'created_at', 'name']
    ordering = ['-created_at']

    def get_queryset(self):
        category_slug = self.kwargs['category_slug']
        return Product.objects.filter(category__slug=category_slug, is_active=True)
