# Vehicle Recognition & Gate Control System

This system uses computer vision to detect vehicles and control a parking gate via Arduino.

## Setup

1.  **Install Python Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

2.  **Configure System**:
    - Edit `config.py` to set your Camera URL and Arduino Serial Port.
    - Ensure `CAM_URL` points to your DroidCam IP (e.g., `http://172.22.238.171:4747/video`).

3.  **Arduino Setup**:
    - Upload `../arduino/gate_control.txt` (content) to your Arduino board using the Arduino IDE.
    - Connect Servo Signal to Pin 9.
    - Connect Green LED to Pin 10.
    - Connect Red LED to Pin 11.

4.  **Run the System**:
    - Start the Node.js backend: `node server/index.js`
    - Start the recognition script: `python recognition/vehicle_recognition.py`

## Usage

- The system will automatically detect vehicles in the camera feed.
- It identifies the vehicle type (Car, Bike, Van) and color.
- It checks availability with the backend server.
- If space is available:
    - Gate opens (Servo 90°)
    - Green LED turns ON
- If space is full:
    - Gate stays closed (Servo 0°)
    - Red LED turns ON

## Troubleshooting

- **Camera not opening**: Check DroidCam IP and ensure phone and PC are on the same Wi-Fi.
- **Arduino error**: Check COM port in `config.py`.
- **API Error**: Ensure Node.js server is running on port 5000.
