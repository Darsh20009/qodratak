import { useState } from 'react';
import { User } from '../lib/types';

interface UserManagementProps {
  users: User[];
  onAddUser: (user: Omit<User, 'id'>) => void;
  onDeleteUser: (id: number) => void;
  onUpdateUser: (user: User) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ 
  users, 
  onAddUser, 
  onDeleteUser,
  onUpdateUser
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !name || !password) {
      alert('الرجاء ملء جميع الحقول المطلوبة');
      return;
    }
    
    onAddUser({
      username,
      name,
      password,
      isAdmin
    });
    
    // Reset form
    setUsername('');
    setName('');
    setPassword('');
    setIsAdmin(false);
    setShowAddForm(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingUser || !username || !name) {
      alert('الرجاء ملء جميع الحقول المطلوبة');
      return;
    }
    
    onUpdateUser({
      ...editingUser,
      username,
      name,
      isAdmin
    });
    
    setShowEditForm(false);
    setEditingUser(null);
  };

  const startEdit = (user: User) => {
    setEditingUser(user);
    setUsername(user.username);
    setName(user.name);
    setIsAdmin(user.isAdmin);
    setShowEditForm(true);
  };

  const filteredUsers = users.filter(user => 
    user.username.includes(searchTerm) || 
    user.name.includes(searchTerm)
  );
  
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
        <h2 className="text-2xl font-bold">إدارة المستخدمين</h2>
        
        <div className="flex space-x-4 items-center">
          <input
            type="text"
            placeholder="بحث..."
            className="border border-gray-300 rounded-md p-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition"
          >
            إضافة مستخدم
          </button>
        </div>
      </div>
      
      {showAddForm && (
        <div className="mb-8 border p-4 rounded-lg bg-gray-50">
          <h3 className="text-lg font-medium mb-4">إضافة مستخدم جديد</h3>
          
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">اسم المستخدم</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">الاسم الكامل</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">كلمة المرور</label>
                <input
                  type="password"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isAdmin"
                  className="mr-2"
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                />
                <label htmlFor="isAdmin" className="text-sm font-medium">مشرف</label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition"
              >
                إلغاء
              </button>
              
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition"
              >
                إضافة
              </button>
            </div>
          </form>
        </div>
      )}
      
      {showEditForm && editingUser && (
        <div className="mb-8 border p-4 rounded-lg bg-gray-50">
          <h3 className="text-lg font-medium mb-4">تعديل المستخدم</h3>
          
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">اسم المستخدم</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">الاسم الكامل</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="editIsAdmin"
                  className="mr-2"
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                />
                <label htmlFor="editIsAdmin" className="text-sm font-medium">مشرف</label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => {
                  setShowEditForm(false);
                  setEditingUser(null);
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition"
              >
                إلغاء
              </button>
              
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition"
              >
                حفظ التغييرات
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-right">المعرف</th>
              <th className="py-3 px-4 text-right">اسم المستخدم</th>
              <th className="py-3 px-4 text-right">الاسم الكامل</th>
              <th className="py-3 px-4 text-right">نوع الحساب</th>
              <th className="py-3 px-4 text-right">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{user.id}</td>
                <td className="py-3 px-4">{user.username}</td>
                <td className="py-3 px-4">{user.name}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${user.isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                    {user.isAdmin ? 'مشرف' : 'طالب'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEdit(user)}
                      className="text-blue-500 hover:text-blue-700 transition"
                    >
                      تعديل
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
                          onDeleteUser(user.id);
                        }
                      }}
                      className="text-red-500 hover:text-red-700 transition mr-2"
                    >
                      حذف
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={5} className="py-4 text-center text-gray-500">
                  لا يوجد مستخدمين لعرضها.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;