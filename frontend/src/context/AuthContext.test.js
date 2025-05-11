import React from 'react';
import { render, screen } from '@testing-library/react';
import { act } from 'react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from './AuthContext';

// Mock localStorage methods
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: key => store[key],
    setItem: (key, value) => { store[key] = value.toString(); },
    removeItem: key => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('AuthProvider', () => {
  const TestComponent = () => {
    const { authToken, isLoggedIn, login, logout } = useAuth();

    return (
      <div>
        <span data-testid="authToken">{authToken}</span>
        <span data-testid="isLoggedIn">{isLoggedIn.toString()}</span>
        <button data-testid="loginButton" onClick={() => login('testToken')}>Login</button>
        <button data-testid="logoutButton" onClick={() => logout()}>Logout</button>
      </div>
    );
  };

  it('renders with initial state', () => {
    act(() => {
        render(
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        );
      });
  
    expect(screen.getByTestId('authToken')).toHaveTextContent('');
    expect(screen.getByTestId('isLoggedIn')).toHaveTextContent('false');
  });

  it('updates context on login', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = screen.getByTestId('loginButton');
    act(() => {
      userEvent.click(loginButton);
    });

    await screen.findByText('true');

    expect(screen.getByTestId('authToken')).toHaveTextContent('testToken');
    expect(screen.getByTestId('isLoggedIn')).toHaveTextContent('true');
    expect(localStorage.getItem('authToken')).toBe('testToken');
  });

  it('updates context on logout', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = screen.getByTestId('loginButton');
    const logoutButton = screen.getByTestId('logoutButton');

    act(() => {
      userEvent.click(loginButton);
    });

    await screen.findByText('true');

    act(() => {
      userEvent.click(logoutButton);
    });

    expect(screen.getByTestId('authToken')).toHaveTextContent('');
    expect(screen.getByTestId('isLoggedIn')).toHaveTextContent('false');
    expect(localStorage.getItem('authToken')).toBe(undefined);
  });
});
