import React from 'react';
import { render, screen } from '@testing-library/react';
import StarRating from './StarRating';

describe('StarRating', () => {
  it('should render StarRating component with correct rating', () => {
    render(<StarRating rating={3.5} />);

    // Find the rating element based on the "aria-label" attribute of the span role
    const ratingElement = screen.getByLabelText('3.5 Stars');

    expect(ratingElement).toBeInTheDocument();
  });

  it('should render StarRating component with zero rating if rating is not provided', () => {
    render(<StarRating />);

    // Find the rating element based on the "aria-label" attribute of the span role
    const ratingElement = screen.getByLabelText('0.1 Stars');

    expect(ratingElement).toBeInTheDocument();
  });

  it('should render StarRating component with correct precision', () => {
    render(<StarRating rating={2.7} />);

    // Find the rating element based on the "aria-label" attribute of the span role
    const ratingElement = screen.getByLabelText('2.7 Stars');

    expect(ratingElement).toBeInTheDocument();
  });
});
