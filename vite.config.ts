import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // Define process.env to prevent "Uncaught ReferenceError: process is not defined"
      'process.env': {
        API_KEY: env.API_KEY || env.VITE_API_KEY || '',
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