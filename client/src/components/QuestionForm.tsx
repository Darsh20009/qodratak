import { useState, useEffect } from 'react';
import { Question } from '../lib/types';

interface QuestionFormProps {
  question: Question | null;
  onSave: (question: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({ question, onSave, onCancel }) => {
  const [type, setType] = useState<'verbal' | 'quantitative'>('verbal');
  const [text, setText] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [correctOptionIndex, setCorrectOptionIndex] = useState<number>(0);
  
  // Initialize form with question data if editing
  useEffect(() => {
    if (question) {
      setType(question.type);
      setText(question.text);
      setOptions([...question.options]);
      setCorrectOptionIndex(question.correctOptionIndex);
    }
  }, [question]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!text.trim()) {
      alert('يرجى إدخال نص السؤال');
      return;
    }
    
    const filteredOptions = options.filter(opt => opt.trim() !== '');
    
    if (filteredOptions.length < 2) {
      alert('يجب إدخال خيارين على الأقل');
      return;
    }
    
    if (correctOptionIndex >= filteredOptions.length) {
      alert('يرجى تحديد الإجابة الصحيحة');
      return;
    }
    
    onSave({
      type,
      text,
      options: filteredOptions,
      correctOptionIndex
    });
  };
  
  const addOption = () => {
    setOptions([...options, '']);
  };
  
  const removeOption = (index: number) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
    
    // Adjust correct option index if needed
    if (correctOptionIndex >= newOptions.length) {
      setCorrectOptionIndex(newOptions.length - 1);
    }
  };
  
  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  return (
    <div className="bg-gray-100 border border-gray-300 rounded-lg p-6 mt-6 mb-8">
      <h3 className="text-xl font-bold mb-4">
        {question ? 'تعديل السؤال' : 'إضافة سؤال جديد'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-right">
          <label htmlFor="questionType" className="block font-medium mb-1">نوع السؤال</label>
          <select 
            id="questionType" 
            className="w-full p-2.5 border border-gray-300 rounded-md"
            value={type}
            onChange={(e) => setType(e.target.value as 'verbal' | 'quantitative')}
          >
            <option value="verbal">لفظي</option>
            <option value="quantitative">كمي</option>
          </select>
        </div>
        
        <div className="text-right">
          <label htmlFor="questionText" className="block font-medium mb-1">نص السؤال</label>
          <textarea 
            id="questionText" 
            rows={3} 
            className="w-full p-2.5 border border-gray-300 rounded-md"
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
        </div>
        
        <div className="space-y-3">
          <div className="text-right font-medium mb-1">خيارات الإجابة</div>
          
          {options.map((option, index) => (
            <div key={index} className="option-group relative">
              <div className="flex items-center gap-2">
                <input 
                  type="radio" 
                  name="correctOption" 
                  id={`correctOption${index}`} 
                  className="w-4 h-4"
                  checked={correctOptionIndex === index}
                  onChange={() => setCorrectOptionIndex(index)}
                />
                <input 
                  type="text" 
                  className="w-full p-2.5 border border-gray-300 rounded-md" 
                  placeholder={`الخيار ${index + 1}`}
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                />
                {options.length > 2 && (
                  <button 
                    type="button" 
                    className="bg-red-500 text-white p-1 rounded-md"
                    onClick={() => removeOption(index)}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <button 
          type="button" 
          onClick={addOption}
          className="bg-gray-700 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-md transition"
        >
          <i className="fas fa-plus ml-1"></i> إضافة خيار
        </button>
        
        <div className="flex gap-3 pt-4">
          <button 
            type="submit" 
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-md transition"
          >
            حفظ السؤال
          </button>
          <button 
            type="button" 
            onClick={onCancel}
            className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-md transition"
          >
            إلغاء
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuestionForm;
