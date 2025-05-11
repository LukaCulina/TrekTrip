import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axiosInstance from '../../axios/axiosInstance';
import UpdateProfile from './UpdateProfile';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('../../axios/axiosInstance');

describe('UpdateProfile Component', () => {
  const mockUserData = {
    username: 'testUser',
    description: 'This is a test description',
    image: null, // Mocked image data if needed
  };

  beforeEach(() => {
    axiosInstance.get.mockResolvedValue({ data: mockUserData });
    axiosInstance.post.mockResolvedValue({ data: { id: 'mockImageId' } });
    axiosInstance.put.mockResolvedValue({
      data: { ...mockUserData, username: 'updatedUser', description: 'Updated description', imageId: 'mockImageId' }
    });

    jest.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValue('123'); // Replace '123' with your mock userId
    jest.spyOn(window.localStorage.__proto__, 'setItem'); // Spy on setItem
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Restore mocked functions after each test
  });

  it('renders form with fetched user data', async () => {
    render(
      <MemoryRouter>
        <UpdateProfile />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/Username/i)).toHaveValue(mockUserData.username);
      expect(screen.getByLabelText(/Description/i)).toHaveValue(mockUserData.description);
    });
  });

  it('updates form state on input change', async () => {
    render(
      <MemoryRouter>
        <UpdateProfile />
      </MemoryRouter>
    );

    const newDescription = 'Updated description';
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: newDescription } });

    expect(screen.getByLabelText(/Description/i)).toHaveValue(newDescription);
  });


  it('sets default values if username or description is missing', async () => {
    const mockIncompleteUserData = {
      username: '',
      description: '',
    };
    axiosInstance.get.mockResolvedValueOnce({ data: mockIncompleteUserData });

    render(
      <MemoryRouter>
        <UpdateProfile />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/Username/i)).toHaveValue('');
      expect(screen.getByLabelText(/Description/i)).toHaveValue('');
    });
  });

  it('handles image change', async () => {
    render(
      <MemoryRouter>
        <UpdateProfile />
      </MemoryRouter>
    );

    const file = new File(['dummy-image'], 'test.jpg', { type: 'image/jpeg' });

    const input = screen.getByLabelText(/Profile-Photo/i); // Adjust the accessible name as per your actual implementation
    fireEvent.change(input, { target: { files: [file] } });

    expect(input.files[0]).toEqual(file);
  });

  it('handles errors while fetching user data', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    axiosInstance.get.mockRejectedValueOnce(new Error('Error fetching user data'));

    render(
      <MemoryRouter>
        <UpdateProfile />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching user data:', expect.any(Error));
    });

    consoleErrorSpy.mockRestore();
  });

  it('submits form without image', async () => {
    render(
      <MemoryRouter>
        <UpdateProfile />
      </MemoryRouter>
    );

    const newUsername = 'updatedUser';
    const newDescription = 'Updated description';

    // Simulate user input for username and description
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: newUsername } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: newDescription } });

    // Trigger form submission without selecting an image
    fireEvent.submit(screen.getByRole('button', { name: /Edit/i }));

    // Await axiosInstance.put to be called and verify expectations
    await waitFor(() => {
      expect(axiosInstance.put).toHaveBeenCalledWith(`/user/123`, {
        username: newUsername,
        description: newDescription,
      });

      // Check that localStorage.setItem was called with the correct username
      expect(localStorage.setItem).toHaveBeenCalledWith('username', newUsername);
    });
  });

  it('handles errors while fetching user data', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    axiosInstance.get.mockRejectedValueOnce(new Error('Error fetching user data'));

    render(
      <MemoryRouter>
        <UpdateProfile />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching user data:', expect.any(Error));
    });

    consoleErrorSpy.mockRestore();
  });

  it('submits form with updated data', async () => {
    render(
      <MemoryRouter>
        <UpdateProfile />
      </MemoryRouter>
    );

    const newUsername = 'updatedUser';
    const newDescription = 'Updated description';

    // Simulate user input for username and description
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: newUsername } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: newDescription } });

    // Simulate image file selection
    const file = new File(['dummy-image'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText(/Profile-Photo/i); // Adjust the accessible name as per your actual implementation
    fireEvent.change(input, { target: { files: [file] } });

    // Wait for image file change to be processed
    await waitFor(() => {
      expect(input.files[0]).toEqual(file);
    });

    // Trigger form submission
    fireEvent.submit(screen.getByRole('button', { name: /Edit/i }));

    // Await axiosInstance.put to be called and verify expectations
    await waitFor(() => {
      expect(axiosInstance.put).toHaveBeenCalledWith(`/user/123`, {
        username: newUsername,
        description: newDescription,
        imageId: 'mockImageId',
      });

      // Check that localStorage.setItem was called with the correct username
      expect(localStorage.setItem).toHaveBeenCalledWith('username', newUsername);
    });
  });

  it('does not update localStorage if username is not provided', async () => {
    render(
      <MemoryRouter>
        <UpdateProfile />
      </MemoryRouter>
    );

    const newDescription = 'Updated description';

    // Simulate user input for description only
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: newDescription } });

    // Trigger form submission
    fireEvent.submit(screen.getByRole('button', { name: /Edit/i }));

    // Await axiosInstance.put to be called and verify expectations
    await waitFor(() => {
      expect(axiosInstance.put).toHaveBeenCalledWith(`/user/123`, {
        username: '',
        description: newDescription,
      });

      // Check that localStorage.setItem was not called
      expect(localStorage.setItem).not.toHaveBeenCalledWith('username', '');
    });
  });


  it('navigates to /profil after successful form submission', async () => {
    const navigateMock = jest.fn();
    require('react-router-dom').useNavigate.mockImplementation(() => navigateMock);

    render(
      <MemoryRouter>
        <UpdateProfile />
      </MemoryRouter>
    );

    const newUsername = 'updatedUser';
    const newDescription = 'Updated description';

    // Simulate user input for username and description
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: newUsername } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: newDescription } });

    // Trigger form submission
    fireEvent.submit(screen.getByRole('button', { name: /Edit/i }));

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/profil');
    });
  });

  it('handles errors while submitting the form', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    axiosInstance.put.mockRejectedValueOnce(new Error('Error updating user'));

    render(
      <MemoryRouter>
        <UpdateProfile />
      </MemoryRouter>
    );

    const newUsername = 'updatedUser';
    const newDescription = 'Updated description';

    // Simulate user input for username and description
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: newUsername } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: newDescription } });

    // Trigger form submission
    fireEvent.submit(screen.getByRole('button', { name: /Edit/i }));

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error updating user:', expect.any(Error));
    });

    consoleErrorSpy.mockRestore();
  });
});
