import { User } from '../lib/types';

interface AdminHeaderProps {
  user: User;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ user, activeTab, onTabChange, onLogout }) => {
  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <img src="/generated-icon.png" alt="قدرات" className="h-12 w-auto mr-4" /> {/* Added logo */}
          <h1 className="text-2xl font-bold">لوحة تحكم المسؤول</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-700">أهلاً، {user.name}</span>
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
            {user.name.charAt(0)}
          </div>
        </div>
      </div>

      <div className="flex gap-4 flex-wrap border-b border-gray-300 pb-4 mt-4">
        <button 
          className={`py-2 px-4 rounded-t-md transition ${activeTab === 'questionsTab' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
          onClick={() => onTabChange('questionsTab')}
        >
          إدارة الأسئلة
        </button>
        <button 
          className={`py-2 px-4 rounded-t-md transition ${activeTab === 'usersTab' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
          onClick={() => onTabChange('usersTab')}
        >
          إدارة المستخدمين
        </button>
        <button 
          className={`py-2 px-4 rounded-t-md transition ${activeTab === 'testsTab' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
          onClick={() => onTabChange('testsTab')}
        >
          إدارة الاختبارات
        </button>
        <button 
          className={`py-2 px-4 rounded-t-md transition ${activeTab === 'settingsTab' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
          onClick={() => onTabChange('settingsTab')}
        >
          إعدادات النظام
        </button>
        <button 
          className="ml-auto py-2 px-4 rounded-md transition bg-red-500 hover:bg-red-600 text-white"
          onClick={onLogout}
        >
          <i className="fas fa-sign-out-alt ml-1"></i> تسجيل الخروج
        </button>
      </div>
    </div>
  );
};

export default AdminHeader;