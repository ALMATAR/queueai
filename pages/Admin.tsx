import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { db } from '../firebase';
import { ref, set, get } from 'firebase/database';
import { Settings, Clinic } from '../types';

export const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'clinics'>('general');
  const [settings, setSettings] = useState<Settings>({
    centerName: '',
    scrollText: '',
    scrollSpeed: 10,
    notificationDuration: 10,
    voiceSpeed: 1,
    audioPath: 'audio',
    videoPath: '',
    alertMessage: ''
  });
  
  const [clinics, setClinics] = useState<Clinic[]>([]);

  useEffect(() => {
    // Load Settings
    get(ref(db, 'settings')).then(snapshot => {
      if (snapshot.exists()) setSettings(snapshot.val());
    });
    // Load Clinics
    get(ref(db, 'clinics')).then(snapshot => {
        if(snapshot.exists()) {
             const data = snapshot.val();
             setClinics(Object.keys(data).map(k => ({...data[k], id: k})));
        }
    });
  }, []);

  const saveSettings = async () => {
    await set(ref(db, 'settings'), settings);
    alert('تم حفظ الإعدادات');
  };

  const addClinic = () => {
    const newId = `clinic${Date.now()}`;
    const newClinic: Clinic = {
        id: newId,
        name: 'عيادة جديدة',
        currentNumber: 0,
        status: 'active',
        lastCallTime: '',
        screenId: '1',
        password: '123'
    };
    const updated = [...clinics, newClinic];
    setClinics(updated);
    set(ref(db, `clinics/${newId}`), newClinic);
  };

  const updateClinicLocal = (index: number, field: keyof Clinic, value: any) => {
      const updated = [...clinics];
      updated[index] = { ...updated[index], [field]: value };
      setClinics(updated);
  };

  const saveClinic = (clinic: Clinic) => {
      set(ref(db, `clinics/${clinic.id}`), clinic);
      alert('تم تحديث العيادة');
  };

  const deleteClinic = (id: string) => {
      if(confirm('هل أنت متأكد؟')) {
          set(ref(db, `clinics/${id}`), null);
          setClinics(clinics.filter(c => c.id !== id));
      }
  };

  return (
    <Layout>
      <div className="bg-white rounded-xl shadow-lg min-h-[600px] flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-slate-100 p-4 border-l">
           <h2 className="text-xl font-bold mb-6 px-2">لوحة التحكم</h2>
           <nav className="space-y-2">
             <button onClick={() => setActiveTab('general')} className={`w-full text-right p-3 rounded-lg ${activeTab === 'general' ? 'bg-teal-600 text-white' : 'hover:bg-slate-200'}`}>الإعدادات العامة</button>
             <button onClick={() => setActiveTab('clinics')} className={`w-full text-right p-3 rounded-lg ${activeTab === 'clinics' ? 'bg-teal-600 text-white' : 'hover:bg-slate-200'}`}>إعدادات العيادات</button>
           </nav>
        </div>

        {/* Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          {activeTab === 'general' && (
             <div className="space-y-6 max-w-2xl">
                <h3 className="text-2xl font-bold border-b pb-4">الإعدادات العامة</h3>
                
                <div className="grid grid-cols-1 gap-4">
                   <div>
                     <label className="block text-sm font-medium mb-1">اسم المركز</label>
                     <input type="text" value={settings.centerName} onChange={e => setSettings({...settings, centerName: e.target.value})} className="w-full border p-2 rounded" />
                   </div>
                   
                   <div>
                     <label className="block text-sm font-medium mb-1">نص الشريط الإخباري</label>
                     <textarea value={settings.scrollText} onChange={e => setSettings({...settings, scrollText: e.target.value})} className="w-full border p-2 rounded h-20" />
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">سرعة الشريط</label>
                            <input type="number" value={settings.scrollSpeed} onChange={e => setSettings({...settings, scrollSpeed: Number(e.target.value)})} className="w-full border p-2 rounded" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">مدة التنبيه (ثواني)</label>
                            <input type="number" value={settings.notificationDuration} onChange={e => setSettings({...settings, notificationDuration: Number(e.target.value)})} className="w-full border p-2 rounded" />
                        </div>
                   </div>

                   <div>
                     <label className="block text-sm font-medium mb-1">مسار ملفات الصوت (مجلد)</label>
                     <input type="text" value={settings.audioPath} onChange={e => setSettings({...settings, audioPath: e.target.value})} className="w-full border p-2 rounded" placeholder="مثال: /audio" />
                   </div>

                   <button onClick={saveSettings} className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700">حفظ التغييرات</button>
                </div>
             </div>
          )}

          {activeTab === 'clinics' && (
              <div className="space-y-6">
                 <div className="flex justify-between items-center border-b pb-4">
                    <h3 className="text-2xl font-bold">إدارة العيادات</h3>
                    <button onClick={addClinic} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">+ إضافة عيادة</button>
                 </div>

                 <div className="grid gap-4">
                    {clinics.map((clinic, idx) => (
                        <div key={clinic.id} className="bg-slate-50 p-4 rounded border flex flex-wrap gap-4 items-end">
                            <div className="flex-1 min-w-[200px]">
                                <label className="text-xs text-slate-500">اسم العيادة</label>
                                <input type="text" value={clinic.name} onChange={e => updateClinicLocal(idx, 'name', e.target.value)} className="w-full border p-2 rounded" />
                            </div>
                            <div className="w-24">
                                <label className="text-xs text-slate-500">رقم الشاشة</label>
                                <input type="text" value={clinic.screenId} onChange={e => updateClinicLocal(idx, 'screenId', e.target.value)} className="w-full border p-2 rounded" />
                            </div>
                            <div className="w-32">
                                <label className="text-xs text-slate-500">كلمة المرور</label>
                                <input type="text" value={clinic.password} onChange={e => updateClinicLocal(idx, 'password', e.target.value)} className="w-full border p-2 rounded" />
                            </div>
                            <div className="flex gap-2 pb-1">
                                <button onClick={() => saveClinic(clinic)} className="bg-teal-600 text-white px-3 py-2 rounded text-sm">حفظ</button>
                                <button onClick={() => deleteClinic(clinic.id)} className="bg-red-500 text-white px-3 py-2 rounded text-sm">حذف</button>
                            </div>
                        </div>
                    ))}
                 </div>
              </div>
          )}
        </div>
      </div>
    </Layout>
  );
};