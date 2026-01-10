import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Fix: Property 'cwd' does not exist on type 'Process'. Casting to any to allow access to the Node.js process.cwd() method during build.
  const env = loadEnv(mode, (process as any).cwd(), '');
  const processEnv = { ...process.env, ...env };

  return {
    plugins: [react()],
    define: {
      'process.env': JSON.stringify({
        API_KEY: processEnv.API_KEY || processEnv.VITE_API_KEY || '',
        VITE_SUPABASE_URL: processEnv.VITE_SUPABASE_URL || processEnv.SUPABASE_URL || processEnv.NEXT_PUBLIC_SUPABASE_URL || '',
        VITE_SUPABASE_ANON_KEY: processEnv.VITE_SUPABASE_ANON_KEY || processEnv.SUPABASE_ANON_KEY || processEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
        NODE_ENV: mode
      }),
      'global': 'globalThis',
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      target: 'es2015',
      minify: 'esbuild',
      cssTarget: 'chrome61',
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
