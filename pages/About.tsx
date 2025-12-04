import React from 'react';
import { Layout } from '../components/Layout';

export const About: React.FC = () => (
  <Layout>
    <div className="max-w-2xl mx-auto text-center mt-10 p-8 bg-white rounded-xl shadow">
      <h1 className="text-3xl font-bold mb-4 text-teal-700">نظام الانتظار الذكي</h1>
      <p className="text-lg text-slate-600 mb-6">الإصدار 1.0.0</p>
      <p className="text-slate-500 leading-relaxed">
        نظام متكامل لإدارة الطوابير الطبية، مصمم لتسهيل تجربة المريض وتنظيم عمل الأطباء.
        يعمل النظام بتقنيات الويب الحديثة وقواعد بيانات فورية لضمان سرعة الاستجابة.
      </p>
      <div className="mt-8 pt-8 border-t text-sm text-slate-400">
        تم التطوير بواسطة مطور محترف باستخدام React & Firebase
      </div>
    </div>
  </Layout>
);