import React from 'react';
import { render, screen } from '@testing-library/react';
import HighlightedTripCard from './HighlightedTripCard';

describe('HighlightedTripCard', () => {
  const mockTrip = {
    title: 'Sample Trip',
    destination: 'Sample Destination',
    images: [{ url: '/sample-image.jpg' }],
    ratings: [
      { rating: 4.0 }, // Adjust ratings as per your test case
    ],
    description: 'This is a sample trip description.',
  };

  it('should render HighlightedTripCard component with correct content', () => {
    render(<HighlightedTripCard trip={mockTrip} />);

    const titleElement = screen.getByText('Sample Trip');
    const destinationElement = screen.getByText('Sample Destination');
    const ratingElement = screen.getByLabelText(/4 Stars/i); // Use a regex to match the rating label
    const descriptionElement = screen.getByText('This is a sample trip description.');

    expect(titleElement).toBeInTheDocument();
    expect(destinationElement).toBeInTheDocument();
    expect(ratingElement).toBeInTheDocument(); // Check if rating element is present
    expect(descriptionElement).toBeInTheDocument();

    // Optionally, you can add more assertions for other elements like images
    const imageElement = screen.getByAltText('Sample Trip');
    expect(imageElement).toBeInTheDocument();
    expect(imageElement).toHaveAttribute('src', '/sample-image.jpg');
  });

  it('should render HighlightedTripCard component with zero rating if ratings array is empty', () => {
    const emptyRatingTrip = {
      ...mockTrip,
      ratings: [], // Empty ratings array
    };

    render(<HighlightedTripCard trip={emptyRatingTrip} />);

    // Since ratings array is empty, ensure there's no specific rating element present
    const ratingElement = screen.queryByLabelText(/[\d.]+ Stars/i); // Query instead of getBy to handle absence
    expect(ratingElement).toBeInTheDocument();
  });
});
