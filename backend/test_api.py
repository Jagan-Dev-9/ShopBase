import requests
import json

# Test the new category and product endpoints
base_url = "http://127.0.0.1:8000/api/products"

def test_endpoints():
    print("🧪 Testing Category and Product API Endpoints\n")
    
    # Test 1: Get all categories
    print("1. Testing Categories List:")
    try:
        response = requests.get(f"{base_url}/categories/")
        if response.status_code == 200:
            categories = response.json()
            print(f"✅ Found {len(categories)} categories")
            for cat in categories[:3]:  # Show first 3
                print(f"   - {cat['name']} ({cat['slug']}) - {cat['products_count']} products")
        else:
            print(f"❌ Failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    print()
    
    # Test 2: Get all products
    print("2. Testing Products List:")
    try:
        response = requests.get(f"{base_url}/")
        if response.status_code == 200:
            products = response.json()
            print(f"✅ Found {len(products)} products")
            for prod in products[:3]:  # Show first 3
                category_name = prod.get('category_name', 'No Category')
                print(f"   - {prod['name']} - ${prod['price']} - Category: {category_name}")
        else:
            print(f"❌ Failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    print()
    
    # Test 3: Test filtering by category
    print("3. Testing Category Filtering:")
    try:
        response = requests.get(f"{base_url}/?category__slug=electronics")
        if response.status_code == 200:
            electronics = response.json()
            print(f"✅ Found {len(electronics)} electronics products")
        else:
            print(f"❌ Failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    print()
    
    # Test 4: Get specific category
    print("4. Testing Category Detail:")
    try:
        response = requests.get(f"{base_url}/categories/electronics/")
        if response.status_code == 200:
            category = response.json()
            print(f"✅ Electronics category: {category['name']} - {category['products_count']} products")
        else:
            print(f"❌ Failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    print("\n🎉 API Testing Complete!")

if __name__ == "__main__":
    test_endpoints()
