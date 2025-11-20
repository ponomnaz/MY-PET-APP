// Имитация JWT токена (в реальности генерируется на бэкенде)
interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

// База данных пользователей (только эти могут войти)
const MOCK_USERS = [
  { id: '1', email: 'admin@example.com', password: 'admin123', name: 'Администратор' },
  { id: '2', email: 'user@example.com', password: 'user123', name: 'Пользователь' }
];

// Генерация mock JWT токена
const generateMockToken = (user: User): string => {
  const payload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    iat: Date.now(),
    exp: Date.now() + 3600000 // 1 час
  };
  
  // Простое кодирование без btoa
  return `mock.${encodeURIComponent(JSON.stringify(payload))}.signature`;
};

// Декодирование токена
export const decodeToken = (token: string): User | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3 || parts[0] !== 'mock') return null;
    
    const payload = JSON.parse(decodeURIComponent(parts[1]));
    
    // Проверка истечения токена
    if (payload.exp < Date.now()) {
      return null;
    }
    
    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
    };
  } catch {
    return null;
  }
};

// Имитация API входа
export const mockLogin = async (email: string, password: string): Promise<AuthResponse> => {
  // Имитация задержки сети
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const user = MOCK_USERS.find(u => u.email === email && u.password === password);
  
  if (!user) {
    throw new Error('Неверный email или пароль');
  }
  
  const { password: _, ...userWithoutPassword } = user;
  const token = generateMockToken(userWithoutPassword);
  
  return {
    token,
    user: userWithoutPassword,
  };
};

// Сохранение токена
export const setAuthToken = (token: string) => {
  localStorage.setItem('authToken', token);
};

// Получение токена
export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Удаление токена
export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

// Проверка авторизации
export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  if (!token) return false;
  
  const user = decodeToken(token);
  return user !== null;
};

// Получение текущего пользователя
export const getCurrentUser = (): User | null => {
  const token = getAuthToken();
  if (!token) return null;
  
  return decodeToken(token);
};

// Получить список всех пользователей (для отображения на форме входа)
export const getMockUsers = () => {
  return MOCK_USERS.map(({ password: _, ...user }) => user);
};