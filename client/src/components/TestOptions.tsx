interface TestOptionsProps {
  onStartTest: (type: 'verbal' | 'quantitative') => void;
  onCreateCustomTest: () => void;
  onStartQiyasTest: () => void;
}

const TestOptions: React.FC<TestOptionsProps> = ({ onStartTest, onCreateCustomTest, onStartQiyasTest }) => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-300 shadow-sm hover:shadow-md transition p-6 cursor-pointer">
          <div className="text-blue-500 text-3xl mb-4">
            <i className="fas fa-book"></i>
          </div>
          <h3 className="text-xl font-bold mb-2">اختبار لفظي</h3>
          <p className="text-gray-700 mb-4">تقييم مهاراتك اللغوية والفهم اللفظي</p>
          <button 
            onClick={() => onStartTest('verbal')}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium p-2.5 rounded-md transition"
          >
            بدء الاختبار
          </button>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-300 shadow-sm hover:shadow-md transition p-6 cursor-pointer">
          <div className="text-blue-500 text-3xl mb-4">
            <i className="fas fa-calculator"></i>
          </div>
          <h3 className="text-xl font-bold mb-2">اختبار كمي</h3>
          <p className="text-gray-700 mb-4">قياس قدراتك في التعامل مع الأرقام والرياضيات</p>
          <button 
            onClick={() => onStartTest('quantitative')}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium p-2.5 rounded-md transition"
          >
            بدء الاختبار
          </button>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-300 shadow-sm hover:shadow-md transition p-6 cursor-pointer">
          <div className="text-blue-500 text-3xl mb-4">
            <i className="fas fa-cogs"></i>
          </div>
          <h3 className="text-xl font-bold mb-2">اختبار مخصص</h3>
          <p className="text-gray-700 mb-4">إنشاء اختبار مخصص حسب احتياجاتك</p>
          <button 
            onClick={onCreateCustomTest}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium p-2.5 rounded-md transition"
          >
            إنشاء اختبار
          </button>
        </div>

        <div className="bg-white rounded-lg border border-gray-300 shadow-sm hover:shadow-md transition p-6 cursor-pointer">
          <div className="text-green-600 text-3xl mb-4">
            <i className="fas fa-graduation-cap"></i>
          </div>
          <h3 className="text-xl font-bold mb-2">اختبار قياس</h3>
          <p className="text-gray-700 mb-4">اختبار مماثل لاختبار هيئة تقويم التعليم والتدريب</p>
          <button 
            onClick={onStartQiyasTest}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium p-2.5 rounded-md transition"
          >
            بدء اختبار القياس
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestOptions;
