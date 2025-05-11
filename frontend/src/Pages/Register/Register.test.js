import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axiosInstance from '../../axios/axiosInstance';
import Register from './Register';

jest.mock('../../axios/axiosInstance');
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Register Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the registration form', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
    expect(screen.getByText(/register.title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/register.email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/register.username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/register.password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/register.repeatPassword/i)).toBeInTheDocument();
  });

  it('updates form state on input change', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/register.email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/register.username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/register.password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/register.repeatPassword/i), { target: { value: 'password123' } });

    expect(screen.getByLabelText(/register.email/i)).toHaveValue('test@example.com');
    expect(screen.getByLabelText(/register.username/i)).toHaveValue('testuser');
    expect(screen.getByLabelText(/register.password/i)).toHaveValue('password123');
    expect(screen.getByLabelText(/register.repeatPassword/i)).toHaveValue('password123');
  });

  it('shows error message if passwords do not match', async () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/register.password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/register.repeatPassword/i), { target: { value: 'differentpassword' } });

    fireEvent.submit(screen.getByRole('button', { name: /register.submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
    });
  });

  it('submits the form with valid data', async () => {
    axiosInstance.post.mockResolvedValue({ data: { message: 'Registration successful' } });

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/register.email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/register.username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/register.password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/register.repeatPassword/i), { target: { value: 'password123' } });

    fireEvent.submit(screen.getByRole('button', { name: /register.submit/i }));

    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith('/user/register', {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/prijava');
    });
  });

  it('handles registration failure', async () => {
    axiosInstance.post.mockRejectedValue(new Error('Registration failed'));

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/register.email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/register.username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/register.password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/register.repeatPassword/i), { target: { value: 'password123' } });

    fireEvent.submit(screen.getByRole('button', { name: /register.submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/Registration failed. Please try again later./i)).toBeInTheDocument();
    });
  });
});
