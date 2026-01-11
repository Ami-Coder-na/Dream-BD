
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { SiteConfigProvider } from './contexts/SiteConfigContext';
import { DataProvider } from './contexts/DataContext';

// Safe environment shim for mobile devices
if (typeof window !== 'undefined') {
  const win = window as any;
  win.process = win.process || {};
  win.process.env = win.process.env || { NODE_ENV: 'production' };
  win.global = win.global || window;
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Root element not found");

try {
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
} catch (e) {
  console.error("Mounting Error:", e);
  // Clear any potential corrupt local state that prevents mounting
  if (e instanceof Error && e.message.includes('Quota')) {
    localStorage.removeItem('site_settings');
  }
}
