
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { SiteConfigProvider } from './contexts/SiteConfigContext';
import { DataProvider } from './contexts/DataContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

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
