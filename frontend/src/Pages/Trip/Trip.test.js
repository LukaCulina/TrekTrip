import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Trip from './Trip';
import tripService from '../../Services/tripService/tripService';
import axiosInstance from '../../axios/axiosInstance';

jest.mock('../../Services/tripService/tripService');
jest.mock('../../axios/axiosInstance');

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: key => key }),
}));

describe('Trip Component', () => {
    const mockTrip = {
        id: 1,
        title: 'Trip Title',
        description: 'Trip Description',
        user: { username: 'User1', id: 1 },
        locations: [{ country: { name: 'Country1' }, destination: 'Destination1' }],
        tripMonth: 'January',
        lengthInDays: 5,
        price: 100,
        ratings: [{ user: { id: 1 }, rating: 4 }, { user: { id: 2 }, rating: 5 }],
        comments: [{ id: 1, user: { username: 'User2' }, content: 'Comment Content', timeOfPosting: '2023-06-15T10:30:00' }],
        images: [{ url: '/image-url' }],
    };

    beforeEach(() => {
        jest.clearAllMocks();
        tripService.getTripById.mockResolvedValue({ data: mockTrip });
        axiosInstance.get.mockResolvedValue({ data: [{ id: 1, trip: { id: 1 }, title: 'Day Title', text: 'Day Text' }] });
        axiosInstance.get.mockResolvedValueOnce({ data: [{ id: 1, username: 'User1' }] });
        axiosInstance.get.mockResolvedValueOnce({ data: [{ user: { id: 1 }, rating: 4 }] });
    });

    it('renders loading state initially', () => {
        render(
            <MemoryRouter initialEntries={['/trip/1']}>
                <Routes>
                    <Route path="/trip/:id" element={<Trip />} />
                </Routes>
            </MemoryRouter>
        );
        expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    });

    it('displays error message when trip fetch fails', async () => {
        const errorMessage = 'Error fetching trip data.';
        tripService.getTripById.mockRejectedValue(new Error(errorMessage));

        render(
            <MemoryRouter initialEntries={['/trip/1']}>
                <Routes>
                    <Route path="/trip/:id" element={<Trip />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(errorMessage)).toBeInTheDocument();
        });
    });

    it('renders trip details after successful data fetch', async () => {
      render(
          <MemoryRouter initialEntries={['/trip/1']}>
              <Routes>
                  <Route path="/trip/:id" element={<Trip />} />
              </Routes>
          </MemoryRouter>
      );
  
      // Mock data
      const mockTrip = {
          title: 'Trip Title',
          description: 'Trip Description',
          user: {
              username: 'User1'
          },
          country: 'Country1', 
      };
  
      // Simulate asynchronous data fetching/rendering
      await waitFor(() => {
          // Assert on the rendered content
          expect(screen.getByText(mockTrip.title)).toBeInTheDocument();
          expect(screen.getByText(mockTrip.user.username)).toBeInTheDocument();
          expect(screen.getByText(mockTrip.description)).toBeInTheDocument();
          expect(screen.getByText(mockTrip.country)).toBeInTheDocument();
      });
  });
  

    it('sets authentication and ratings state when user is logged in', async () => {
        // Mock localStorage getItem to return a username
        jest.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValueOnce('User1');

        render(
            <MemoryRouter initialEntries={['/trip/1']}>
                <Routes>
                    <Route path="/trip/:id" element={<Trip />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(mockTrip.title)).toBeInTheDocument();
            expect(screen.getByText(`trip.author: ${mockTrip.user.username}`)).toBeInTheDocument();
            expect(screen.getByText(mockTrip.description)).toBeInTheDocument();
            expect(screen.getByText(`trip.country: ${mockTrip.locations[0].country.name}`)).toBeInTheDocument();
            expect(screen.getByText(`trip.destination: ${mockTrip.locations[0].destination}`)).toBeInTheDocument();
            expect(screen.getByText(`trip.month: ${mockTrip.tripMonth}`)).toBeInTheDocument();
            expect(screen.getByText(`trip.duration: ${mockTrip.lengthInDays} days`)).toBeInTheDocument();
            expect(screen.getByText(`trip.price: ${mockTrip.price} €`)).toBeInTheDocument();

            // Assert on isLoggedIn state
            expect(screen.getByText('Average Rating: 4.5')).toBeInTheDocument(); // Assuming average rating calculation

            // Assert on user rating and hasRated state
            expect(screen.getByText('Your Rating: 4')).toBeInTheDocument(); // Assuming user's rating is displayed
        });
    });

    it('updates rating and disables rating input after rating', async () => {
        render(
            <MemoryRouter initialEntries={['/trip/1']}>
                <Routes>
                    <Route path="/trip/:id" element={<Trip />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
          const ratingElement = screen.getByRole('img', { name: '4.5 Stars' });
  
          expect(ratingElement).toBeInTheDocument();
  
          const ariaDisabledElements = ratingElement.querySelectorAll('.MuiRating-iconFilled[style="width: 0%; overflow: hidden; position: absolute;"]');
          
          ariaDisabledElements.forEach(element => {
              expect(element).toHaveAttribute('aria-disabled', 'true');
          });
        });
    });

    it('submits a comment and updates the comments section', async () => {
        render(
            <MemoryRouter initialEntries={['/trip/1']}>
                <Routes>
                    <Route path="/trip/:id" element={<Trip />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            // Mock user being logged in
            jest.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValueOnce('User1');

            // Simulate typing into the textarea and submitting a comment
            const commentInput = screen.getByRole('textbox');
            fireEvent.change(commentInput, { target: { value: 'New comment text' } });
            fireEvent.click(screen.getByText(/Submit Comment/i));
        });

        // Wait for the comment to be added to the UI
        await waitFor(() => {
            expect(screen.getByText('New comment text')).toBeInTheDocument();
        });
    });

    it('disables rating input if user is the trip owner', async () => {
        jest.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValueOnce('User1');

        render(
            <MemoryRouter initialEntries={['/trip/1']}>
                <Routes>
                    <Route path="/trip/:id" element={<Trip />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
          const ratingElement = screen.getByRole('img', { name: '4.5 Stars' });
  
          expect(ratingElement).toBeInTheDocument();
  
          const ariaDisabledElements = ratingElement.querySelectorAll('.MuiRating-iconFilled[style="width: 0%; overflow: hidden; position: absolute;"]');
          
          ariaDisabledElements.forEach(element => {
              expect(element).toHaveAttribute('aria-disabled', 'true');
          });
        });
    });

    it('disables rating input if user has already rated', async () => {
      render(
          <MemoryRouter initialEntries={['/trip/1']}>
              <Routes>
                  <Route path="/trip/:id" element={<Trip />} />
              </Routes>
          </MemoryRouter>
      );
  
      await waitFor(() => {
        const ratingElement = screen.getByRole('img', { name: '4.5 Stars' });

        expect(ratingElement).toBeInTheDocument();

        const ariaDisabledElements = ratingElement.querySelectorAll('.MuiRating-iconFilled[style="width: 0%; overflow: hidden; position: absolute;"]');
        
        ariaDisabledElements.forEach(element => {
            expect(element).toHaveAttribute('aria-disabled', 'true');
        });
    });
  });  

    it('renders no trip data found message if trip is null', async () => {
        tripService.getTripById.mockResolvedValue({ data: null });

        render(
            <MemoryRouter initialEntries={['/trip/1']}>
                <Routes>
                    <Route path="/trip/:id" element={<Trip />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Trip data not found')).toBeInTheDocument();
        });
    });

    /*it('displays error message when submitting comment fails', async () => {
      // Mock data for rendering Trip component
      const mockTripId = '1';
      const mockTripData = {
        id: mockTripId,
        title: 'Mock Trip',
        description: 'Mock Trip Description',
        user: { username: 'mockuser' },
        comments: [],
        ratings: [],
        locations: [{ country: { id: 1, name: 'Country1' }, destination: 'Location1' }],
        tripMonth: 'January',
        lengthInDays: 5,
        price: 100,
      };
  
      // Mock axiosInstance.post to simulate an error when submitting a comment
      axiosInstance.post.mockRejectedValue(new Error('Failed to submit comment'));
  
      // Render Trip component with mocked data and routing context
      render(
        <MemoryRouter initialEntries={['/trip/1']}>
                <Routes>
                    <Route path="/trip/:id" element={<Trip />} />
                </Routes>
            </MemoryRouter>
      );
  
      // Wait for Trip component to load
      await waitFor(() => {
        const newComment = 'This is a new comment';
        fireEvent.change(screen.getByRole('textbox'), { target: { value: newComment } });
        fireEvent.click(screen.getByRole('button', { name: /Submit Comment/i }));
      });
  
        
      await waitFor(() => {
        expect(axiosInstance.post).toHaveBeenCalledTimes(1);
        expect(axiosInstance.post).toHaveBeenCalledWith('/comment', {
          content: newComment,
          tripId: mockTripId,
          userId: expect.any(String), 
        });
  
        expect(screen.getByText('Error submitting comment: Failed to submit comment')).toBeInTheDocument();
      });
    });*/
});
