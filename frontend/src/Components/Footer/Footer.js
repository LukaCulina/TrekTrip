import React from 'react'
import { useTranslation } from 'react-i18next';
import './Footer.css'

const Footer = () => {
  const {t} = useTranslation();

  return (
    <div className="footer">
      <div className='copyright'>
        <p>Copyright 2024 TrekTrip</p>
      </div>
      <div className="footer-links">
        <a href="/privacy-policy">{t('footer.privacyPolicy')}</a>
        <a href="/terms-conditions">{t('footer.termsConditions')}</a>
        <a href="/cookie-policy">{t('footer.cookiePolicy')}</a>
        <a href="/contact">{t('footer.contact')}</a>
      </div>
    </div>
  )
}

export default Footer