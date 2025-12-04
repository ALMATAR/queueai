import React, { useState } from 'react';
import { Layout } from '../components/Layout';

export const Print: React.FC = () => {
  const [config, setConfig] = useState({ start: 1, end: 50, clinicName: 'عيادة الباطنة' });
  
  const generateRange = () => {
    const arr = [];
    for(let i = config.start; i <= config.end; i++) arr.push(i);
    return arr;
  };

  return (
    <Layout>
      <div className="no-print bg-white p-4 rounded shadow mb-4 max-w-2xl mx-auto">
         <h2 className="text-xl font-bold mb-4">إعدادات الطباعة</h2>
         <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="اسم العيادة" value={config.clinicName} onChange={e => setConfig({...config, clinicName: e.target.value})} className="border p-2 rounded col-span-2" />
            <input type="number" placeholder="من رقم" value={config.start} onChange={e => setConfig({...config, start: Number(e.target.value)})} className="border p-2 rounded" />
            <input type="number" placeholder="إلى رقم" value={config.end} onChange={e => setConfig({...config, end: Number(e.target.value)})} className="border p-2 rounded" />
            <button onClick={() => window.print()} className="bg-teal-600 text-white p-2 rounded col-span-2 hover:bg-teal-700">طباعة الصفحة</button>
         </div>
      </div>

      <div className="grid grid-cols-4 gap-4 print:grid-cols-4">
         {generateRange().map(num => (
             <div key={num} className="border-2 border-slate-800 p-4 text-center h-[180px] flex flex-col justify-between rounded-lg print:break-inside-avoid">
                 <div className="text-xs font-bold text-slate-500 border-b pb-1">{config.clinicName}</div>
                 <div className="text-6xl font-black font-mono my-2">{num}</div>
                 <div className="text-[10px] text-slate-400">{new Date().toLocaleDateString('ar-EG')}</div>
             </div>
         ))}
      </div>
    </Layout>
  );
};