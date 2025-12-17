import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  // Combine process.env and loaded env to ensure we capture Vercel system variables
  const processEnv = { ...process.env, ...env };

  return {
    plugins: [react()],
    define: {
      // Define process.env to prevent "Uncaught ReferenceError: process is not defined"
      'process.env': {
        API_KEY: processEnv.API_KEY || processEnv.VITE_API_KEY || '',
        
        // Map standard Vercel/Supabase integration variables (SUPABASE_URL) to VITE_ variables
        // We check both 'env' (from files) and 'process.env' (from system/Vercel UI)
        VITE_SUPABASE_URL: processEnv.VITE_SUPABASE_URL || processEnv.SUPABASE_URL || processEnv.NEXT_PUBLIC_SUPABASE_URL || '',
        VITE_SUPABASE_ANON_KEY: processEnv.VITE_SUPABASE_ANON_KEY || processEnv.SUPABASE_ANON_KEY || processEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
        
        NODE_ENV: mode
      },
      // Define global to prevent "Uncaught ReferenceError: global is not defined" in some libs
      'global': 'window',
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