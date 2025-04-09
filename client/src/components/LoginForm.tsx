import { useState } from 'react';

interface LoginFormProps {
  onSubmit: (username: string, password: string) => void;
  error: string | null;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, error }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(username, password);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">قدراتك</h1>
        <p className="text-gray-700 mt-2">منصة اختبارات القدرات الشاملة</p>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-right">
          <label htmlFor="username" className="block font-medium mb-1">اسم المستخدم</label>
          <input 
            type="text" 
            id="username" 
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required 
          />
        </div>
        
        <div className="text-right">
          <label htmlFor="password" className="block font-medium mb-1">كلمة المرور</label>
          <input 
            type="password" 
            id="password" 
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </div>
        
        <div className="pt-2">
          <button 
            type="submit" 
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium p-3 rounded-md transition"
          >
            تسجيل الدخول
          </button>
        </div>
      </form>
      
      <div className="mt-6 text-center text-gray-700">
        ليس لديك حساب؟ <a href="#" className="text-blue-500 hover:underline">إنشاء حساب جديد</a>
      </div>
      
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>للتجربة، استخدم:</p>
        <p>اسم المستخدم: admin أو student</p>
        <p>كلمة المرور: password</p>
      </div>
    </div>
  );
};

export default LoginForm;
