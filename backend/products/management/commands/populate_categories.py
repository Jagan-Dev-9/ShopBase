from django.core.management.base import BaseCommand
from django.utils.text import slugify
from products.models import Category

class Command(BaseCommand):
    help = 'Populate database with sample categories'

    def handle(self, *args, **options):
        categories = [
            {
                'name': 'Electronics',
                'description': 'Electronic devices, gadgets, and accessories'
            },
            {
                'name': 'Clothing',
                'description': 'Fashion, apparel, and accessories'
            },
            {
                'name': 'Home & Garden',
                'description': 'Home improvement, furniture, and garden supplies'
            },
            {
                'name': 'Books',
                'description': 'Books, magazines, and educational materials'
            },
            {
                'name': 'Sports & Outdoors',
                'description': 'Sports equipment, outdoor gear, and fitness products'
            },
            {
                'name': 'Health & Beauty',
                'description': 'Health, beauty, and personal care products'
            },
            {
                'name': 'Toys & Games',
                'description': 'Toys, games, and entertainment products'
            },
            {
                'name': 'Automotive',
                'description': 'Car parts, accessories, and automotive supplies'
            }
        ]

        for cat_data in categories:
            slug = slugify(cat_data['name'])
            category, created = Category.objects.get_or_create(
                slug=slug,
                defaults={
                    'name': cat_data['name'],
                    'description': cat_data['description']
                }
            )
            if created:
                self.stdout.write(
                    self.style.SUCCESS(f'Successfully created category: {category.name}')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'Category already exists: {category.name}')
                )

        self.stdout.write(
            self.style.SUCCESS('Successfully populated categories')
        )
