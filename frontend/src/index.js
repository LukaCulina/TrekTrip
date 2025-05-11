import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import App from './App';

i18n.init({
  interpolation: { escapeValue: false },
  lng: localStorage.getItem('language') || 'hr', // Retrieve language from localStorage
  resources: {
    hr: {
      translation: require('./locales/hr.json'),
    },
    en: {
      translation: require('./locales/en.json')
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
