# Smart Parking Management System

A complete IoT-based smart parking solution with real-time vehicle recognition, automated gate control, and live web dashboard.

## 🚀 Features

- **Vehicle Recognition**: OpenCV-based detection using ORB feature matching
- **Automated Gate Control**: Arduino-controlled servo motor with LED indicators
- **Real-time Updates**: Web dashboard polls every 5 seconds for live availability
- **Area-based Logic**: Dynamic parking calculation based on vehicle size
- **Admin Dashboard**: Manage parking spots (add/edit/delete)
- **Color Detection**: HSV-based vehicle color identification

## 📁 Project Structure

```
smart/
├── client/              # React frontend
├── server/              # Node.js backend
├── recognition/         # Python vehicle recognition
├── arduino/             # Arduino gate control code
└── README.md
```

## 🛠️ Setup Instructions

### 1. Backend Server
```bash
cd server
npm install
node index.js
```

### 2. Frontend
```bash
cd client
npm install
npm run dev
```

### 3. Python Recognition System
```bash
cd recognition
pip install -r requirements.txt
python vehicle_recognition.py
```

### 4. Arduino
- Upload code from `arduino/gate_control.txt` to your Arduino
- Connect servo to Pin 9, Green LED to Pin 10, Red LED to Pin 11

## ⚙️ Configuration

### Parking Spot (server/index.js)
- **Sunset Point**: totalArea = 25
- **Car Size**: 20 square units
- **Result**: After 1 car → Full (Red indicator)

### Detection Threshold (recognition/vehicle_recognition.py)
- **Match Threshold**: 5% (0.05)
- **Debug Print**: Shows scores > 3%

### Camera (recognition/config.py)
- **DroidCam**: `http://172.22.238.171:4747/video`
- **Laptop Webcam**: Change to `CAM_URL = 0`

### Arduino (recognition/config.py)
- **Serial Port**: COM11
- **Baud Rate**: 9600

## 🎯 How It Works

1. Camera detects car → Match score > 5%
2. Python sends request to backend API
3. Backend checks: `availableArea >= carSize?`
4. If YES: Gate opens, area updates, website turns RED
5. Arduino: Slow servo movement (7 seconds open)
6. Website: Auto-updates every 5 seconds

## 🔑 Admin Access

- **Email**: `nareshs@student.tce.edu`
- **Features**: Add/Edit/Delete parking spots

## 📊 System Flow

```
Camera → Python (ORB) → Backend API → Arduino (Servo/LED)
                              ↓
                         Website (React)
                         Polls every 5s
```

## 🌐 GitHub Repository

**URL**: https://github.com/Naresh-ado/parking-final-.git

## 📝 Key Files

- `server/index.js` (Line 159): Area calculation logic
- `recognition/vehicle_recognition.py`: Main detection script
- `arduino/gate_control.txt`: Servo control code
- `client/src/components/ParkingTable.jsx`: Real-time polling

## 🧪 Testing

1. Start all services (backend, frontend, recognition)
2. Open http://localhost:5173
3. Show car image to camera
4. Watch gate open and website turn RED

## 📦 Dependencies

### Python
- opencv-python
- numpy
- requests
- pyserial

### Node.js
- express
- cors
- dotenv

### React
- vite
- react

## 🎨 Features Implemented

✅ Vehicle detection with ORB feature matching
✅ Arduino gate control (slow movement)
✅ Real-time web updates (5s polling)
✅ Area-based parking logic
✅ Admin dashboard with authentication
✅ Color detection (HSV)
✅ LED indicators (Green/Red)
✅ Serial communication (Python ↔ Arduino)

## 🔧 Troubleshooting

**Camera not connecting?**
- Check DroidCam IP and WiFi connection
- Or switch to laptop webcam: `CAM_URL = 0`

**Arduino not responding?**
- Verify COM port in config.py
- Check if code is uploaded

**Website not updating?**
- Ensure backend is running on port 5000
- Check browser console for errors

---

**Developed by**: Naresh
**Last Updated**: December 2, 2025
