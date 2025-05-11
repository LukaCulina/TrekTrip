import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Replace with your actual context if different
import Header from './Header'; // Replace with the correct path to your Header component

// Mock AuthContext for testing purposes
const mockAuthContextValue = {
    isLoggedIn: true,
    logout: jest.fn(),
};

// Mock useAuth hook
jest.mock('../../context/AuthContext', () => ({
    useAuth: () => mockAuthContextValue,
}));

// Mock useNavigate hook
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

// Mock useTranslation hook
const mockChangeLanguage = jest.fn();
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key) => key,
        i18n: {
            changeLanguage: mockChangeLanguage,
        },
    }),
}));

beforeEach(() => {
    mockAuthContextValue.logout.mockClear();
    mockNavigate.mockClear();
});

describe('Header Component', () => {
    beforeEach(() => {
        render(
            <Router>
                <Header />
            </Router>
        );
    });

    it('renders the header title correctly', () => {
        const headerTitle = screen.getByText('TrekTrip');
        expect(headerTitle).toBeInTheDocument();
    });

    it('activates the button and scrolls to top on button click', () => {
        const tripsButton = screen.getByText('header.trips');
        fireEvent.click(tripsButton);
        expect(tripsButton).toHaveClass('active');
        expect(window.scrollY).toBe(0);
    });

    it('displays profile dropdown when logged in', async () => {
        // Simulate logged in state
        mockAuthContextValue.isLoggedIn = true;
        
        const profileButton = screen.getByText('header.profile');
        fireEvent.mouseEnter(profileButton);
    
        const logoutButton = await screen.findByText('header.logout');
        fireEvent.click(logoutButton);
    
        expect(mockAuthContextValue.logout).toHaveBeenCalled();
    
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('changes language when language buttons are clicked', () => {
        const hrButton = screen.getByText('HR');
        const enButton = screen.getByText('EN');

        fireEvent.click(hrButton);
        expect(mockChangeLanguage).toHaveBeenCalledWith('hr');

        fireEvent.click(enButton);
        expect(mockChangeLanguage).toHaveBeenCalledWith('en');
    });


    it('renders login button when not logged in', () => {
        mockAuthContextValue.isLoggedIn = false;
        render(
            <Router>
                <Header />
            </Router>
        );
        const loginButton = screen.getByText('header.login');
        expect(loginButton).toBeInTheDocument();
    });

    it('displays profile dropdown when mouse enters profile button', async () => {
        mockAuthContextValue.isLoggedIn = true;
  
        const profileLinkButton = screen.getByText('header.profile');
        fireEvent.mouseEnter(profileLinkButton);

        const logoutButton = await screen.findByText('header.logout');
        expect(logoutButton).toBeInTheDocument();

        fireEvent.mouseLeave(profileLinkButton);
        const dropdownContent = screen.queryByText('header.logout');
        expect(dropdownContent).not.toBeInTheDocument();
    });

    it('handles click on header title link', () => {
        const headerTitleLink = screen.getByText('TrekTrip');
        fireEvent.click(headerTitleLink);

        expect(window.scrollY).toBe(0);
    });

    it('handles click on profile link button', () => {
        mockAuthContextValue.isLoggedIn = true;
    
        const profileLinkButton = screen.getByText('header.profile');
        fireEvent.click(profileLinkButton);
    
        expect(window.location.pathname).toBe('/profil');
    });
    
});
