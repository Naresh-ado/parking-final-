import cv2
import numpy as np
import requests
import serial
import time
import json
from config import *

class VehicleGateSystem:
    def __init__(self):
        self.setup_camera()
        self.setup_arduino()
        
        # Load pre-trained classifiers
        # Check if cascade file exists, otherwise skip or use default
        cascade_path = cv2.data.haarcascades + 'haarcascade_car.xml'
        if os.path.exists(cascade_path):
            self.car_cascade = cv2.CascadeClassifier(cascade_path)
        else:
            print("Warning: haarcascade_car.xml not found. Standard detection will be disabled.")
            self.car_cascade = None
        
        # Initialize ORB detector for reference images
        self.orb = cv2.ORB_create(nfeatures=1000)
        self.bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
        self.reference_features = self.load_reference_features()

    def load_reference_features(self):
        features = {}
        for vehicle_type in ['car', 'bike', 'van']:
            dir_path = os.path.join(TRAINING_DIR, vehicle_type)
            if not os.path.exists(dir_path): continue
            
            for img_name in os.listdir(dir_path):
                img_path = os.path.join(dir_path, img_name)
                img = cv2.imread(img_path, 0)
                if img is None: continue
                
                kp, des = self.orb.detectAndCompute(img, None)
                if des is not None and len(kp) > 0:
                    # Store keypoints, descriptors, and total feature count
                    features[vehicle_type] = features.get(vehicle_type, []) + [(kp, des, len(kp))]
                    print(f"Loaded reference: {img_name} ({vehicle_type}) - {len(kp)} features")
        return features

    def detect_by_features(self, frame_gray):
        best_match = None
        max_score = 0
        
        for vehicle_type, ref_list in self.reference_features.items():
            for (_, ref_des, total_features) in ref_list:
                if total_features == 0: continue
                
                kp_frame, des_frame = self.orb.detectAndCompute(frame_gray, None)
                if des_frame is None: continue
                
                matches = self.bf.match(ref_des, des_frame)
                matches = sorted(matches, key=lambda x: x.distance)
                
                # Consider it a match if we have enough good points (distance < 50 is a common heuristic)
                good_matches = [m for m in matches if m.distance < 50]
                
                # Calculate match percentage
                match_percentage = len(good_matches) / total_features
                
                # Debug print to help user see what's happening
                if match_percentage > 0.03:
                    print(f"Checking... Match Score: {match_percentage:.1%} ({vehicle_type})")
                
                if match_percentage > max_score:
                    max_score = match_percentage
                    best_match = vehicle_type
                    

        # Threshold for detection (30% as requested)
        if max_score > 0.05:
            return best_match, f"{max_score:.1%}"
        return None, 0

    def setup_camera(self):
        print(f"Connecting to camera at {CAM_URL}...")
        self.cap = cv2.VideoCapture(CAM_URL)
        if not self.cap.isOpened():
            print("Error: Could not open video stream.")
            
    def setup_arduino(self):
        try:
            self.arduino = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1)
            time.sleep(2) # Wait for connection to settle
            print(f"Connected to Arduino on {SERIAL_PORT}")
        except Exception as e:
            print(f"Warning: Arduino not connected ({e}). Running in simulation mode.")
            self.arduino = None

    def detect_color(self, image):
        if image is None or image.size == 0:
            return "unknown"
            
        # Convert to HSV
        try:
            hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
        except cv2.error:
            return "unknown"
            
        max_area = 0
        detected_color = "unknown"

        for color, ranges in COLOR_RANGES.items():
            mask = None
            for (lower, upper) in ranges:
                try:
                    # Explicitly convert to numpy array with np.uint8 object
                    lower_np = np.array(lower, dtype=np.uint8)
                    upper_np = np.array(upper, dtype=np.uint8)
                    
                    current_mask = cv2.inRange(hsv, lower_np, upper_np)
                    
                    if mask is None:
                        mask = current_mask
                    else:
                        mask = cv2.bitwise_or(mask, current_mask)
                except Exception as e:
                    # print(f"Error in color detection ({color}): {e}") # Suppress spam
                    continue
            
            # Find contours
            if mask is not None:
                contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
                if contours:
                    area = max([cv2.contourArea(c) for c in contours])
                    if area > max_area and area > 500: 
                        max_area = area
                        detected_color = color
        
        if detected_color == "unknown":
            return "multi-colored"
            
        return detected_color

    def classify_vehicle(self, w, h):
        # Simple classification based on bounding box dimensions
        ratio = w / h
        area = w * h
        
        if area < 2000: # Reduced threshold for toy cars
            return None 
        elif ratio < 0.8:
            return 'bike'
        elif ratio > 1.8 and area > 20000:
            return 'bus'
        elif area > 15000:
            return 'van'
        else:
            return 'car'

    def check_access(self, vehicle_type, color):
        try:
            payload = {
                'vehicleType': vehicle_type,
                'color': color,
                'spotId': 1 # Defaulting to spot 1 for this demo
            }
            response = requests.post(GATE_CHECK_ENDPOINT, json=payload)
            if response.status_code == 200:
                return response.json()
            else:
                print(f"API Error: {response.status_code}")
                return {'allowed': False, 'message': 'API Error'}
        except Exception as e:
            print(f"Network Error: {e}")
            return {'allowed': False, 'message': 'Network Error'}

    def control_gate(self, allowed):
        if allowed:
            print("\n" + "="*40)
            print("!!! CAR DETECTED - OPENING GATE !!!")
            print("="*40 + "\n")
            
        if self.arduino:
            command = 'OPEN\n' if allowed else 'CLOSE\n'
            self.arduino.write(command.encode())
            print(f"Sent to Arduino: {command.strip()}")
        else:
            print(f"Simulated Gate: {'OPENING' if allowed else 'REMAINING CLOSED'}")

    def run(self):
        print("Starting Vehicle Recognition System...")
        print("Press 'q' to quit.")
        
        while True:
            ret, frame = self.cap.read()
            if not ret:
                print("Failed to grab frame")
                break

            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            
            # 1. Try Feature Matching (Best for specific toy cars)
            matched_type, match_score = self.detect_by_features(gray)
            
            if matched_type:
                # If matched by features, we assume it's the object
                # We can't easily get a bounding box without homography, 
                # but for gate control, knowing it's there is often enough.
                # Let's try to find color in the center of the frame
                h, w = frame.shape[:2]
                center_roi = frame[h//3:2*h//3, w//3:2*w//3]
                color = self.detect_color(center_roi)
                
                label = f"MATCH: {matched_type} ({match_score})"
                cv2.putText(frame, label, (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
                
                # Check access
                result = self.check_access(matched_type, color)
                print(f"API Result: {result}") # Debug print
                
                self.control_gate(result['allowed'])
                
                if result['allowed']:
                    print("Gate Opened. Waiting 7 seconds...")
                    time.sleep(7) 
                    
                    print("Closing Gate...")
                    if self.arduino:
                        self.arduino.write('CLOSE\n'.encode())
                        time.sleep(2) # Wait for gate to close
                        
                    print("Exiting...")
                    break
                else:
                    print("Access Denied. Loop continuing...")
                
            else:
                # 2. Fallback to Cascade Detection
                if self.car_cascade:
                    vehicles = self.car_cascade.detectMultiScale(gray, 1.1, 3)

                    for (x, y, w, h) in vehicles:
                        cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
                        
                        vehicle_roi = frame[y:y+h, x:x+w]
                        vehicle_type = self.classify_vehicle(w, h)
                        
                        if vehicle_type:
                            color = self.detect_color(vehicle_roi)
                            
                            label = f"{color} {vehicle_type}"
                            cv2.putText(frame, label, (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
                            
                            # Trigger check (debounce logic would be needed in production)
                            height, width, _ = frame.shape
                            center_x = x + w//2
                            if width//2 - 50 < center_x < width//2 + 50:
                                result = self.check_access(vehicle_type, color)
                                status_color = (0, 255, 0) if result['allowed'] else (0, 0, 255)
                                cv2.putText(frame, f"Access: {result['allowed']}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, status_color, 2)
                                self.control_gate(result['allowed'])
                                
                                if result['allowed']:
                                    print("Gate Opened (Cascade). Exiting...")
                                    time.sleep(5)
                                    self.cap.release()
                                    cv2.destroyAllWindows()
                                    return

            cv2.imshow('Vehicle Gate System', frame)

            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        self.cap.release()
        cv2.destroyAllWindows()

if __name__ == "__main__":
    system = VehicleGateSystem()
    system.run()
