import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { HashRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import App, { PrivateRoute, PublicRoute } from './App';

// Mocking useAuth hook directly
jest.mock('./context/AuthContext', () => ({
  ...jest.requireActual('./context/AuthContext'),
  useAuth: jest.fn(),
}));

// Mocking Navigate component
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Navigate: ({ to }) => <div>{`Redirected to ${to}`}</div>,
}));

describe('PrivateRoute', () => {
  it('renders children when user is logged in', () => {
    // Mocking isLoggedIn as true
    useAuth.mockReturnValue({ isLoggedIn: true });

    render(
      <HashRouter>
        <AuthProvider>
          <PrivateRoute>
            <div data-testid="private-content">Private Content</div>
          </PrivateRoute>
        </AuthProvider>
      </HashRouter>
    );

    expect(screen.getByTestId('private-content')).toBeInTheDocument();
  });

  it('redirects to /prijava when user is not logged in', () => {
    // Mocking isLoggedIn as false
    useAuth.mockReturnValue({ isLoggedIn: false });

    render(
      <HashRouter>
        <AuthProvider>
          <PrivateRoute>
            <div data-testid="private-content">Private Content</div>
          </PrivateRoute>
        </AuthProvider>
      </HashRouter>
    );

    expect(screen.getByText('Redirected to /prijava')).toBeInTheDocument();
  });
});

describe('PublicRoute', () => {
  it('renders children when user is not logged in', () => {
    // Mocking isLoggedIn as false
    useAuth.mockReturnValue({ isLoggedIn: false });

    render(
      <HashRouter>
        <AuthProvider>
          <PublicRoute>
            <div data-testid="public-content">Public Content</div>
          </PublicRoute>
        </AuthProvider>
      </HashRouter>
    );

    expect(screen.getByTestId('public-content')).toBeInTheDocument();
  });

  it('redirects to /profil when user is logged in', () => {
    // Mocking isLoggedIn as true
    useAuth.mockReturnValue({ isLoggedIn: true });

    render(
      <HashRouter>
        <AuthProvider>
          <PublicRoute>
            <div data-testid="public-content">Public Content</div>
          </PublicRoute>
        </AuthProvider>
      </HashRouter>
    );

    expect(screen.getByText('Redirected to /profil')).toBeInTheDocument();
  });
});

describe('App', () => {
  it('renders Home component on default route', async () => {
    useAuth.mockReturnValue({ isLoggedIn: true }); // Mock logged in state

    render(
        <AuthProvider>
          <App />
        </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Home')).toBeInTheDocument();
    });

  });
});

