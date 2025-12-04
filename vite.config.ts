import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// استبدل 'repo-name' باسم المستودع الخاص بك على GitHub كما هو بالضبط
// مثال: لو الرابط github.com/user/queue-app إذن الاسم هو '/queue-app/'
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: '/اسم-المستودع-هنا/', // <--- هذا السطر هو الأهم للتشغيل على GitHub Pages
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
