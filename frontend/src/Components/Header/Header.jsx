import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../axios/axiosInstance'; 
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../LanguageSelector';
import "./Header.css";

const Header = () => {
    const { t, i18n } = useTranslation();
    const [activeButton, setActiveButton] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { isLoggedIn, logout } = useAuth();
    const navigate = useNavigate();

    const handleButtonClick = (buttonId) => {
        setActiveButton(buttonId);
        window.scroll(0, 0);
    };

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('authToken');
            console.log(token);

            await axiosInstance.post('/auth/logout', { token });
            
            logout();
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleMouseEnter = () => {
        setIsDropdownOpen(true);
    };

    const handleMouseLeave = () => {
        setIsDropdownOpen(false);
    };

    return (
        <header className='header'>
            <div className="hamburger_icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? '✕' : '☰'}
            </div>

            <span className="header_title">
                <Link to='/' onClick={() => { handleButtonClick(1); setIsMobileMenuOpen(false) }}>
                    TrekTrip
                </Link>
            </span>
            <nav className="navbar">
                <Link to='/putovanja'>
                    <button className={`nav_button ${activeButton === 3 ? 'active' : ''}`}
                        onClick={() => handleButtonClick(3)}>
                        {t('header.trips')}
                    </button>
                </Link>
                {isLoggedIn ? (
                    <div
                        className={`dropdown-container ${isDropdownOpen ? 'open' : ''}`}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <Link to='/profil'>
                            <button className={`nav_button ${activeButton === 2 ? 'active' : ''}`}
                                onClick={() => handleButtonClick(2)}>
                                {t('header.profile')}
                            </button>
                        </Link>
                        {isDropdownOpen && (
                            <div className="dropdown-content">
                                <button className="nav_button" onClick={handleLogout}>
                                    {t('header.logout')}
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link to="/prijava">
                        <button className="nav_button">
                            {t('header.login')}
                        </button>
                    </Link>
                )}
                 <LanguageSelector />
            </nav>

            {isMobileMenuOpen && (
                <div className="mobile-menu">
                <Link to='/putovanja' onClick={() => { handleButtonClick(3); setIsMobileMenuOpen(false); }}>
                    <button className="nav_button">{t('header.trips')}</button>
                </Link>
                {isLoggedIn ? (
                    <>
                        <Link to='/profil' onClick={() => { handleButtonClick(2); setIsMobileMenuOpen(false); }}>
                            <button className="nav_button">{t('header.profile')}</button>
                        </Link>
                        <button className="nav_button" onClick={handleLogout}>
                            {t('header.logout')}
                        </button>
                    </>
                ) : (
                    <Link to="/prijava" onClick={() => setIsMobileMenuOpen(false)}>
                        <button className="nav_button">{t('header.login')}</button>
                    </Link>
                )}
                <LanguageSelector />
            </div>
            )}
        </header>  
    )
}

export default Header;
