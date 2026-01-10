
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { SiteConfigProvider } from './contexts/SiteConfigContext';
import { DataProvider } from './contexts/DataContext';

// Safe environment shim for mobile devices
if (typeof window !== 'undefined') {
  // Fix: Property 'process' does not exist on type 'Window'. Casting to any to allow definition of environment variables.
  (window as any).process = (window as any).process || {};
  // Fix: Property 'process' does not exist on type 'Window'. Casting to any to allow definition of NODE_ENV.
  (window as any).process.env = (window as any).process.env || { NODE_ENV: 'production' };
  (window as any).global = window;
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Root element not found");

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <SiteConfigProvider>
      <DataProvider>
        <App />
      </DataProvider>
    </SiteConfigProvider>
  </React.StrictMode>
);
