import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios'; // Mock axios for testing
import Login from './Login';
import { AuthProvider } from '../../context/AuthContext'; // Mock AuthContext if needed

// Mock axios methods
jest.mock('axios');

// Mock useNavigate hook
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Login Component', () => {
  beforeEach(() => {
    localStorage.clear(); // Clear localStorage before each test
    axios.post.mockClear(); // Clear mock axios post method
    mockNavigate.mockClear(); // Clear mock navigate function
    jest.spyOn(console, 'error').mockImplementation(() => {}); // Mock console.error
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Restore all mocks after each test
  });

  it('renders login form correctly', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </MemoryRouter>
    );

    const usernameLabel = screen.getByText(/login.username/i);
    const passwordLabel = screen.getByText(/login.password/i);

    expect(screen.getByText('TrekTrip')).toBeInTheDocument(); // Check if logo text is rendered
    expect(usernameLabel).toBeInTheDocument();
    expect(passwordLabel).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login.submit/i })).toBeInTheDocument(); // Check if submit button is rendered
    expect(screen.getByText(/login.noAccount/i)).toBeInTheDocument(); // Check if link to registration is rendered
  });

  it('handles form submission successfully', async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </MemoryRouter>
    );

    const usernameLabel = screen.getByText(/login.username/i);
    const usernameInput = usernameLabel.closest('label').querySelector('input');
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });

    const passwordLabel = screen.getByText(/login.password/i);
    const passwordInput = passwordLabel.closest('label').querySelector('input');
    fireEvent.change(passwordInput, { target: { value: 'testpassword' } });

    // Mock successful login response
    axios.post.mockResolvedValue({
      data: {
        accessToken: 'mockAccessToken',
        token: 'mockAuthToken',
      },
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /login.submit/i }));

    // Wait for login process to complete
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1); // Check if axios post method is called once
      expect(localStorage.getItem('authToken')).toEqual('mockAuthToken'); // Check if authToken is stored in localStorage
      expect(localStorage.getItem('accessToken')).toEqual('mockAccessToken'); // Check if accessToken is stored in localStorage
      expect(mockNavigate).toHaveBeenCalledTimes(1); // Check if navigate function is called
      expect(mockNavigate).toHaveBeenCalledWith('/'); // Check if navigation to homepage is triggered
    });
  });

  it('handles form submission with login failure', async () => {
    axios.post.mockRejectedValue({ response: { data: 'Login failed' } });

    render(
      <MemoryRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </MemoryRouter>
    );

    // Fill out form
    const usernameLabel = screen.getByText(/login.username/i);
    const usernameInput = usernameLabel.closest('label').querySelector('input');
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });

    const passwordLabel = screen.getByText(/login.password/i);
    const passwordInput = passwordLabel.closest('label').querySelector('input');
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /login.submit/i }));

    // Wait for login process to complete
    await waitFor(() => {
      expect(screen.getByText('Molimo provjerite podatke')).toBeInTheDocument(); // Check if error message is displayed
      expect(axios.post).toHaveBeenCalledTimes(1); // Check if axios post method is called once
      expect(localStorage.getItem('authToken')).toBeNull(); // Check if authToken is not stored in localStorage
      expect(localStorage.getItem('accessToken')).toBeNull(); // Check if accessToken is not stored in localStorage
      expect(mockNavigate).not.toHaveBeenCalled(); // Ensure navigation is not triggered
    });
  });

  it('handles no response received error', async () => {
    axios.post.mockRejectedValue({ request: {} });

    render(
      <MemoryRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </MemoryRouter>
    );

    // Fill out form
    const usernameLabel = screen.getByText(/login.username/i);
    const usernameInput = usernameLabel.closest('label').querySelector('input');
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });

    const passwordLabel = screen.getByText(/login.password/i);
    const passwordInput = passwordLabel.closest('label').querySelector('input');
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /login.submit/i }));

    // Wait for login process to complete
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('No response received:', expect.any(Object));
      expect(axios.post).toHaveBeenCalledTimes(1); // Check if axios post method is called once
      expect(localStorage.getItem('authToken')).toBeNull(); // Check if authToken is not stored in localStorage
      expect(localStorage.getItem('accessToken')).toBeNull(); // Check if accessToken is not stored in localStorage
      expect(mockNavigate).not.toHaveBeenCalled(); // Ensure navigation is not triggered
    });
  });

  it('handles error during login', async () => {
    axios.post.mockRejectedValue(new Error('Network Error'));

    render(
      <MemoryRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </MemoryRouter>
    );

    // Fill out form
    const usernameLabel = screen.getByText(/login.username/i);
    const usernameInput = usernameLabel.closest('label').querySelector('input');
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });

    const passwordLabel = screen.getByText(/login.password/i);
    const passwordInput = passwordLabel.closest('label').querySelector('input');
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /login.submit/i }));

    // Wait for login process to complete
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error during login:', 'Network Error');
      expect(axios.post).toHaveBeenCalledTimes(1); // Check if axios post method is called once
      expect(localStorage.getItem('authToken')).toBeNull(); // Check if authToken is not stored in localStorage
      expect(localStorage.getItem('accessToken')).toBeNull(); // Check if accessToken is not stored in localStorage
      expect(mockNavigate).not.toHaveBeenCalled(); // Ensure navigation is not triggered
    });
  });

});
