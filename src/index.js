import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

async function deferRender() {
  if (process.env.NODE_ENV === 'development' || process.env.PUBLIC_URL) {
    const { worker } = await import('./mocks/browser');
    await worker.start({ serviceWorker: { url: `${process.env.PUBLIC_URL || ''}/mockServiceWorker.js` } });
  }
}

deferRender().then(() => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
