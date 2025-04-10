import { User } from '../lib/types';
import { Link } from 'wouter';

interface DashboardHeaderProps {
  title: string;
  user: User;
  onLogout: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title, user, onLogout }) => {
  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center border-b border-gray-300 pb-4 mb-4">
        <h1 className="text-2xl font-bold">{title}</h1>
        <div className="flex items-center gap-3">
          <span className="text-gray-700">أهلاً، {user.name}</span>
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
            {user.name.charAt(0)}
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-medium mb-2">اختباراتك</h2>
          <Link to="/study" className="text-blue-500 hover:text-blue-600">
            تعلم الأسئلة
          </Link>
          <p className="text-gray-700">اختر نوع الاختبار الذي تود أداءه</p>
        </div>
        <button 
          onClick={onLogout}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition"
        >
          <i className="fas fa-sign-out-alt ml-1"></i> تسجيل الخروج
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;
