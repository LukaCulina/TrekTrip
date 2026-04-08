import React from 'react';
import ReactDOM from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import hrTranslation from './locales/hr.json';
import enTranslation from './locales/en.json';
import App from './App';
import './index.css';

i18n.init({
  interpolation: { escapeValue: false },
  lng: localStorage.getItem('language') || 'hr',
  resources: {
    hr: {
      translation: hrTranslation,
    },
    en: {
      translation: enTranslation
    },
  },
});

// Save selected language to localStorage
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng);
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  </React.StrictMode>
);
