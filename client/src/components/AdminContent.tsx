import { Question, User } from '../lib/types';
import QuestionForm from './QuestionForm';
import QuestionsList from './QuestionsList';
import DatabaseDiagnostics from './DatabaseDiagnostics';
import UserManagement from './UserManagement';
import ImportQuestions from './ImportQuestions';
import SystemSettings from './SystemSettings';

interface AdminContentProps {
  activeTab: string;
  questions: Question[];
  loading: boolean;
  filter: {
    type: string;
    search: string;
  };
  showQuestionForm: boolean;
  editingQuestion: Question | null;
  onAddQuestion: () => void;
  onEditQuestion: (question: Question) => void;
  onDeleteQuestion: (id: number) => void;
  onSaveQuestion: (question: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancelQuestion: () => void;
  onFilterChange: (filter: Partial<{ type: string; search: string }>) => void;
  onImportQuestions: () => void;
  onDatabaseAction: (action: 'validate' | 'repair' | 'backup') => void;
}

const AdminContent: React.FC<AdminContentProps> = ({
  activeTab,
  questions,
  loading,
  filter,
  showQuestionForm,
  editingQuestion,
  onAddQuestion,
  onEditQuestion,
  onDeleteQuestion,
  onSaveQuestion,
  onCancelQuestion,
  onFilterChange,
  onImportQuestions,
  onDatabaseAction
}) => {
  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
      {/* Questions Management Tab */}
      {activeTab === 'questionsTab' && (
        <div>
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-bold">إدارة الأسئلة</h2>
            <div className="flex gap-2">
              <button 
                onClick={onAddQuestion}
                className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition"
              >
                <i className="fas fa-plus ml-1"></i> إضافة سؤال جديد
              </button>
              <button 
                onClick={onImportQuestions}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition"
              >
                <i className="fas fa-file-import ml-1"></i> استيراد أسئلة
              </button>
            </div>
          </div>
          
          {/* Filter Controls */}
          <div className="mb-6 flex flex-wrap gap-4 items-end">
            <div className="flex-grow min-w-[200px]">
              <label className="block font-medium mb-1">نوع السؤال</label>
              <select 
                className="w-full p-2.5 border border-gray-300 rounded-md"
                value={filter.type}
                onChange={(e) => onFilterChange({ type: e.target.value })}
              >
                <option value="all">الكل</option>
                <option value="verbal">لفظي</option>
                <option value="quantitative">كمي</option>
              </select>
            </div>
            <div className="flex-grow min-w-[200px]">
              <label className="block font-medium mb-1">بحث</label>
              <input 
                type="text" 
                placeholder="ابحث عن سؤال..." 
                className="w-full p-2.5 border border-gray-300 rounded-md"
                value={filter.search}
                onChange={(e) => onFilterChange({ search: e.target.value })}
              />
            </div>
            <button 
              className="bg-gray-700 hover:bg-gray-800 text-white font-medium py-2.5 px-4 rounded-md transition"
              onClick={() => onFilterChange(filter)}
            >
              تطبيق
            </button>
          </div>
          
          {/* Question Form */}
          {showQuestionForm && (
            <QuestionForm 
              question={editingQuestion}
              onSave={onSaveQuestion}
              onCancel={onCancelQuestion}
            />
          )}
          
          {/* Questions List */}
          <QuestionsList 
            questions={questions}
            loading={loading}
            onEdit={onEditQuestion}
            onDelete={onDeleteQuestion}
          />
          
          {/* Database Diagnostics */}
          <DatabaseDiagnostics 
            questionsCount={questions.length}
            onAction={onDatabaseAction}
          />
        </div>
      )}
      
      {/* Users Management Tab */}
      {activeTab === 'usersTab' && (
        <div>
          <UserManagement 
            users={[
              { id: 1, username: 'admin', name: 'المشرف الرئيسي', isAdmin: true },
              { id: 2, username: 'student', name: 'طالب متميز', isAdmin: false },
              { id: 3, username: 'teacher', name: 'معلم المادة', isAdmin: true }
            ]}
            onAddUser={(user) => {
              alert('تمت إضافة المستخدم بنجاح!');
              console.log('Adding user:', user);
            }}
            onDeleteUser={(id) => {
              alert(`تم حذف المستخدم بمعرف ${id}`);
            }}
            onUpdateUser={(user) => {
              alert(`تم تحديث بيانات المستخدم: ${user.name}`);
            }}
          />
        </div>
      )}
      
      {/* Tests Management Tab */}
      {activeTab === 'testsTab' && (
        <div>
          <h2 className="text-xl font-bold mb-4">إدارة الاختبارات</h2>
          
          {showQuestionForm ? (
            <ImportQuestions 
              onImportQuestions={(newQuestions) => {
                alert(`تم استيراد ${newQuestions.length} سؤال بنجاح`);
                onCancelQuestion();
              }}
              onCancel={onCancelQuestion}
            />
          ) : (
            <div className="mt-6">
              <button 
                onClick={onAddQuestion}
                className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition ml-4"
              >
                إضافة نوع اختبار جديد
              </button>
              
              <button 
                onClick={onImportQuestions}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition"
              >
                استيراد أسئلة
              </button>
            </div>
          )}
          
          <div className="mt-8 bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-4">أنواع الاختبارات المتاحة</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
              <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                <h4 className="font-bold mb-2">اختبار لفظي</h4>
                <p className="text-gray-600 mb-4">اختبار للمهارات اللفظية واللغوية</p>
                <div className="text-sm text-gray-500">20 سؤال | 30 دقيقة</div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                <h4 className="font-bold mb-2">اختبار كمي</h4>
                <p className="text-gray-600 mb-4">اختبار للمهارات الرياضية والكمية</p>
                <div className="text-sm text-gray-500">20 سؤال | 30 دقيقة</div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                <h4 className="font-bold mb-2">اختبار قياس</h4>
                <p className="text-gray-600 mb-4">نموذج محاكاة لاختبار هيئة تقويم التعليم</p>
                <div className="text-sm text-gray-500">120 سؤال | 120 دقيقة</div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Settings Tab */}
      {activeTab === 'settingsTab' && (
        <div>
          <SystemSettings 
            settings={{
              siteTitle: 'قدراتك - منصة اختبارات القدرات',
              logoUrl: '/logo.svg',
              primaryColor: '#3b82f6',
              allowRegistration: true,
              contactEmail: 'support@qudratak.edu',
              enableDebugMode: false,
              defaultVerbalQuestions: 20,
              defaultQuantitativeQuestions: 20,
              defaultTestDuration: 30
            }}
            onSaveSettings={(settings) => {
              console.log('Saving settings:', settings);
              alert('تم حفظ الإعدادات بنجاح!');
            }}
          />
        </div>
      )}
    </div>
  );
};

export default AdminContent;
