import { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import Footer from './components/Footer';
import Login from './components/Login';
import { isAuthenticated, getCurrentUser } from './utils/auth';

interface User {
  id: string;
  email: string;
  name: string;
}

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  const [user, setUser] = useState<User | null>(() => getCurrentUser());
  const [mainWindowColor, setMainWindowColor] = useState<string>('#ffffff');
  const [accountPanelOpacity, setAccountPanelOpacity] = useState<number>(100);
  const [accountPanelTopOffset, setAccountPanelTopOffset] = useState<number>(0);

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

  const handleLoginSuccess = (userData: User) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  // Update user when component mounts if already logged in
  useEffect(() => {
    if (isLoggedIn && !user) {
      const currentUser = getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
    }
  }, [isLoggedIn, user]);

  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="flex flex-col h-screen">
      <Header 
        onMenuClick={() => setIsSidebarOpen(true)}
        showMenuButton={!isLargeScreen}
        onLogout={() => {
          setUser(null);
          setIsLoggedIn(false);
        }}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isOpen={isSidebarOpen || isLargeScreen}
          onClose={() => setIsSidebarOpen(false)}
          onColorChange={setMainWindowColor}
          currentColor={mainWindowColor}
          onOpacityChange={setAccountPanelOpacity}
          currentOpacity={accountPanelOpacity}
          onTopOffsetChange={setAccountPanelTopOffset}
          currentTopOffset={accountPanelTopOffset}
        />
        
        <div className="flex flex-col flex-1">
          <MainContent 
            user={user} 
            backgroundColor={mainWindowColor} 
            accountPanelOpacity={accountPanelOpacity}
            accountPanelTopOffset={accountPanelTopOffset}
          />
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default App;
