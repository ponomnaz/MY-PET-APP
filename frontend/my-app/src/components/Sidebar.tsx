import { useState } from 'react';
import ColorPicker from './ColorPicker';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onColorChange: (color: string) => void;
  currentColor: string;
  onOpacityChange: (opacity: number) => void;
  currentOpacity: number;
  onTopOffsetChange: (offset: number) => void;
  currentTopOffset: number;
}

const Sidebar = ({ isOpen, onClose, onColorChange, currentColor, onOpacityChange, currentOpacity, onTopOffsetChange, currentTopOffset }: SidebarProps) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showOpacitySlider, setShowOpacitySlider] = useState(false);
  const [showPositionSlider, setShowPositionSlider] = useState(false);
  return (
    <>
      {/* Overlay для мобильных устройств */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-10"
          onClick={onClose}
        />
      )}
      
      {/* Сайдбар */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-20
          w-64 bg-gray-800 text-white p-6
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex justify-between items-center mb-6 lg:block">
          <h2 className="text-xl font-semibold">Меню</h2>
          <button
            onClick={onClose}
            className="lg:hidden text-white hover:text-gray-300"
          >
          </button>
        </div>
        
        <nav>
          <ul className="space-y-3">
            <li>
              <a href="#" className="block hover:bg-gray-700 p-2 rounded">
                Изменить шрифт
              </a>
            </li>
            <li>
              <button
                onClick={() => setShowPositionSlider(!showPositionSlider)}
                className="w-full text-left block hover:bg-gray-700 p-2 rounded"
              >
                Изменить по высоте
              </button>
              {showPositionSlider && (
                <div className="mt-2 ml-4 p-3 bg-gray-700 rounded">
                  <label className="block text-sm mb-2 font-semibold">
                    Позиция панели: {currentTopOffset > 0 ? `+${currentTopOffset}` : currentTopOffset}px
                  </label>
                  <input
                    type="range"
                    min="-500"
                    max="500"
                    value={currentTopOffset}
                    onChange={(e) => onTopOffsetChange(Number(e.target.value))}
                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #374151 0%, #4b5563 50%, #374151 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Вверх (-500px)</span>
                    <span>По центру (0px)</span>
                    <span>Вниз (+500px)</span>
                  </div>
                  <button
                    onClick={() => {
                      onTopOffsetChange(0);
                      setShowPositionSlider(false);
                    }}
                    className="mt-2 px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm transition-colors"
                    title="Сбросить на 0"
                  >
                    ↺ Сбросить
                  </button>
                </div>
              )}
            </li>
            <li>
              <button
                onClick={() => setShowOpacitySlider(!showOpacitySlider)}
                className="w-full text-left block hover:bg-gray-700 p-2 rounded"
              >
                Изменить прозрачность
              </button>
              {showOpacitySlider && (
                <div className="mt-2 ml-4 p-3 bg-gray-700 rounded">
                  <label className="block text-sm mb-2 font-semibold">
                    Прозрачность панели: {currentOpacity}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={currentOpacity}
                    onChange={(e) => onOpacityChange(Number(e.target.value))}
                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #4b5563 0%, #4b5563 ${currentOpacity}%, #374151 ${currentOpacity}%, #374151 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Прозрачно (0%)</span>
                    <span>Непрозрачно (100%)</span>
                  </div>
                  <button
                    onClick={() => {
                      onOpacityChange(100);
                      setShowOpacitySlider(false);
                    }}
                    className="mt-2 px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm transition-colors"
                    title="Сбросить на 100%"
                  >
                    ↺ Сбросить
                  </button>
                </div>
              )}
            </li>
            <li>
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="w-full text-left block hover:bg-gray-700 p-2 rounded"
              >
                Изменить цвет
              </button>
              {showColorPicker && (
                <ColorPicker
                  currentColor={currentColor}
                  onColorChange={onColorChange}
                />
              )}
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
