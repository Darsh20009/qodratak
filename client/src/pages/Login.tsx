import { useState, useEffect } from 'react';
import { User } from '../lib/types';
import LoginForm from '../components/LoginForm';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([
    { id: 1, username: 'admin', name: 'المدير', isAdmin: true },
    { id: 2, username: 'student', name: 'محمد', isAdmin: false }
  ]);

  // Load saved users from localStorage
  useEffect(() => {
    const savedUsers = localStorage.getItem('qudratak_users');
    if (savedUsers) {
      try {
        const parsedUsers = JSON.parse(savedUsers) as User[];
        // Ensure the default admin and student are always available
        const defaultUsers = [
          { id: 1, username: 'admin', name: 'المدير', isAdmin: true },
          { id: 2, username: 'student', name: 'محمد', isAdmin: false }
        ];
        
        // Merge existing users with default users, prioritizing the existing ones
        const existingUsernames = parsedUsers.map(u => u.username);
        const usersToAdd = defaultUsers.filter(u => !existingUsernames.includes(u.username));
        
        setUsers([...parsedUsers, ...usersToAdd]);
      } catch (error) {
        console.error('Error parsing users from localStorage:', error);
      }
    } else {
      // Initialize localStorage with default users
      localStorage.setItem('qudratak_users', JSON.stringify(users));
    }
  }, []);

  const handleAuthAction = (username: string, password: string, isRegistration = false, name = '') => {
    // Clear any previous errors
    setError(null);
    
    if (isRegistration) {
      // Registration logic
      const existingUser = users.find(u => u.username === username);
      
      if (existingUser) {
        setError('اسم المستخدم موجود بالفعل، الرجاء اختيار اسم آخر');
        return;
      }
      
      const newUser: User = {
        id: users.length + 1,
        username,
        name: name || username, // Use the provided name or username as fallback
        isAdmin: false  // New users are never admin by default
      };
      
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      localStorage.setItem('qudratak_users', JSON.stringify(updatedUsers));
      
      // Auto-login after registration
      onLogin(newUser);
    } else {
      // Login logic
      const user = users.find(u => u.username === username);
      
      if (user) {
        onLogin(user);
      } else {
        setError('اسم المستخدم أو كلمة المرور غير صحيحة');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-neutral-200">
      <LoginForm onSubmit={handleAuthAction} error={error} />
    </div>
  );
};

export default Login;
