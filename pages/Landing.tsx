import React from 'react';
import { Link } from 'react-router-dom';
import { Monitor, Settings, Calendar, User, Printer, Activity, ShieldCheck, Users, Info } from 'lucide-react';

const Card = ({ to, title, icon: Icon, color }: { to: string, title: string, icon: any, color: string }) => (
  <Link to={to} className={`block p-6 rounded-2xl shadow-lg hover:shadow-xl transition-transform hover:-translate-y-1 ${color} text-white`}>
    <div className="flex flex-col items-center justify-center gap-4 text-center h-40">
      <Icon size={48} />
      <h2 className="text-xl font-bold">{title}</h2>
    </div>
  </Link>
);

export const Landing: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-slate-800 mb-4">مرحباً بكم في نظام إدارة العيادات</h1>
        <p className="text-slate-500 text-lg">الرجاء اختيار الوجهة من القائمة أدناه</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-6xl">
        <Card to="/display" title="شاشة العرض" icon={Monitor} color="bg-blue-600" />
        <Card to="/control" title="وحدة التحكم" icon={Activity} color="bg-green-600" />
        <Card to="/booking" title="حجز موعد" icon={Calendar} color="bg-purple-600" />
        <Card to="/client" title="بوابة العميل" icon={User} color="bg-orange-500" />
        <Card to="/print" title="طباعة الأرقام" icon={Printer} color="bg-slate-600" />
        <Card to="/admin" title="الإدارة" icon={Settings} color="bg-red-600" />
        <Card to="/doctors" title="بوابة الأطباء" icon={ShieldCheck} color="bg-teal-600" />
        <Card to="/about" title="عن النظام" icon={Info} color="bg-indigo-500" />
      </div>
    </div>
  );
};