import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axiosInstance from '../../axios/axiosInstance'; // Import your axios mock or instance
import Home from './Home';

jest.mock('../../axios/axiosInstance'); // Mock axios instance

describe('Home Component', () => {
  const mockTrips = [
    {
      id: 1,
      title: 'Trip 1',
      ratings: [{ rating: 4 }, { rating: 5 }],
    },
    {
      id: 2,
      title: 'Trip 2',
      ratings: [{ rating: 3 }, { rating: 4 }],
    },
    {
      id: 3,
      title: 'Trip 3',
      ratings: [{ rating: 5 }, { rating: 5 }],
    },
  ];

  beforeEach(() => {
    axiosInstance.get.mockResolvedValue({ data: mockTrips });
  });

  it('renders loading state initially', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it('displays error message when trip fetch fails', async () => {
    const errorMessage = 'Failed to fetch trips';
    axiosInstance.get.mockRejectedValue(new Error(errorMessage));

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
    });
  });

  it('renders trip cards after successful data fetch', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    await waitFor(() => {
      mockTrips.forEach(trip => {
        expect(screen.getByText(trip.title)).toBeInTheDocument();
      });
    });
  });

  it('renders top trips correctly', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    await waitFor(() => {
      const topTripTitles = mockTrips.slice(0, 3).map(trip => trip.title);
      topTripTitles.forEach(title => {
        expect(screen.getByText(title)).toBeInTheDocument();
      });
    });
  });
});
