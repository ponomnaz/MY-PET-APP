import { useState, useEffect } from 'react';
import { getCurrentUser, removeAuthToken } from '../utils/auth';

interface HeaderProps {
  onMenuClick: () => void;
  showMenuButton: boolean;
  onLogout: () => void;
}

const Header = ({ onMenuClick, showMenuButton, onLogout }: HeaderProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const user = getCurrentUser();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const handleLogout = () => {
    removeAuthToken();
    onLogout();
  };

  return (
    <header className="bg-blue-600 text-white p-4 shadow-md relative z-30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showMenuButton && (
            <button
              onClick={onMenuClick}
              className="text-white hover:bg-blue-700 p-2 rounded transition-colors"
              aria-label="Открыть меню"
            >
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              </svg>
            </button>
          )}
          <h1 className="text-xl md:text-2xl font-bold">Мое Приложение</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-sm md:text-base font-medium">
              {formatTime(currentTime)}
            </div>
            <div className="text-xs md:text-sm opacity-90">
              {formatDate(currentTime)}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm hidden md:inline">👤 {user?.name}</span>
            <button
              onClick={handleLogout}
              className="bg-blue-700 hover:bg-blue-800 px-3 py-1.5 rounded text-sm transition-colors"
            >
              Выход
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
