import { useState } from 'react';

interface LoginFormProps {
  onSubmit: (username: string, password: string, isRegistration?: boolean, name?: string) => void;
  error: string | null;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, error }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegistering && !name) {
      alert('الرجاء إدخال الاسم');
      return;
    }
    onSubmit(username, password, isRegistering, name);
  };

  const toggleForm = () => {
    setIsRegistering(!isRegistering);
    setUsername('');
    setPassword('');
    setName('');
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
        {isRegistering && (
          <div className="text-right">
            <label htmlFor="name" className="block font-medium mb-1">الاسم</label>
            <input 
              type="text" 
              id="name" 
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
            />
          </div>
        )}
        
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
            {isRegistering ? 'إنشاء حساب' : 'تسجيل الدخول'}
          </button>
        </div>
      </form>
      
      <div className="mt-6 text-center text-gray-700">
        {isRegistering ? 'لديك حساب بالفعل؟' : 'ليس لديك حساب؟'} 
        <button 
          onClick={toggleForm}
          className="text-blue-500 hover:underline pr-1"
        >
          {isRegistering ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
