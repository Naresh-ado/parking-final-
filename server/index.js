const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- Constants & Data Models ---

const VEHICLE_SIZES = {
  bike: 2,
  car: 20,
  van: 15,
  bus: 25
};

const ADMIN_EMAIL = "nareshs@student.tce.edu";

// In-memory storage
let parkingData = [
  {
    id: 1,
    place: 'Sunset Point',
    location: 'Hill Top Road, Sector 4',
    isOpen: true,
    totalArea: 25,
    occupiedArea: 0,
    availability: { bike: true, car: true, van: true, bus: true },
    reviews: [],
    images: []
  },
  {
    id: 2,
    place: 'Market Square',
    location: 'Main Bazaar, City Center',
    isOpen: true,
    totalArea: 300,
    occupiedArea: 280,
    availability: { bike: true, car: false, van: false, bus: false },
    reviews: [],
    images: []
  },
  {
    id: 3,
    place: 'River Side',
    location: 'River Bank, Near Bridge',
    isOpen: false,
    totalArea: 1000,
    occupiedArea: 0,
    availability: { bike: false, car: false, van: false, bus: false },
    reviews: [],
    images: []
  }
];

// Helper to recalculate availability based on area
const updateAvailability = (spot) => {
  const availableArea = spot.totalArea - spot.occupiedArea;
  spot.availability = {
    bike: availableArea >= VEHICLE_SIZES.bike,
    car: availableArea >= VEHICLE_SIZES.car,
    van: availableArea >= VEHICLE_SIZES.van,
    bus: availableArea >= VEHICLE_SIZES.bus
  };
};

// Initialize availability on start
parkingData.forEach(updateAvailability);

// --- Middleware ---

const requireAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${ADMIN_EMAIL}`) {
    return res.status(403).json({ success: false, message: 'Unauthorized' });
  }
  next();
};

// --- Routes ---

// 1. Public Data
app.get('/api/parking', (req, res) => {
  res.json(parkingData);
});

app.get('/api/parking/:id', (req, res) => {
  const spot = parkingData.find(p => p.id === parseInt(req.params.id));
  if (spot) res.json(spot);
  else res.status(404).json({ message: 'Spot not found' });
});

// 2. Auth
app.post('/api/auth/login', (req, res) => {
  const { email } = req.body;
  if (email === ADMIN_EMAIL) {
    res.json({ success: true, token: email, role: 'admin' });
  } else {
    res.json({ success: true, token: email, role: 'user' });
  }
});

// 3. Gate Control / Simulation Logic
app.post('/api/gate/entry', (req, res) => {
  const { spotId, vehicleType } = req.body; // vehicleType: 'bike', 'car', 'van', 'bus'
  const spot = parkingData.find(p => p.id === parseInt(spotId));

  if (!spot) return res.status(404).json({ success: false, message: 'Spot not found' });
  if (!spot.isOpen) return res.json({ allowed: false, message: 'Parking is Closed' });

  const size = VEHICLE_SIZES[vehicleType.toLowerCase()];
  if (!size) return res.status(400).json({ success: false, message: 'Invalid vehicle type' });

  const availableArea = spot.totalArea - spot.occupiedArea;

  if (availableArea >= size) {
    // Allow entry
    spot.occupiedArea += size;
    updateAvailability(spot);

    // Simulate Arduino Signal
    console.log(`[ARDUINO] OPEN GATE at ${spot.place} for ${vehicleType}`);

    res.json({
      allowed: true,
      message: `Welcome! Gate Opening for ${vehicleType}.`,
      updatedSpot: spot
    });
  } else {
    // Deny entry
    res.json({
      allowed: false,
      message: `Parking Full for ${vehicleType}. Required: ${size}, Available: ${availableArea}`,
      updatedSpot: spot
    });
  }
});

// 3.1 Gate Check Entry (For Python Recognition System)
app.post('/api/gate/check-entry', (req, res) => {
  const { spotId, vehicleType, color } = req.body;
  const spot = parkingData.find(p => p.id === parseInt(spotId));

  if (!spot) return res.status(404).json({ allowed: false, message: 'Spot not found' });
  if (!spot.isOpen) return res.json({ allowed: false, message: 'Parking is Closed' });

  const size = VEHICLE_SIZES[vehicleType.toLowerCase()];
  if (!size) return res.status(400).json({ allowed: false, message: 'Invalid vehicle type' });

  const availableArea = spot.totalArea - spot.occupiedArea;

  if (availableArea >= size) {
    // Allow entry
    spot.occupiedArea += size;
    updateAvailability(spot);

    console.log(`[RECOGNITION] Allowed ${color} ${vehicleType} at ${spot.place}`);

    res.json({
      allowed: true,
      message: `Welcome! Gate Opening for ${color} ${vehicleType}.`,
      updatedSpot: spot
    });
  } else {
    // Deny entry
    console.log(`[RECOGNITION] Denied ${color} ${vehicleType} at ${spot.place} (Full)`);
    res.json({
      allowed: false,
      message: `Parking Full for ${vehicleType}.`,
      updatedSpot: spot
    });
  }
});

// 4. Admin Management
app.post('/api/admin/spot', requireAdmin, (req, res) => {
  const { id, place, location, totalArea, isOpen } = req.body;

  if (id) {
    // Update existing
    const index = parkingData.findIndex(p => p.id === id);
    if (index !== -1) {
      parkingData[index] = { ...parkingData[index], place, location, totalArea: parseInt(totalArea), isOpen };
      updateAvailability(parkingData[index]);
      res.json({ success: true, data: parkingData[index] });
    } else {
      res.status(404).json({ success: false, message: 'Spot not found' });
    }
  } else {
    // Create new
    const newSpot = {
      id: Date.now(),
      place,
      location,
      totalArea: parseInt(totalArea),
      occupiedArea: 0,
      isOpen: isOpen !== undefined ? isOpen : true,
      reviews: [],
      images: []
    };
    updateAvailability(newSpot);
    parkingData.push(newSpot);
    res.json({ success: true, data: newSpot });
  }
});

app.delete('/api/admin/spot/:id', requireAdmin, (req, res) => {
  const id = parseInt(req.params.id);
  parkingData = parkingData.filter(p => p.id !== id);
  res.json({ success: true });
});

// 5. User Features (Reviews & Photos)
app.post('/api/spot/:id/review', (req, res) => {
  const { user, rating, comment } = req.body;
  const spot = parkingData.find(p => p.id === parseInt(req.params.id));
  if (spot) {
    spot.reviews.push({ user, rating, comment, date: new Date().toISOString() });
    res.json({ success: true, data: spot });
  } else {
    res.status(404).json({ success: false, message: 'Spot not found' });
  }
});

app.post('/api/spot/:id/photo', (req, res) => {
  const { imageUrl, user } = req.body;
  const spot = parkingData.find(p => p.id === parseInt(req.params.id));
  if (spot) {
    spot.images.push({ url: imageUrl, user, date: new Date().toISOString() });
    res.json({ success: true, data: spot });
  } else {
    res.status(404).json({ success: false, message: 'Spot not found' });
  }
});

// Simulated image analysis endpoint (Updated to return vehicle type)
app.post('/api/analyze', (req, res) => {
  // Simulate detecting a random vehicle
  const types = ['bike', 'car', 'van', 'bus'];
  const detected = types[Math.floor(Math.random() * types.length)];
  res.json({ success: true, detectedVehicle: detected });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
