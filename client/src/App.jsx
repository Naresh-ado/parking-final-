import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import ParkingTable from './components/ParkingTable';
import CameraScanner from './components/CameraScanner';
import AdminDashboard from './components/AdminDashboard';
import SpotDetails from './components/SpotDetails';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [view, setView] = useState('home'); // 'home', 'admin'
  const [selectedSpot, setSelectedSpot] = useState(null); // For details modal

  return (
    <>
      <Header onNavigate={setView} />
      <main>
        {view === 'home' && (
          <>
            <HeroSection
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onScanClick={() => setShowScanner(true)}
            />

            {showScanner && (
              <CameraScanner onClose={() => setShowScanner(false)} />
            )}

            <div className="container" style={{ margin: '40px auto' }}>
              <ParkingTable
                searchQuery={searchQuery}
                onSpotClick={setSelectedSpot}
              />
            </div>
          </>
        )}

        {view === 'admin' && <AdminDashboard />}

        {selectedSpot && (
          <SpotDetails
            spot={selectedSpot}
            onClose={() => setSelectedSpot(null)}
          />
        )}
      </main>
      <Footer />
    </>
  );
}

export default App;
