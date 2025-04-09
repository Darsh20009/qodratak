import { useState } from 'react';
import { Question } from '../lib/types';
import { QuestionStore } from '../lib/questionStore';

interface FileQuestionsManagerProps {
  onImport: () => void;
}

const FileQuestionsManager: React.FC<FileQuestionsManagerProps> = ({ onImport }) => {
  const [exportedJSON, setExportedJSON] = useState<string | null>(null);
  const [stats, setStats] = useState<{ total: number, verbal: number, quantitative: number } | null>(null);
  
  const handleExportQuestions = () => {
    try {
      const json = QuestionStore.exportQuestionsToJSON();
      setExportedJSON(json);
      
      // إظهار إحصائيات عن الأسئلة
      const allQuestions = QuestionStore.getAll();
      const verbalQuestions = allQuestions.filter(q => q.type === 'verbal');
      const quantitativeQuestions = allQuestions.filter(q => q.type === 'quantitative');
      
      setStats({
        total: allQuestions.length,
        verbal: verbalQuestions.length,
        quantitative: quantitativeQuestions.length
      });
    } catch (error) {
      alert('حدث خطأ أثناء تصدير الأسئلة');
      console.error(error);
    }
  };
  
  const handleCopyToClipboard = () => {
    if (exportedJSON) {
      navigator.clipboard.writeText(exportedJSON)
        .then(() => alert('تم نسخ محتوى ملف الأسئلة إلى الحافظة'))
        .catch(err => {
          console.error('حدث خطأ أثناء النسخ:', err);
          alert('حدث خطأ أثناء نسخ البيانات');
        });
    }
  };
  
  const handleDownloadFile = () => {
    if (exportedJSON) {
      const blob = new Blob([exportedJSON], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'questions_all.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };
  
  const handleLoadFromFile = () => {
    // تحميل الأسئلة من ملف الجيسون مباشرة
    // أولاً: قم بإعادة تعيين التخزين المحلي لإزالة أي قيم قديمة
    QuestionStore.reset();
    
    // الآن قم بتحميل الأسئلة من الملف مباشرة
    const freshQuestions = QuestionStore.getQuestionsFromFile();
    
    // أضف كل سؤال واحدًا تلو الآخر
    freshQuestions.forEach(q => {
      const { id, createdAt, updatedAt, ...questionData } = q;
      QuestionStore.add(questionData);
    });
    
    // أبلغ عن الاستيراد الناجح
    onImport();
    
    // إظهار إحصائيات عن الأسئلة المستوردة
    const questions = QuestionStore.getAll();
    const verbalQuestions = questions.filter(q => q.type === 'verbal');
    const quantitativeQuestions = questions.filter(q => q.type === 'quantitative');
    
    setStats({
      total: questions.length,
      verbal: verbalQuestions.length,
      quantitative: quantitativeQuestions.length
    });
    
    alert(`تم تحميل ${questions.length} سؤال من ملف questions_all.json بنجاح!`);
  };
  
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">إدارة ملف الأسئلة</h2>
      
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={handleExportQuestions}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
        >
          استخراج الأسئلة الحالية
        </button>
        
        <button
          onClick={handleLoadFromFile}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition"
        >
          تحميل الأسئلة من ملف JSON
        </button>
      </div>
      
      {stats && (
        <div className="mb-4 p-3 bg-blue-50 rounded-md">
          <h3 className="font-medium mb-2">إحصائيات الأسئلة:</h3>
          <ul className="list-disc list-inside">
            <li>إجمالي عدد الأسئلة: {stats.total}</li>
            <li>الأسئلة اللفظية: {stats.verbal}</li>
            <li>الأسئلة الكمية: {stats.quantitative}</li>
          </ul>
        </div>
      )}
      
      {exportedJSON && (
        <div className="mt-4">
          <div className="flex gap-2 mb-2">
            <button
              onClick={handleCopyToClipboard}
              className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-sm text-sm transition"
            >
              نسخ إلى الحافظة
            </button>
            
            <button
              onClick={handleDownloadFile}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded-sm text-sm transition"
            >
              تنزيل كملف
            </button>
          </div>
          
          <div className="mt-2 border border-gray-300 rounded-md p-3 bg-gray-50">
            <h4 className="text-sm font-medium mb-1">ملف الأسئلة بصيغة JSON:</h4>
            <pre className="text-xs overflow-auto max-h-60 p-2 bg-gray-100 rounded">
              {exportedJSON}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileQuestionsManager;