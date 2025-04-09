import { useState } from 'react';
import { TestConfig } from '../lib/types';

interface CustomTestSetupProps {
  onStart: (config: TestConfig) => void;
  onCancel: () => void;
}

const CustomTestSetup: React.FC<CustomTestSetupProps> = ({ onStart, onCancel }) => {
  const [verbalQuestions, setVerbalQuestions] = useState(0);
  const [quantitativeQuestions, setQuantitativeQuestions] = useState(0);
  const [duration, setDuration] = useState(30);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (verbalQuestions + quantitativeQuestions === 0) {
      alert('يرجى اختيار عدد الأسئلة');
      return;
    }
    
    onStart({
      type: 'custom',
      verbalQuestions,
      quantitativeQuestions,
      duration
    });
  };

  return (
    <div className="mt-8 max-w-xl mx-auto bg-white rounded-lg border border-gray-300 shadow-md p-6">
      <h3 className="text-xl font-bold mb-4 border-b border-gray-300 pb-3">إعداد اختبار مخصص</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4 mb-4">
        <div className="text-right">
          <label htmlFor="verbalQuestions" className="block font-medium mb-1">عدد الأسئلة اللفظية</label>
          <input 
            type="number" 
            id="verbalQuestions" 
            className="w-full p-3 border border-gray-300 rounded-md" 
            min="0" 
            value={verbalQuestions}
            onChange={(e) => setVerbalQuestions(parseInt(e.target.value) || 0)}
          />
        </div>
        
        <div className="text-right">
          <label htmlFor="quantitativeQuestions" className="block font-medium mb-1">عدد الأسئلة الكمية</label>
          <input 
            type="number" 
            id="quantitativeQuestions" 
            className="w-full p-3 border border-gray-300 rounded-md" 
            min="0" 
            value={quantitativeQuestions}
            onChange={(e) => setQuantitativeQuestions(parseInt(e.target.value) || 0)}
          />
        </div>
        
        <div className="text-right">
          <label htmlFor="testDuration" className="block font-medium mb-1">مدة الاختبار (بالدقائق)</label>
          <input 
            type="number" 
            id="testDuration" 
            className="w-full p-3 border border-gray-300 rounded-md" 
            min="5" 
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value) || 30)}
          />
        </div>
        
        <div className="flex flex-col gap-3 pt-4">
          <button 
            type="submit" 
            className="bg-green-500 hover:bg-green-600 text-white font-medium p-3 rounded-md transition"
          >
            بدء الاختبار المخصص
          </button>
          <button 
            type="button"
            onClick={onCancel}
            className="bg-red-500 hover:bg-red-600 text-white font-medium p-3 rounded-md transition"
          >
            إلغاء
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomTestSetup;
