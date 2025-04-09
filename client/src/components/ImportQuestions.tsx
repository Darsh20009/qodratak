import { useState } from 'react';
import { Question } from '../lib/types';

interface ImportQuestionsProps {
  onImportQuestions: (questions: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>[]) => void;
  onCancel: () => void;
}

const ImportQuestions: React.FC<ImportQuestionsProps> = ({ onImportQuestions, onCancel }) => {
  const [importData, setImportData] = useState('');
  const [importType, setImportType] = useState<'verbal' | 'quantitative'>('verbal');
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<Omit<Question, 'id' | 'createdAt' | 'updatedAt'>[]>([]);

  const handlePreviewImport = () => {
    if (!importData.trim()) {
      setError('الرجاء إدخال البيانات المراد استيرادها');
      return;
    }

    try {
      // تحليل البيانات - نتوقع أن تكون بتنسيق CSV أو JSON
      let parsedQuestions: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>[] = [];
      
      // نحاول التحليل كـ JSON أولاً
      try {
        const jsonData = JSON.parse(importData);
        
        if (Array.isArray(jsonData)) {
          parsedQuestions = jsonData.map(item => {
            // تحقق مما إذا كان العنصر يحتوي على الحقول المطلوبة
            if (!item.text || !Array.isArray(item.options) || item.correctOptionIndex === undefined) {
              throw new Error('تنسيق JSON غير صالح: يجب أن يحتوي كل عنصر على حقول text و options و correctOptionIndex');
            }
            
            return {
              type: importType,
              text: item.text,
              options: item.options,
              correctOptionIndex: item.correctOptionIndex
            };
          });
        } else {
          throw new Error('تنسيق JSON غير صالح: يجب أن تكون البيانات مصفوفة');
        }
      } catch (jsonError) {
        // إذا فشل التحليل كـ JSON، نحاول التحليل كـ CSV
        const lines = importData.split('\n').filter(line => line.trim());
        
        parsedQuestions = lines.map(line => {
          const parts = line.split(',').map(part => part.trim());
          
          if (parts.length < 3) {
            throw new Error('تنسيق CSV غير صالح: كل سطر يجب أن يحتوي على النص، والخيارات مفصولة بفاصلة، ورقم الإجابة الصحيحة');
          }
          
          const text = parts[0];
          const correctOptionIndex = parseInt(parts[parts.length - 1]);
          
          if (isNaN(correctOptionIndex)) {
            throw new Error('تنسيق CSV غير صالح: آخر جزء يجب أن يكون رقم الإجابة الصحيحة');
          }
          
          const options = parts.slice(1, parts.length - 1);
          
          if (options.length === 0) {
            throw new Error('تنسيق CSV غير صالح: يجب توفير خيارات للأسئلة');
          }
          
          if (correctOptionIndex < 0 || correctOptionIndex >= options.length) {
            throw new Error('رقم الإجابة الصحيحة غير صالح: يجب أن يكون بين 0 و' + (options.length - 1));
          }
          
          return {
            type: importType,
            text,
            options,
            correctOptionIndex
          };
        });
      }
      
      if (parsedQuestions.length === 0) {
        setError('لم يتم العثور على أي أسئلة للاستيراد');
        return;
      }
      
      setPreview(parsedQuestions);
      setError(null);
    } catch (error) {
      if (error instanceof Error) {
        setError('خطأ في تحليل البيانات: ' + error.message);
      } else {
        setError('خطأ غير معروف في تحليل البيانات');
      }
      setPreview([]);
    }
  };

  const handleImport = () => {
    if (preview.length === 0) {
      setError('الرجاء معاينة البيانات أولاً قبل الاستيراد');
      return;
    }
    
    onImportQuestions(preview);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">استيراد الأسئلة</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">نوع الأسئلة</label>
        <div className="flex space-x-4">
          <label className="inline-flex items-center ml-4">
            <input
              type="radio"
              className="form-radio"
              name="questionType"
              checked={importType === 'verbal'}
              onChange={() => setImportType('verbal')}
            />
            <span className="mr-2">لفظي</span>
          </label>
          
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio"
              name="questionType"
              checked={importType === 'quantitative'}
              onChange={() => setImportType('quantitative')}
            />
            <span className="mr-2">كمي</span>
          </label>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">بيانات الاستيراد</label>
        <p className="text-sm text-gray-500 mb-2">
          يمكنك إدخال البيانات بتنسيق JSON أو CSV. 
          للتنسيق CSV، يكون كل سطر سؤالاً بالتنسيق: نص السؤال، الخيار 1، الخيار 2، ...، رقم الإجابة الصحيحة.
        </p>
        <textarea
          className="w-full border border-gray-300 rounded-md p-3 h-48"
          value={importData}
          onChange={(e) => setImportData(e.target.value)}
          placeholder='مثال CSV:
ما هو أكبر كوكب في النظام الشمسي؟,المشتري,زحل,الأرض,المريخ,0
مثال JSON:
[{"text":"ما هو أكبر كوكب في النظام الشمسي؟","options":["المشتري","زحل","الأرض","المريخ"],"correctOptionIndex":0}]'
        />
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <div className="flex space-x-2 mb-6">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition ml-2"
          onClick={handlePreviewImport}
        >
          معاينة
        </button>
        
        <button
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition"
          onClick={onCancel}
        >
          إلغاء
        </button>
      </div>
      
      {preview.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-2">معاينة الأسئلة ({preview.length} سؤال)</h3>
          
          <div className="mb-4 max-h-64 overflow-y-auto border border-gray-200 rounded-md">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 text-right">#</th>
                  <th className="py-2 px-4 text-right">نص السؤال</th>
                  <th className="py-2 px-4 text-right">عدد الخيارات</th>
                  <th className="py-2 px-4 text-right">الإجابة الصحيحة</th>
                </tr>
              </thead>
              <tbody>
                {preview.map((question, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">{index + 1}</td>
                    <td className="py-2 px-4 truncate max-w-xs">{question.text}</td>
                    <td className="py-2 px-4">{question.options.length}</td>
                    <td className="py-2 px-4">{question.options[question.correctOptionIndex]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition"
            onClick={handleImport}
          >
            استيراد {preview.length} سؤال
          </button>
        </div>
      )}
    </div>
  );
};

export default ImportQuestions;