interface DatabaseDiagnosticsProps {
  questionsCount: number;
  onAction: (action: 'validate' | 'repair' | 'backup') => void;
}

const DatabaseDiagnostics: React.FC<DatabaseDiagnosticsProps> = ({ questionsCount, onAction }) => {
  return (
    <div className="mt-8 pt-6 border-t border-gray-300">
      <h3 className="text-lg font-bold mb-4">أدوات تشخيص قاعدة البيانات</h3>
      
      <div className="bg-gray-100 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="font-medium mb-2">حالة الاتصال بقاعدة البيانات</h4>
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
              <span>متصل (localStorage)</span>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">عدد الأسئلة المخزنة</h4>
            <div className="text-lg">{questionsCount} سؤال</div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => onAction('validate')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition"
          >
            <i className="fas fa-database ml-1"></i> فحص سلامة قاعدة البيانات
          </button>
          <button 
            onClick={() => onAction('repair')}
            className="bg-gray-700 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-md transition"
          >
            <i className="fas fa-wrench ml-1"></i> إصلاح قاعدة البيانات
          </button>
          <button 
            onClick={() => onAction('backup')}
            className="bg-gray-700 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-md transition"
          >
            <i className="fas fa-download ml-1"></i> نسخ احتياطي
          </button>
        </div>
      </div>
    </div>
  );
};

export default DatabaseDiagnostics;
