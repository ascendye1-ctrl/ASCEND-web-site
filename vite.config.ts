import { defineConfig, loadEnv } from 'vite'; // 👈 تصحيح الاستيراد
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
    // الآن loadEnv معرفة ويمكن استخدامها
    const env = loadEnv(mode, '.', '');
    
    return {
        // base: '/ASCEND-web-site/' مهم جداً للنشر على GitHub Pages
        base: '/ASCEND-web-site/', 
        
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
                // يفضل استخدام @ كاختصار لمجلد src أو المشروع بدلاً من .
                '@': path.resolve(__dirname, './src'), 
            }
        }
    };
});
