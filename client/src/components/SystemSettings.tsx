import { useState, useEffect } from 'react';

interface SystemSettingsProps {
  settings: SystemSettings;
  onSaveSettings: (settings: SystemSettings) => void;
}

interface SystemSettings {
  siteTitle: string;
  logoUrl: string;
  primaryColor: string;
  allowRegistration: boolean;
  contactEmail: string;
  enableDebugMode: boolean;
  defaultVerbalQuestions: number;
  defaultQuantitativeQuestions: number;
  defaultTestDuration: number;
}

const SystemSettings: React.FC<SystemSettingsProps> = ({ settings, onSaveSettings }) => {
  const [formData, setFormData] = useState<SystemSettings>(settings);
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    const newValue = type === 'checkbox' 
      ? (e.target as HTMLInputElement).checked 
      : type === 'number' 
        ? parseInt(value) 
        : value;
    
    setFormData({
      ...formData,
      [name]: newValue
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    
    setShowSaved(true);
    setTimeout(() => {
      setShowSaved(false);
    }, 3000);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">إعدادات النظام</h2>
      
      {showSaved && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          تم حفظ الإعدادات بنجاح
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-lg font-medium border-b pb-2 mb-4">إعدادات عامة</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">عنوان الموقع</label>
            <input
              type="text"
              name="siteTitle"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={formData.siteTitle}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">رابط الشعار</label>
            <input
              type="text"
              name="logoUrl"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={formData.logoUrl}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">اللون الأساسي</label>
            <div className="flex items-center">
              <input
                type="color"
                name="primaryColor"
                className="p-1 border border-gray-300"
                value={formData.primaryColor}
                onChange={handleChange}
              />
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md mr-2"
                value={formData.primaryColor}
                onChange={handleChange}
                name="primaryColor"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">البريد الإلكتروني للتواصل</label>
            <input
              type="email"
              name="contactEmail"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={formData.contactEmail}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="allowRegistration"
            name="allowRegistration"
            className="mr-2"
            checked={formData.allowRegistration}
            onChange={handleChange}
          />
          <label htmlFor="allowRegistration" className="text-sm font-medium">السماح بالتسجيل للمستخدمين الجدد</label>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="enableDebugMode"
            name="enableDebugMode"
            className="mr-2"
            checked={formData.enableDebugMode}
            onChange={handleChange}
          />
          <label htmlFor="enableDebugMode" className="text-sm font-medium">تفعيل وضع التصحيح</label>
        </div>
        
        <h3 className="text-lg font-medium border-b pb-2 mb-4 mt-8">إعدادات الاختبار الافتراضية</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">عدد الأسئلة اللفظية الافتراضي</label>
            <input
              type="number"
              name="defaultVerbalQuestions"
              className="w-full p-2 border border-gray-300 rounded-md"
              min="0"
              value={formData.defaultVerbalQuestions}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">عدد الأسئلة الكمية الافتراضي</label>
            <input
              type="number"
              name="defaultQuantitativeQuestions"
              className="w-full p-2 border border-gray-300 rounded-md"
              min="0"
              value={formData.defaultQuantitativeQuestions}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">مدة الاختبار الافتراضية (بالدقائق)</label>
            <input
              type="number"
              name="defaultTestDuration"
              className="w-full p-2 border border-gray-300 rounded-md"
              min="5"
              value={formData.defaultTestDuration}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="pt-6">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition"
          >
            حفظ الإعدادات
          </button>
        </div>
      </form>
    </div>
  );
};

export default SystemSettings;