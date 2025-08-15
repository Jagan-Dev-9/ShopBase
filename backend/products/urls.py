from django.urls import path
from .views import (
    ProductListView, ProductDetailView,
    ProductCreateView, ProductUpdateView, ProductDeleteView,
    CategoryListView, CategoryDetailView, ProductsByCategoryView
)

urlpatterns = [
    # Product URLs
    path('', ProductListView.as_view(), name='product-list'),
    path('<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
    path('create/', ProductCreateView.as_view(), name='product-create'),
    path('<int:pk>/update/', ProductUpdateView.as_view(), name='product-update'),
    path('<int:pk>/delete/', ProductDeleteView.as_view(), name='product-delete'),
    
    # Category URLs
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('categories/<slug:slug>/', CategoryDetailView.as_view(), name='category-detail'),
    path('categories/<slug:category_slug>/products/', ProductsByCategoryView.as_view(), name='products-by-category'),
]
