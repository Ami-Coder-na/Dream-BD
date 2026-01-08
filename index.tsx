
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { SiteConfigProvider } from './contexts/SiteConfigContext';
import { DataProvider } from './contexts/DataContext';

// Safe environment shim
if (typeof window !== 'undefined') {
  (window as any).process = (window as any).process || { env: { NODE_ENV: 'production' } };
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
