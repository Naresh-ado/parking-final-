import requests

API_URL = "http://localhost:5000/api/admin/spot"
ADMIN_TOKEN = "Bearer nareshs@student.tce.edu"

headers = {
    "Authorization": ADMIN_TOKEN,
    "Content-Type": "application/json"
}

# Update Spot 1 to have huge capacity and be empty-ish (we can't reset occupied directly via this endpoint easily without logic change, 
# but we can increase totalArea to ensure availableArea > size)
# Wait, the endpoint updates the spot.
# Let's check server/index.js logic for update.
# parkingData[index] = { ...parkingData[index], place, location, totalArea: parseInt(totalArea), isOpen };
# It preserves occupiedArea.
# So if occupiedArea is 500, and we set totalArea to 1000, it should be fine.

data = {
    "id": 1,
    "place": "Sunset Point",
    "location": "Hill Top Road, Sector 4",
    "totalArea": 5000, # Increased from 500
    "isOpen": True
}

try:
    response = requests.post(API_URL, json=data, headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"Error: {e}")
