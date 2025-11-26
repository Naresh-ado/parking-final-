# Smart Parking Management System

A comprehensive web-based smart parking management solution with real-time parking availability tracking, admin dashboard, and simulated camera scanning features.

## Features

- **Real-time Parking Availability**: Dynamic table showing parking spot status
- **Search Functionality**: Search for parking spots by location or name
- **Camera Scanner Simulation**: Simulated vehicle recognition for live updates
- **Admin Dashboard**: Secure admin panel for managing parking spots
  - Add, edit, and remove parking spots
  - Upload photos for parking locations
  - Manage reviews and ratings
- **Area-based Parking Logic**: Intelligent parking allocation based on vehicle size
- **Detailed Spot View**: Click on any parking spot to view detailed information including reviews and photos
- **Authentication**: Restricted admin access with login/signup functionality

## Tech Stack

### Frontend
- **React** - UI framework
- **Vite** - Build tool and development server
- **CSS3** - Styling with modern design patterns

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (if configured)

## Project Structure

```
smart/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── CameraScanner.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── HeroSection.jsx
│   │   │   ├── LoginModal.jsx
│   │   │   ├── ParkingTable.jsx
│   │   │   ├── SpotDetails.jsx
│   │   │   └── *.css files
│   │   ├── App.jsx        # Main application component
│   │   └── main.jsx       # Application entry point
│   ├── public/            # Static assets
│   ├── package.json       # Frontend dependencies
│   └── node_modules/      # Frontend dependencies (included)
│
└── server/                # Backend Node.js application
    ├── index.js           # Server entry point
    ├── package.json       # Backend dependencies
    └── node_modules/      # Backend dependencies (included)
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Quick Start

Since node_modules are included in this repository, you can run the project directly:

#### 1. Clone the Repository
```bash
git clone https://github.com/Naresh-ado/smart-parking-management.git
cd smart-parking-management
```

#### 2. Run the Backend Server
```bash
cd server
node index.js
```
The server will start on `http://localhost:5000` (or the configured port)

#### 3. Run the Frontend (in a new terminal)
```bash
cd client
npm run dev
```
The client will start on `http://localhost:5173` (Vite default port)

### Alternative: Fresh Installation

If you prefer to install dependencies fresh:

#### Backend Setup
```bash
cd server
npm install
node index.js
```

#### Frontend Setup
```bash
cd client
npm install
npm run dev
```

## Usage

### For Users
1. Open the application in your browser
2. Browse available parking spots in the table
3. Use the search bar to find specific locations
4. Click on any parking spot to view detailed information
5. Use the camera scanner feature to simulate vehicle entry

### For Administrators
1. Click on the Admin/Login button
2. Sign in with authorized credentials (restricted to specific email)
3. Access the admin dashboard to:
   - Add new parking spots
   - Edit existing spot details
   - Remove parking spots
   - Upload photos
   - Manage reviews

## Configuration

### Backend Configuration
Edit `server/index.js` to configure:
- Port number
- Database connection (if using MongoDB)
- API endpoints
- Authentication settings

### Frontend Configuration
Edit relevant component files in `client/src/components/` to customize:
- UI appearance
- API endpoint URLs
- Feature toggles

## Admin Access

Admin access is restricted to specific email addresses. To configure admin emails, check the authentication logic in the backend server.

## Features in Detail

### Real-time Updates
The system simulates real-time parking availability updates through the camera scanner feature, which recognizes vehicles and updates spot availability.

### Area-based Allocation
The backend implements intelligent parking allocation:
- Calculates available parking area
- Matches vehicle size with appropriate spots
- Controls gate access based on availability
- Updates status dynamically for each vehicle type

### Reviews & Ratings
Users can view reviews and ratings for parking locations to make informed decisions.

## Development

### Building for Production

#### Frontend
```bash
cd client
npm run build
```
The production build will be created in the `client/dist` directory.

#### Backend
The backend runs directly with Node.js. For production deployment, consider using:
- PM2 for process management
- Environment variables for configuration
- Reverse proxy (nginx/Apache)

## Troubleshooting

### Port Already in Use
If you encounter port conflicts:
- Change the backend port in `server/index.js`
- Change the frontend port using `--port` flag: `npm run dev -- --port 3000`

### Dependencies Issues
If you face any dependency issues:
```bash
# Remove node_modules and reinstall
rm -rf node_modules
npm install
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Contact

For questions or support, please open an issue on GitHub.

---

**Note**: This project includes node_modules for quick setup. For production deployment, it's recommended to use a fresh `npm install` and configure appropriate .gitignore rules.
