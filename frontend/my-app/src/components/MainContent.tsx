interface User {
  id: string;
  email: string;
  name: string;
}

interface MainContentProps {
  user: User | null;
}

const MainContent = ({ user }: MainContentProps) => {
  if (!user) {
    return (
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            Загрузка...
          </h2>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-8 overflow-auto">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          Добро пожаловать, {user.name}!
        </h2>
        
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Информация об аккаунте
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-32 text-sm font-medium text-gray-600">
                ID:
              </div>
              <div className="flex-1 text-gray-800 font-mono text-sm">
                {user.id}
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-32 text-sm font-medium text-gray-600">
                Email:
              </div>
              <div className="flex-1 text-gray-800">
                {user.email}
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-32 text-sm font-medium text-gray-600">
                Имя:
              </div>
              <div className="flex-1 text-gray-800">
                {user.name}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mt-6">
          <h3 className="font-semibold text-blue-800 mb-2">Особенности:</h3>
          <ul className="list-disc list-inside text-blue-700 space-y-1">
            <li>Скрываемая боковая панель</li>
            <li>Отображение информации об аккаунте</li>
          </ul>
        </div>
      </div>
    </main>
  );
};

export default MainContent;