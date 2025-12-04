import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { addDoc, collection } from 'firebase/firestore';
import { firestore } from '../firebase';

export const Booking: React.FC = () => {
  const [form, setForm] = useState({
      name: '', phone: '', clinic: '', date: '', shift: 'morning', reason: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          await addDoc(collection(firestore, 'appointments'), {
              ...form,
              status: 'pending',
              createdAt: new Date().toISOString()
          });
          alert('تم إرسال طلب الحجز بنجاح. سيتم التواصل معك للتأكيد.');
      } catch (error) {
          alert('حدث خطأ أثناء الحجز');
      }
  };

  return (
    <Layout>
      <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg">
         <h2 className="text-2xl font-bold mb-6 text-center text-teal-700">حجز موعد جديد</h2>
         <form onSubmit={handleSubmit} className="space-y-4">
             <div>
                 <label className="block text-sm font-medium mb-1">اسم المريض</label>
                 <input required type="text" className="w-full border p-2 rounded" onChange={e => setForm({...form, name: e.target.value})} />
             </div>
             <div>
                 <label className="block text-sm font-medium mb-1">رقم الهاتف</label>
                 <input required type="tel" className="w-full border p-2 rounded" onChange={e => setForm({...form, phone: e.target.value})} />
             </div>
             <div>
                 <label className="block text-sm font-medium mb-1">العيادة المطلوبة</label>
                 <select required className="w-full border p-2 rounded" onChange={e => setForm({...form, clinic: e.target.value})}>
                     <option value="">-- اختر --</option>
                     <option value="باطنة">باطنة</option>
                     <option value="أطفال">أطفال</option>
                     <option value="أسنان">أسنان</option>
                 </select>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">التاريخ</label>
                    <input required type="date" className="w-full border p-2 rounded" onChange={e => setForm({...form, date: e.target.value})} />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">الفترة</label>
                    <select className="w-full border p-2 rounded" onChange={e => setForm({...form, shift: e.target.value})}>
                        <option value="morning">صباحي (8 ص - 2 م)</option>
                        <option value="evening">مسائي (2 م - 8 م)</option>
                    </select>
                </div>
             </div>
             <div>
                 <label className="block text-sm font-medium mb-1">سبب الزيارة</label>
                 <textarea className="w-full border p-2 rounded" rows={3} onChange={e => setForm({...form, reason: e.target.value})}></textarea>
             </div>
             <button type="submit" className="w-full bg-teal-600 text-white py-3 rounded font-bold hover:bg-teal-700">تأكيد الحجز</button>
         </form>
      </div>
    </Layout>
  );
};