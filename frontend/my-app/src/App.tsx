import { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import Footer from './components/Footer';
import Login from './components/Login';
import { isAuthenticated } from './utils/auth';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());

  useEffect(() => {
    const handleResize = () => {
      const isLarge = window.innerWidth >= 1024;
      setIsLargeScreen(isLarge);
      
      if (!isLarge) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isLoggedIn) {
    return <Login onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="flex flex-col h-screen">
      <Header 
        onMenuClick={() => setIsSidebarOpen(true)}
        showMenuButton={!isLargeScreen}
        onLogout={() => setIsLoggedIn(false)}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isOpen={isSidebarOpen || isLargeScreen}
          onClose={() => setIsSidebarOpen(false)}
        />
        
        <div className="flex flex-col flex-1">
          <MainContent />
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default App;
