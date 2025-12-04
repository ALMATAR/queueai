import React, { useState, useEffect } from 'react';
import { db, firestore } from '../firebase';
import { ref, onValue } from 'firebase/database';
import { addDoc, collection } from 'firebase/firestore';
import { Clinic } from '../types';
import { Layout } from '../components/Layout';

export const Client: React.FC = () => {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [myNumber, setMyNumber] = useState<number | ''>('');
  const [selectedClinicId, setSelectedClinicId] = useState('');
  
  // Feedback form
  const [feedback, setFeedback] = useState({ text: '', type: 'complaint' });

  useEffect(() => {
    onValue(ref(db, 'clinics'), (snap) => {
        const data = snap.val();
        if(data) setClinics(Object.keys(data).map(k => ({...data[k], id: k})));
    });
  }, []);

  const currentClinic = clinics.find(c => c.id === selectedClinicId);
  const isMyTurn = currentClinic && myNumber && currentClinic.currentNumber === Number(myNumber);

  const submitFeedback = async () => {
      if(!feedback.text) return;
      try {
          await addDoc(collection(firestore, 'complaints'), {
              ...feedback,
              createdAt: new Date().toISOString()
          });
          alert('تم إرسال رسالتك بنجاح');
          setFeedback({ text: '', type: 'complaint' });
      } catch (e) {
          alert('حدث خطأ');
      }
  };

  return (
    <Layout>
       <div className="max-w-md mx-auto space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
             <h2 className="text-xl font-bold mb-4 text-center">متابعة الدور</h2>
             <select 
                className="w-full border p-3 rounded-lg mb-4"
                value={selectedClinicId}
                onChange={e => setSelectedClinicId(e.target.value)}
             >
                <option value="">اختر العيادة للمتابعة</option>
                {clinics.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
             </select>

             {currentClinic && (
                 <div className="text-center py-6">
                     <p className="text-slate-500">الرقم الحالي</p>
                     <p className="text-6xl font-black text-teal-600 font-mono my-2">{currentClinic.currentNumber}</p>
                     
                     <div className="mt-6 border-t pt-4">
                        <label className="block text-sm font-medium mb-2">ما هو رقمك؟</label>
                        <input 
                            type="number" 
                            className="w-full border p-3 rounded-lg text-center text-xl" 
                            placeholder="أدخل رقم تذكرتك"
                            value={myNumber}
                            onChange={e => setMyNumber(Number(e.target.value))}
                        />
                        {isMyTurn && (
                            <div className="mt-4 bg-green-100 text-green-800 p-4 rounded-lg animate-bounce font-bold">
                                حان دورك الآن! يرجى التوجه للعيادة.
                            </div>
                        )}
                         {currentClinic && myNumber && !isMyTurn && Number(myNumber) > currentClinic.currentNumber && (
                            <p className="mt-2 text-sm text-slate-500">
                                أمامك {Number(myNumber) - currentClinic.currentNumber} شخص
                            </p>
                        )}
                     </div>
                 </div>
             )}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
             <h3 className="font-bold mb-4">شكاوى واقتراحات</h3>
             <div className="space-y-3">
                 <div className="flex gap-4">
                     <label className="flex items-center gap-2">
                         <input type="radio" checked={feedback.type === 'complaint'} onChange={() => setFeedback({...feedback, type: 'complaint'})} /> شكوى
                     </label>
                     <label className="flex items-center gap-2">
                         <input type="radio" checked={feedback.type === 'suggestion'} onChange={() => setFeedback({...feedback, type: 'suggestion'})} /> اقتراح
                     </label>
                 </div>
                 <textarea 
                    className="w-full border p-2 rounded" 
                    rows={3} 
                    placeholder="اكتب رسالتك هنا..."
                    value={feedback.text}
                    onChange={e => setFeedback({...feedback, text: e.target.value})}
                 ></textarea>
                 <button onClick={submitFeedback} className="w-full bg-slate-800 text-white py-2 rounded">إرسال</button>
             </div>
          </div>
       </div>
    </Layout>
  );
};