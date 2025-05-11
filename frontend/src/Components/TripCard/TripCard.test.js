import React from 'react';
import { render, screen } from '@testing-library/react';
import TripCard from './TripCard';

describe('TripCard', () => {
  const mockTrip = {
    title: 'Sample Trip',
    description: 'This is a sample trip description.',
    images: [{ url: '/sample-image.jpg' }],
    ratings: [
      { rating: 3 },
      { rating: 4 },
      { rating: 5 },
    ],
  };

  it('should render TripCard component with correct content', () => {
    render(<TripCard trip={mockTrip} />);

    const titleElement = screen.getByText('Sample Trip');
    const descriptionElement = screen.getByText('This is a sample trip description.');
    const ratingElement = screen.getByRole('img', { name: /4 Stars/i }); // Adjust according to your Rating component

    expect(titleElement).toBeInTheDocument();
    expect(descriptionElement).toBeInTheDocument();
    expect(ratingElement).toBeInTheDocument();

    // Optionally, you can add more assertions for other elements like images
    const imageElement = screen.getByAltText('Sample Trip');
    expect(imageElement).toBeInTheDocument();
    expect(imageElement).toHaveAttribute('src', '/sample-image.jpg');
  });

  it('should render TripCard component with zero rating if ratings array is empty', () => {
    const emptyRatingTrip = {
      ...mockTrip,
      ratings: [], // Empty ratings array
    };

    render(<TripCard trip={emptyRatingTrip} />);

    const ratingElement = screen.getByRole('img', { name: /0 Stars/i }); // Adjust according to your Rating component
    expect(ratingElement).toBeInTheDocument();
  });
});
