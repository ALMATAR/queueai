import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Settings, Monitor, Mic, Printer, User, Calendar, Stethoscope, Info } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  fullScreen?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, fullScreen }) => {
  const location = useLocation();

  if (fullScreen) {
    return <div className="min-h-screen bg-slate-900 text-white">{children}</div>;
  }

  const navItems = [
    { path: '/', label: 'الرئيسية', icon: Home },
    { path: '/display', label: 'شاشة العرض', icon: Monitor },
    { path: '/control', label: 'التحكم', icon: Mic },
    { path: '/admin', label: 'الإدارة', icon: Settings },
    { path: '/print', label: 'الطباعة', icon: Printer },
    { path: '/booking', label: 'الحجز', icon: Calendar },
    { path: '/client', label: 'العميل', icon: User },
    { path: '/doctors', label: 'الأطباء', icon: Stethoscope },
    { path: '/about', label: 'عن النظام', icon: Info },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-teal-700 text-white shadow-md print:hidden">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">نظام إدارة العيادات الذكي</h1>
          <nav className="hidden md:flex gap-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === item.path ? 'bg-teal-800' : 'hover:bg-teal-600'
                }`}
              >
                <item.icon size={18} />
                <span className="text-sm">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="flex-1 container mx-auto p-4">
        {children}
      </main>
      <footer className="bg-slate-800 text-slate-300 py-4 text-center text-sm print:hidden">
        &copy; {new Date().getFullYear()} جميع الحقوق محفوظة - الإصدار 1.0
      </footer>
    </div>
  );
};