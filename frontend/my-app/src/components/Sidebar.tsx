interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
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
            ✕
          </button>
        </div>
        
        <nav>
          <ul className="space-y-3">
            <li>
              <a href="#" className="block hover:bg-gray-700 p-2 rounded">
                Главная
              </a>
            </li>
            <li>
              <a href="#" className="block hover:bg-gray-700 p-2 rounded">
                О проекте
              </a>
            </li>
            <li>
              <a href="#" className="block hover:bg-gray-700 p-2 rounded">
                Контакты
              </a>
            </li>
            <li>
              <a href="#" className="block hover:bg-gray-700 p-2 rounded">
                Настройки
              </a>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
