
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  const processEnv = { ...process.env, ...env };

  return {
    plugins: [react()],
    define: {
      // Stringify the entire process.env object to ensure it is defined in the browser
      'process.env': JSON.stringify({
        API_KEY: processEnv.API_KEY || processEnv.VITE_API_KEY || '',
        VITE_SUPABASE_URL: processEnv.VITE_SUPABASE_URL || processEnv.SUPABASE_URL || processEnv.NEXT_PUBLIC_SUPABASE_URL || '',
        VITE_SUPABASE_ANON_KEY: processEnv.VITE_SUPABASE_ANON_KEY || processEnv.SUPABASE_ANON_KEY || processEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
        NODE_ENV: mode
      }),
      // Define a shim for process itself if any libraries check typeof process
      'process': JSON.stringify({
          env: {
            NODE_ENV: mode
          }
      }),
      'global': 'globalThis',
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom'],
            'vendor-ui': ['lucide-react'],
            'vendor-ai': ['@google/genai'],
          }
        }
      }
    },
    server: {
      host: true,
    }
  };
});
