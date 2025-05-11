import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Router } from 'react-router-dom'; // Import MemoryRouter
import axiosInstance from '../../axios/axiosInstance';
import Profile from './Profile';
import { createMemoryHistory } from 'history';
import { AuthContext } from '../../context/AuthContext';

// Mock AuthContext for testing purposes
const mockAuthContextValue = {
  isLoggedIn: true,
};

// Mock useAuth hook
jest.mock('../../context/AuthContext', () => ({
  useAuth: () => mockAuthContextValue,
}));

// Mock axiosInstance for testing purposes
jest.mock('../../axios/axiosInstance', () => ({
  get: jest.fn(),
}));

// Mock useNavigate hook
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

describe('Profile Component', () => {
  beforeEach(() => {
    // Mock axiosInstance responses
    axiosInstance.get.mockImplementation((url) => {
      switch (url) {
        case '/user/all':
          return Promise.resolve({
            data: [{ id: 1, username: 'testuser' }],
          });
        case '/user/1':
          return Promise.resolve({
            data: {
              username: 'testuser',
              description: 'Test user description',
              image: { url: '/test-image.jpg' },
            },
          });
        case '/trip/all':
          return Promise.resolve({
            data: [
              { id: 1, user: { username: 'testuser' }, ratings: [{ rating: 4 }, { rating: 5 }] },
              { id: 2, user: { username: 'testuser' }, ratings: [{ rating: 3 }, { rating: 2 }] },
              { id: 3, user: { username: 'testuser' }, ratings: [{ rating: 5 }] },
            ],
          });
        default:
          return Promise.reject(new Error('Unhandled request: ' + url));
      }
    });

    localStorage.setItem('username', 'testuser');

    render(
      <MemoryRouter initialEntries={['/']}>
        <Profile />
      </MemoryRouter>
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    localStorage.clear();
  });

  it('renders user profile after data fetch', async () => {
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('testuser')).toBeInTheDocument();
    });

    // Assert user profile information is rendered
    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByAltText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Test user description')).toBeInTheDocument();

    // Assert top trips are rendered
    /*const trips = screen.getAllByTestId('trip-card');
    expect(trips).toHaveLength(3);*/
  });

  it('displays user profile information when logged in', async () => {
    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByText('testuser')).toBeInTheDocument();
    });

    // Expect profile page to be displayed
    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByAltText('Profile')).toBeInTheDocument();
    expect(screen.getByText(/profile.editProfile/i)).toBeInTheDocument();
    expect(screen.getByText(/profile.addTrip/i)).toBeInTheDocument();
    expect(screen.getByText('Test user description')).toBeInTheDocument();
    /*const trips = screen.getAllByText('trip-card');
    expect(trips).toHaveLength(3);*/
  });

  it('handles error when fetching user data', async () => {
    // Spy on console.error
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Mock axiosInstance.get to throw an error
    axiosInstance.get.mockRejectedValueOnce(new Error('Failed to fetch user data'));

    // Re-render component to trigger data fetching
    render(
      <MemoryRouter initialEntries={['/']}>
        <Profile />
      </MemoryRouter>
    );

    // Expect error message to be logged
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    // Expect error message to be displayed to the user
    expect(screen.getByText('No user data available')).toBeInTheDocument();

    // Clean up spy
    consoleErrorSpy.mockRestore();
  });

  /*it('navigates to Edit Profile page when Edit Profile button is clicked', async () => {
    // Wait for user data to be fetched and displayed
    await waitFor(() => {
      expect(screen.getByText('testuser')).toBeInTheDocument();
    });

    // Click Edit Profile button
    const editProfileButton = screen.getByText(/profile.editProfile/i);
    userEvent.click(editProfileButton);

    // Expect navigation to '/uredi-profil'
    expect(window.location.pathname).toBe('/uredi-profil');
  });

  it('navigates to Add Trip page when Add Trip button is clicked', async () => {
    
    // Wait for user data to be fetched and displayed
    await waitFor(() => {
      expect(screen.getByText('testuser')).toBeInTheDocument();
    });

    // Click Add Trip button
    const addTripButton = screen.getByText(/profile.addTrip/i);
    userEvent.click(addTripButton);

    // Expect navigation to '/dodaj-put'
    expect(mockNavigate).toHaveBeenCalledWith('/dodaj-put');
  });*/

  it('redirects to login page when not logged in', async () => {
    // Update AuthContext to simulate not logged in state
    mockAuthContextValue.isLoggedIn = false;
    // Re-render component
    render(
        <MemoryRouter>
            <Profile />
        </MemoryRouter>
    );

    // Expect to be redirected to login page
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/prijava');
    });
  });

  it('logs error when logged-in user is not found', async () => {
    // Spy on console.error
    const consoleErrorSpy = jest.spyOn(global.console, 'log');

    // Mock axiosInstance.get to return empty users array
    axiosInstance.get.mockResolvedValueOnce({ data: [] });

    await waitFor(() => {
      // Expect "No user data available" message to be displayed
      expect(screen.getByText('No user data available')).toBeInTheDocument();
      
      // Expect console.error to have been called with the specific message
      //expect(consoleErrorSpy).toHaveBeenCalled();
  });


    // Clean up spy
    consoleErrorSpy.mockRestore();
});

});
