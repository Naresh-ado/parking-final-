# Testing Guide: Real-time Website Color Updates

## Current Configuration ✅
- **Sunset Point**: totalArea = 25, occupiedArea = 0
- **Car Size**: 24
- **Result**: After 1 car enters → occupiedArea = 24, available = 1 → Car indicator turns RED

## How to Test

### Step 1: Ensure Services are Running
```bash
# Terminal 1 - Backend Server
cd c:\Users\lenovo\OneDrive\Desktop\smart\server
node index.js

# Terminal 2 - Frontend
cd c:\Users\lenovo\OneDrive\Desktop\smart\client
npm run dev

# Terminal 3 - Recognition System
cd c:\Users\lenovo\OneDrive\Desktop\smart
python recognition/vehicle_recognition.py
```

### Step 2: Open Website
- Navigate to: http://localhost:5173
- You should see the parking table with Sunset Point

### Step 3: Fix Camera Connection
Your DroidCam isn't connecting. Options:

**Option A: Fix DroidCam**
1. Ensure DroidCam app is running on your phone
2. Check IP address matches: `172.22.238.171:4747`
3. Phone and PC must be on same WiFi

**Option B: Use Laptop Webcam**
Edit `recognition/config.py`:
```python
CAM_URL = 0  # Use laptop webcam instead
```

### Step 4: Test Detection
1. Show your car image to the camera
2. Watch the terminal for "CAR DETECTED - OPENING GATE"
3. **Immediately check the website** - the car indicator should turn RED within 5 seconds

## Troubleshooting

### Website Not Updating?
- Check browser console (F12) for errors
- Verify backend is running: http://localhost:5000/api/parking
- The website polls every 5 seconds automatically

### Gate Not Opening?
- Check Arduino is on COM11
- Verify Arduino code is uploaded
- Check terminal for "Connected to Arduino on COM11"

### Color Still Green?
- Check current state: `python check_spot.py`
- If occupiedArea is 0, the car didn't enter yet
- If occupiedArea is 24+, it should be red
