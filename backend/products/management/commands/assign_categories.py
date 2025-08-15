from django.core.management.base import BaseCommand
from products.models import Product, Category
import random

class Command(BaseCommand):
    help = 'Assign existing products to random categories'

    def handle(self, *args, **options):
        products = Product.objects.filter(category__isnull=True)
        categories = list(Category.objects.all())
        
        if not categories:
            self.stdout.write(
                self.style.ERROR('No categories found. Run populate_categories first.')
            )
            return
        
        updated_count = 0
        for product in products:
            # Assign random category based on product name
            category = self.assign_category_by_name(product.name, categories)
            product.category = category
            product.save()
            updated_count += 1
            self.stdout.write(
                self.style.SUCCESS(f'Assigned {product.name} to {category.name}')
            )
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully updated {updated_count} products')
        )
    
    def assign_category_by_name(self, product_name, categories):
        name_lower = product_name.lower()
        
        # Simple keyword-based category assignment
        if any(word in name_lower for word in ['phone', 'laptop', 'computer', 'headphone', 'electronic']):
            return next((cat for cat in categories if cat.slug == 'electronics'), random.choice(categories))
        elif any(word in name_lower for word in ['shirt', 'pants', 'dress', 'shoes', 'clothing']):
            return next((cat for cat in categories if cat.slug == 'clothing'), random.choice(categories))
        elif any(word in name_lower for word in ['book', 'novel', 'guide']):
            return next((cat for cat in categories if cat.slug == 'books'), random.choice(categories))
        elif any(word in name_lower for word in ['toy', 'game', 'play']):
            return next((cat for cat in categories if cat.slug == 'toys-games'), random.choice(categories))
        elif any(word in name_lower for word in ['beauty', 'health', 'care', 'cosmetic']):
            return next((cat for cat in categories if cat.slug == 'health-beauty'), random.choice(categories))
        else:
            return random.choice(categories)
