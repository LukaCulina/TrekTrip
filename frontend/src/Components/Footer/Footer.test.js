// src/Footer.test.js
import React from 'react';
import { render } from '@testing-library/react';
import Footer from './Footer';
import { useTranslation } from 'react-i18next';

// Mock the useTranslation hook
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'footer.privacyPolicy': 'Privacy Policy',
        'footer.termsConditions': 'Terms & Conditions',
        'footer.cookiePolicy': 'Cookie Policy',
        'footer.contact': 'Contact',
      };
      return translations[key];
    },
  }),
}));

describe('Footer', () => {
  it('should render footer with translated links', () => {
    const { getByText } = render(<Footer />);

    expect(getByText('Privacy Policy')).toBeInTheDocument();
    expect(getByText('Terms & Conditions')).toBeInTheDocument();
    expect(getByText('Cookie Policy')).toBeInTheDocument();
    expect(getByText('Contact')).toBeInTheDocument();
    expect(getByText('Copyright 2024 TrekTrip')).toBeInTheDocument();
  });
});
