import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { addDoc, collection } from 'firebase/firestore';
import { firestore } from '../firebase';

export const Doctors: React.FC = () => {
  // Mock login for simplicity in this demo
  const [loggedIn, setLoggedIn] = useState(false);
  
  const [leaveForm, setLeaveForm] = useState({ type: 'usual', start: '', end: '', notes: '' });

  const submitLeave = async () => {
     await addDoc(collection(firestore, 'leave_requests'), {
         ...leaveForm,
         doctorId: 'doc123',
         status: 'pending',
         createdAt: new Date().toISOString()
     });
     alert('تم تقديم الطلب');
  };

  if (!loggedIn) {
      return (
          <Layout>
              <div className="flex justify-center mt-20">
                  <div className="bg-white p-8 rounded shadow text-center">
                      <h2 className="text-xl font-bold mb-4">بوابة الأطباء</h2>
                      <p className="mb-4 text-sm text-gray-500">للتجربة اضغط دخول مباشرة</p>
                      <button onClick={() => setLoggedIn(true)} className="bg-teal-600 text-white px-6 py-2 rounded">دخول</button>
                  </div>
              </div>
          </Layout>
      )
  }

  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {/* Profile Card */}
         <div className="bg-white p-6 rounded-xl shadow">
             <div className="flex items-center gap-4 mb-4">
                 <div className="w-16 h-16 bg-slate-200 rounded-full"></div>
                 <div>
                     <h2 className="text-xl font-bold">د. محمد أحمد</h2>
                     <p className="text-slate-500">أخصائي باطنة</p>
                 </div>
             </div>
             <div className="grid grid-cols-2 gap-4 text-sm">
                 <div className="bg-slate-50 p-3 rounded">
                     <span className="block text-slate-400">رصيد اعتيادي</span>
                     <span className="font-bold text-lg">15 يوم</span>
                 </div>
                 <div className="bg-slate-50 p-3 rounded">
                     <span className="block text-slate-400">رصيد عارضة</span>
                     <span className="font-bold text-lg">3 يوم</span>
                 </div>
             </div>
         </div>

         {/* Leave Request */}
         <div className="bg-white p-6 rounded-xl shadow">
             <h3 className="font-bold border-b pb-2 mb-4">تقديم طلب إجازة / إذن</h3>
             <div className="space-y-3">
                 <select className="w-full border p-2 rounded" onChange={e => setLeaveForm({...leaveForm, type: e.target.value})}>
                     <option value="usual">إجازة اعتيادية</option>
                     <option value="casual">إجازة عارضة</option>
                     <option value="sick">إجازة مرضي</option>
                     <option value="permission_morning">إذن صباحي</option>
                 </select>
                 <div className="flex gap-2">
                     <input type="date" className="w-full border p-2 rounded" onChange={e => setLeaveForm({...leaveForm, start: e.target.value})} />
                     <span className="self-center">إلى</span>
                     <input type="date" className="w-full border p-2 rounded" onChange={e => setLeaveForm({...leaveForm, end: e.target.value})} />
                 </div>
                 <textarea className="w-full border p-2 rounded" placeholder="ملاحظات..." onChange={e => setLeaveForm({...leaveForm, notes: e.target.value})}></textarea>
                 <button onClick={submitLeave} className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700">إرسال الطلب</button>
             </div>
         </div>
      </div>
    </Layout>
  );
};