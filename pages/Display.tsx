import React, { useEffect, useState, useRef } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';
import { Clinic, Settings } from '../types';
import { audioSystem } from '../services/audioService';
import { Maximize, Minimize } from 'lucide-react';

export const Display: React.FC = () => {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [selectedScreen, setSelectedScreen] = useState('1');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notification, setNotification] = useState<string | null>(null);
  
  // Audio init state
  const [audioInitialized, setAudioInitialized] = useState(false);

  // Refs for tracking changes to play sound
  const prevClinicsRef = useRef<Clinic[]>([]);

  useEffect(() => {
    // 1. Fetch Settings
    const settingsRef = ref(db, 'settings');
    const unsubSettings = onValue(settingsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setSettings(data);
        if (data.audioPath) audioSystem.setBasePath(data.audioPath);
      }
    });

    // 2. Fetch Clinics
    const clinicsRef = ref(db, 'clinics');
    const unsubClinics = onValue(clinicsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedClinics: Clinic[] = [];
      if (data) {
        Object.keys(data).forEach(key => {
          loadedClinics.push({ ...data[key], id: key });
        });
      }
      setClinics(loadedClinics);
    });

    // Clock
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);

    return () => {
      unsubSettings();
      unsubClinics();
      clearInterval(timer);
    };
  }, []);

  // Watch for Number Changes to Play Sound and Show Notification
  useEffect(() => {
    if (!audioInitialized) return;

    clinics.forEach(clinic => {
      const prevClinic = prevClinicsRef.current.find(c => c.id === clinic.id);
      if (prevClinic && clinic.currentNumber > prevClinic.currentNumber) {
        // Play sound
        audioSystem.playQueueSequence(clinic.currentNumber, clinic.id);
        
        // Show notification
        const timeStr = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
        setNotification(`العميل رقم ${clinic.currentNumber} التوجه إلى ${clinic.name} (${timeStr})`);
        
        // Clear notification after duration
        setTimeout(() => setNotification(null), (settings?.notificationDuration || 10) * 1000);
      }
    });
    
    prevClinicsRef.current = clinics;
  }, [clinics, audioInitialized, settings]);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  const filteredClinics = clinics.filter(c => c.screenId === selectedScreen);

  if (!audioInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <button 
          onClick={() => setAudioInitialized(true)}
          className="bg-teal-600 text-white px-8 py-4 rounded-xl text-2xl font-bold shadow-lg hover:bg-teal-500"
        >
          اضغط لبدء تشغيل الشاشة والنظام الصوتي
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-100 overflow-hidden" dir="rtl">
      {/* Top Bar */}
      <div className="bg-slate-900 text-white p-2 px-4 flex justify-between items-center shadow-md z-10">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">{settings?.centerName || 'المركز الطبي'}</h1>
          <span className="text-teal-400 font-mono text-xl">{currentTime.toLocaleTimeString('ar-EG')}</span>
          <span className="text-slate-400 text-sm">{currentTime.toLocaleDateString('ar-EG')}</span>
        </div>
        
        {notification && (
           <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-yellow-500 text-black px-8 py-3 rounded-full text-2xl font-bold shadow-2xl animate-pulse z-50">
             {notification}
           </div>
        )}

        <div className="flex gap-2 items-center">
          <select 
            className="bg-slate-800 border border-slate-700 rounded p-1 text-sm"
            value={selectedScreen}
            onChange={(e) => setSelectedScreen(e.target.value)}
          >
            {[1,2,3,4,5].map(n => <option key={n} value={n}>شاشة {n}</option>)}
          </select>
          <button onClick={toggleFullScreen} className="p-1 hover:bg-slate-700 rounded">
            {isFullScreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content Area: Video (Left) & Cards (Right) */}
        
        {/* Left: Media Player (Taking remaining space) */}
        <div className="flex-1 bg-black relative flex items-center justify-center">
             {/* Placeholder for video. In production, use <video> with playlist logic */}
             <div className="absolute inset-0 flex items-center justify-center text-slate-500">
                {settings?.videoPath ? (
                    <video 
                        src={settings.videoPath} 
                        className="w-full h-full object-contain" 
                        autoPlay 
                        muted 
                        loop 
                    />
                ) : (
                    <div className="text-center">
                        <p className="text-2xl mb-2">مساحة الفيديو</p>
                        <p className="text-sm">قم بتعيين مسار الفيديو من الإعدادات</p>
                    </div>
                )}
             </div>
        </div>

        {/* Right: Clinics Column */}
        <div className="w-1/3 min-w-[350px] max-w-[450px] bg-white border-r border-slate-200 flex flex-col h-full shadow-xl z-20">
          <div className="flex-1 overflow-hidden p-2 space-y-3">
             {filteredClinics.map(clinic => (
               <div 
                 key={clinic.id} 
                 className={`rounded-xl p-4 border-r-8 shadow-sm transition-all duration-500 ${
                   clinic.status === 'active' 
                   ? 'bg-white border-teal-500' 
                   : 'bg-slate-50 border-slate-300 opacity-60 grayscale'
                 } ${notification?.includes(clinic.name) ? 'ring-4 ring-yellow-400 scale-105' : ''}`}
               >
                 <div className="flex justify-between items-start mb-2">
                   <h2 className="text-2xl font-bold text-slate-800">{clinic.name}</h2>
                   {clinic.status === 'paused' && <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">متوقف</span>}
                 </div>
                 <div className="flex justify-between items-end">
                    <span className="text-sm text-slate-500">آخر نداء: {clinic.lastCallTime || '--:--'}</span>
                    <span className="text-6xl font-black text-slate-900 font-mono">{clinic.currentNumber}</span>
                 </div>
               </div>
             ))}
          </div>
          
          {/* Bottom Fixed Area in Column: QR & Doctors */}
          <div className="p-2 border-t border-slate-200 bg-slate-50 grid grid-cols-2 gap-2 h-40">
             <div className="bg-white p-2 rounded-lg flex flex-col items-center justify-center shadow-sm">
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${window.location.origin}/%23/client`} alt="Client QR" className="w-20 h-20 mb-1" />
                <span className="text-xs font-bold text-slate-600">امسح للدخول</span>
             </div>
             <div className="bg-white rounded-lg shadow-sm overflow-hidden relative">
                {/* Simulated Doctor Rotation */}
                <img src="https://picsum.photos/200/200?random=1" alt="Doctor" className="w-full h-full object-cover" />
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 text-center">
                    د. أحمد محمد
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Footer Ticker */}
      <div className="bg-teal-800 text-white h-12 flex items-center overflow-hidden whitespace-nowrap relative border-t-4 border-teal-600">
        <div 
            className="absolute whitespace-nowrap animate-marquee"
            style={{ 
                animation: `marquee ${200 / (settings?.scrollSpeed || 10)}s linear infinite` 
            }}
        >
          {settings?.scrollText || "مرحباً بكم في مركزنا الطبي. نتمنى لكم الشفاء العاجل. يرجى الالتزام بالهدوء في صالة الانتظار."}
          <span className="mx-8">***</span>
          {settings?.scrollText || "مرحباً بكم في مركزنا الطبي."}
        </div>
        
        {/* CSS for marquee defined in style tag in return or global css */}
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
      </div>
    </div>
  );
};