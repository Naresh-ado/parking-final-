import os

# Camera Settings
CAM_URL = "http://172.22.238.171:4747/video"
# If using a local webcam, set to 0 or 1
# CAM_URL = 0 

# Vehicle Sizes (Must match server/index.js)
VEHICLE_SIZES = {
    'bike': 2,
    'car': 10,
    'van': 15,
    'bus': 25
}

# Color Detection Ranges (HSV)
# Note: These may need tuning based on lighting conditions
COLOR_RANGES = {
    'red': [([0, 120, 70], [10, 255, 255]), ([170, 120, 70], [180, 255, 255])],
    'green': [([36, 25, 25], [86, 255, 255])],
    'blue': [([94, 80, 2], [126, 255, 255])],
    'white': [([0, 0, 200], [180, 20, 255])],
    'black': [([0, 0, 0], [180, 255, 30])]
}

# Arduino Settings
SERIAL_PORT = 'COM11'  # Change this to your Arduino port
BAUD_RATE = 9600

# API Settings
API_BASE_URL = "http://localhost:5000/api"
GATE_CHECK_ENDPOINT = f"{API_BASE_URL}/gate/check-entry"

# Image Storage
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TRAINING_DIR = os.path.join(BASE_DIR, "training_images")
