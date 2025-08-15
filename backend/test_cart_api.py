import requests
import json

# Test cart API endpoints

# Base URL
BASE_URL = 'http://localhost:8000/api'

# Test user credentials (you'll need to create a test user first)
login_data = {
    'username': 'testuser',    # Change to your test user username
    'password': 'testpass123'  # Change to your test user password
}

def test_cart_api():
    print("Testing Cart API...")
    
    # 1. Login to get token
    print("\n1. Logging in...")
    login_response = requests.post(f'{BASE_URL}/accounts/login/', json=login_data)
    print(f"Login status: {login_response.status_code}")
    
    if login_response.status_code != 200:
        print("Login failed!")
        print(login_response.text)
        return
    
    token = login_response.json()['access']
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    # 2. Get cart (should create empty cart if none exists)
    print("\n2. Getting cart...")
    cart_response = requests.get(f'{BASE_URL}/cart/', headers=headers)
    print(f"Cart status: {cart_response.status_code}")
    print(f"Cart data: {cart_response.json()}")
    
    # 3. Add product to cart (using valid product ID)
    print("\n3. Adding product to cart...")
    add_to_cart_data = {
        'product_id': 29,  # Using valid product ID
        'quantity': 2
    }
    add_response = requests.post(f'{BASE_URL}/cart/add/', json=add_to_cart_data, headers=headers)
    print(f"Add to cart status: {add_response.status_code}")
    print(f"Add to cart response: {add_response.json()}")
    
    # 4. Get cart again to see changes
    print("\n4. Getting updated cart...")
    cart_response2 = requests.get(f'{BASE_URL}/cart/', headers=headers)
    print(f"Updated cart: {cart_response2.json()}")

if __name__ == "__main__":
    test_cart_api()
