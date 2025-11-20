import { useState } from 'react';
import { mockLogin, setAuthToken } from '../utils/auth';

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login = ({ onLoginSuccess }: LoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await mockLogin(email, password);
      setAuthToken(response.token);
      onLoginSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  // Быстрый вход (для удобства тестирования)
  const quickLogin = async (testEmail: string, testPassword: string) => {
    setEmail(testEmail);
    setPassword(testPassword);
    setError('');
    setLoading(true);

    try {
      const response = await mockLogin(testEmail, testPassword);
      setAuthToken(response.token);
      onLoginSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Вход в систему
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="example@mail.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 font-medium"
          >
            {loading ? 'Загрузка...' : 'Войти'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="font-semibold mb-3 text-gray-700 text-sm">Тестовые аккаунты:</p>
          
          <div className="space-y-2">
            <button
              onClick={() => quickLogin('admin@example.com', 'admin123')}
              disabled={loading}
              className="w-full text-left px-3 py-2 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors text-sm disabled:opacity-50"
            >
              <span className="font-medium">👤 Администратор</span>
              <br />
              <span className="text-xs text-gray-600">admin@example.com / admin123</span>
            </button>
            
            <button
              onClick={() => quickLogin('user@example.com', 'user123')}
              disabled={loading}
              className="w-full text-left px-3 py-2 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors text-sm disabled:opacity-50"
            >
              <span className="font-medium">👤 Пользователь</span>
              <br />
              <span className="text-xs text-gray-600">user@example.com / user123</span>
            </button>
            
            <button
              onClick={() => quickLogin('test@example.com', 'test123')}
              disabled={loading}
              className="w-full text-left px-3 py-2 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors text-sm disabled:opacity-50"
            >
              <span className="font-medium">👤 Неверный Пользователь</span>
              <br />
              <span className="text-xs text-gray-600">test@example.com / test123</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;