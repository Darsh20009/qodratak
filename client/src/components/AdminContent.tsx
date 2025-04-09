import { Question } from '../lib/types';
import QuestionForm from './QuestionForm';
import QuestionsList from './QuestionsList';
import DatabaseDiagnostics from './DatabaseDiagnostics';

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
      
      {/* Other tabs */}
      {activeTab === 'usersTab' && (
        <div>
          <h2 className="text-xl font-bold mb-4">إدارة المستخدمين</h2>
          <p className="text-gray-500">هذه الخاصية قيد التطوير</p>
        </div>
      )}
      
      {activeTab === 'testsTab' && (
        <div>
          <h2 className="text-xl font-bold mb-4">إدارة الاختبارات</h2>
          <p className="text-gray-500">هذه الخاصية قيد التطوير</p>
        </div>
      )}
      
      {activeTab === 'settingsTab' && (
        <div>
          <h2 className="text-xl font-bold mb-4">إعدادات النظام</h2>
          <p className="text-gray-500">هذه الخاصية قيد التطوير</p>
        </div>
      )}
    </div>
  );
};

export default AdminContent;
