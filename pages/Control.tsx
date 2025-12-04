import React, { useState, useEffect } from 'react';
import { ref, update, get } from 'firebase/database';
import { db } from '../firebase';
import { Clinic } from '../types';
import { Layout } from '../components/Layout';
import { Mic, RefreshCw, SkipForward, SkipBack, Power, Bell, AlertTriangle } from 'lucide-react';

export const Control: React.FC = () => {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [selectedClinicId, setSelectedClinicId] = useState<string>('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentClinic, setCurrentClinic] = useState<Clinic | null>(null);

  useEffect(() => {
    // Load clinics for dropdown
    get(ref(db, 'clinics')).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const loaded = Object.keys(data).map(key => ({ ...data[key], id: key }));
        setClinics(loaded);
      }
    });
  }, []);

  useEffect(() => {
    if (isAuthenticated && selectedClinicId) {
       // Subscribe to live updates for this clinic only
       get(ref(db, `clinics/${selectedClinicId}`)).then(snapshot => {
         if (snapshot.exists()) setCurrentClinic({ ...snapshot.val(), id: selectedClinicId });
       });
       // In a real app, use onValue here for real-time reflection of self-changes
    }
  }, [isAuthenticated, selectedClinicId]);

  const handleLogin = () => {
    const clinic = clinics.find(c => c.id === selectedClinicId);
    if (clinic) {
       // Simple password check (In production, use proper Auth)
       if (clinic.password === password) {
         setIsAuthenticated(true);
         setCurrentClinic(clinic);
       } else {
         alert('كلمة المرور غير صحيحة');
       }
    }
  };

  const updateClinic = async (updates: Partial<Clinic>) => {
    if (!currentClinic) return;
    try {
      await update(ref(db, `clinics/${currentClinic.id}`), updates);
      setCurrentClinic({ ...currentClinic, ...updates });
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  const nextClient = () => {
    if (!currentClinic) return;
    const nextNum = currentClinic.currentNumber + 1;
    const time = new Date().toLocaleTimeString('ar-EG', {hour:'2-digit', minute:'2-digit'});
    updateClinic({ currentNumber: nextNum, lastCallTime: time });
  };

  const prevClient = () => {
    if (!currentClinic || currentClinic.currentNumber <= 0) return;
    updateClinic({ currentNumber: currentClinic.currentNumber - 1 });
  };

  const repeatCall = () => {
    // Just update timestamp to trigger listener in Display
    const time = new Date().toLocaleTimeString('ar-EG', {hour:'2-digit', minute:'2-digit'});
    updateClinic({ lastCallTime: time });
  };

  const resetClinic = () => {
    if(confirm('هل أنت متأكد من تصفير العداد؟')) {
        updateClinic({ currentNumber: 0, lastCallTime: '' });
    }
  };

  const toggleStatus = () => {
    if (!currentClinic) return;
    const newStatus = currentClinic.status === 'active' ? 'paused' : 'active';
    updateClinic({ status: newStatus });
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg mt-20">
          <h2 className="text-2xl font-bold mb-6 text-center">دخول وحدة التحكم</h2>
          <div className="space-y-4">
            <div>
              <label className="block mb-2 font-medium">اختر العيادة</label>
              <select 
                className="w-full border p-3 rounded-lg"
                value={selectedClinicId}
                onChange={(e) => setSelectedClinicId(e.target.value)}
              >
                <option value="">-- اختر --</option>
                {clinics.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
               <label className="block mb-2 font-medium">كلمة المرور</label>
               <input 
                 type="password" 
                 className="w-full border p-3 rounded-lg"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
               />
            </div>
            <button 
              onClick={handleLogin}
              className="w-full bg-teal-600 text-white py-3 rounded-lg font-bold hover:bg-teal-700 transition"
            >
              دخول
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {currentClinic && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className={`p-6 text-white flex justify-between items-center ${currentClinic.status === 'active' ? 'bg-teal-600' : 'bg-slate-500'}`}>
               <div>
                 <h2 className="text-3xl font-bold">{currentClinic.name}</h2>
                 <p className="opacity-80 mt-1">الحالة: {currentClinic.status === 'active' ? 'نشط' : 'متوقف'}</p>
               </div>
               <div className="text-center bg-white/20 p-4 rounded-xl backdrop-blur-sm">
                  <span className="block text-sm opacity-80">الرقم الحالي</span>
                  <span className="text-6xl font-black font-mono">{currentClinic.currentNumber}</span>
               </div>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
               <button onClick={nextClient} className="col-span-1 md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white p-8 rounded-xl text-3xl font-bold shadow-lg flex items-center justify-center gap-4 transition-transform active:scale-95">
                  <SkipForward size={40} /> العميل التالي
               </button>
               
               <button onClick={repeatCall} className="bg-yellow-500 hover:bg-yellow-600 text-white p-6 rounded-xl text-xl font-bold shadow flex items-center justify-center gap-2">
                  <Bell size={24} /> تكرار النداء
               </button>

               <button onClick={prevClient} className="bg-slate-500 hover:bg-slate-600 text-white p-6 rounded-xl text-xl font-bold shadow flex items-center justify-center gap-2">
                  <SkipBack size={24} /> العميل السابق
               </button>

               <div className="grid grid-cols-2 gap-4 col-span-1 md:col-span-2 border-t pt-6 mt-2">
                  <button onClick={toggleStatus} className={`p-4 rounded-lg font-bold text-white flex items-center justify-center gap-2 ${currentClinic.status === 'active' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-600 hover:bg-green-700'}`}>
                     <Power size={20} /> {currentClinic.status === 'active' ? 'إيقاف مؤقت' : 'استئناف العمل'}
                  </button>
                  <button onClick={resetClinic} className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-lg font-bold flex items-center justify-center gap-2">
                     <RefreshCw size={20} /> تصفير العداد
                  </button>
                  <button onClick={() => alert('Feature coming soon: Emergency Alert')} className="bg-red-800 text-white p-4 rounded-lg font-bold flex items-center justify-center gap-2 col-span-2">
                     <AlertTriangle size={20} /> تنبيه طوارئ
                  </button>
               </div>
            </div>
            
            <div className="bg-slate-50 p-4 border-t text-center">
               <button onClick={() => setIsAuthenticated(false)} className="text-red-500 hover:text-red-700 font-medium">
                  تسجيل الخروج من العيادة
               </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};