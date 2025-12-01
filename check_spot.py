import requests

API_URL = "http://localhost:5000/api/parking/1"

try:
    response = requests.get(API_URL)
    data = response.json()
    print(f"Current Data for Spot 1:")
    print(f"Total Area: {data['totalArea']}")
    print(f"Occupied Area: {data['occupiedArea']}")
    print(f"Availability: {data['availability']}")
except Exception as e:
    print(f"Error: {e}")
