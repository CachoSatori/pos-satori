import React from 'react';
import ReactDOM from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import * as Sentry from '@sentry/react';
import i18n from './i18n';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
});

// Setup Sentry alerts in dashboard for production monitoring (e.g., error rate > 5%).

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </I18nextProvider>
  </React.StrictMode>
);
