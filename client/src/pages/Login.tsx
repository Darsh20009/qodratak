import { useState } from 'react';
import { User } from '../lib/types';
import LoginForm from '../components/LoginForm';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (username: string, password: string) => {
    // Clear any previous errors
    setError(null);
    
    // Simulate authentication with mock data for demo purposes
    // In a real application, this would be an API call
    const mockUsers: User[] = [
      { id: 1, username: 'admin', name: 'المدير', isAdmin: true },
      { id: 2, username: 'student', name: 'محمد', isAdmin: false }
    ];
    
    const user = mockUsers.find(u => u.username === username);
    
    if (user && password === 'password') {
      onLogin(user);
    } else {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-neutral-200">
      <LoginForm onSubmit={handleLogin} error={error} />
    </div>
  );
};

export default Login;
