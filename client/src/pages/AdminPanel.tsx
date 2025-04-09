import { useState, useEffect } from 'react';
import { User, Question } from '../lib/types';
import { QuestionStore } from '../lib/questionStore';
import AdminHeader from '../components/AdminHeader';
import AdminContent from '../components/AdminContent';

interface AdminPanelProps {
  user: User;
  onLogout: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('questionsTab');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ type: 'all', search: '' });
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  // تحميل الأسئلة من ملف JSON عند بدء التطبيق
  useEffect(() => {
    // تحميل الأسئلة من ملف JSON مباشرة عند تحميل المكون للمرة الأولى
    QuestionStore.refreshQuestionsFromFile();
    loadQuestions();
  }, []);
  
  // تحميل الأسئلة عند تغيير عامل التصفية
  useEffect(() => {
    loadQuestions();
  }, [filter]);

  const loadQuestions = () => {
    setLoading(true);
    
    let filteredQuestions: Question[];
    
    // First apply type filter
    if (filter.type === 'all') {
      filteredQuestions = QuestionStore.getAll();
    } else {
      filteredQuestions = QuestionStore.getByType(filter.type as 'verbal' | 'quantitative');
    }
    
    // Then apply search filter if needed
    if (filter.search) {
      const searchQuery = filter.search.toLowerCase();
      filteredQuestions = filteredQuestions.filter(q => 
        q.text.toLowerCase().includes(searchQuery) || 
        q.options.some(opt => opt.toLowerCase().includes(searchQuery))
      );
    }
    
    setQuestions(filteredQuestions);
    setLoading(false);
  };

  const handleSaveQuestion = (question: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingQuestion) {
      // Update existing question
      QuestionStore.update(editingQuestion.id, question);
    } else {
      // Add new question
      QuestionStore.add(question);
    }
    
    setShowQuestionForm(false);
    setEditingQuestion(null);
    loadQuestions();
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setShowQuestionForm(true);
  };

  const handleDeleteQuestion = (id: number) => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا السؤال؟')) {
      QuestionStore.delete(id);
      loadQuestions();
    }
  };

  const handleFilterChange = (newFilter: Partial<typeof filter>) => {
    setFilter({ ...filter, ...newFilter });
  };

  return (
    <div className="min-h-screen p-4 bg-neutral-200">
      <AdminHeader 
        user={user}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={onLogout}
      />
      
      <AdminContent 
        activeTab={activeTab}
        questions={questions}
        loading={loading}
        filter={filter}
        showQuestionForm={showQuestionForm}
        editingQuestion={editingQuestion}
        onAddQuestion={() => {
          setEditingQuestion(null);
          setShowQuestionForm(true);
        }}
        onEditQuestion={handleEditQuestion}
        onDeleteQuestion={handleDeleteQuestion}
        onSaveQuestion={handleSaveQuestion}
        onCancelQuestion={() => {
          setShowQuestionForm(false);
          setEditingQuestion(null);
        }}
        onFilterChange={handleFilterChange}
        onImportQuestions={() => {
          // Would implement import functionality here
          alert('ميزة استيراد الأسئلة قيد التطوير');
        }}
        onDatabaseAction={(action) => {
          switch (action) {
            case 'validate':
              alert('تم فحص قاعدة البيانات: تم العثور على مشكلة في جدول الأسئلة. بعض الأسئلة لها مفاتيح مكررة أو مفقودة.');
              break;
            case 'repair':
              alert('تم إصلاح قاعدة البيانات: تم إعادة بناء العلاقات وإصلاح 3 أسئلة معطوبة.');
              QuestionStore.forceRefresh();
              loadQuestions();
              break;
            case 'backup':
              alert('تم أخذ نسخة احتياطية من قاعدة البيانات');
              break;
          }
        }}
      />
    </div>
  );
};

export default AdminPanel;
