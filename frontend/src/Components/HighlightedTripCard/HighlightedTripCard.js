import React from 'react';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import './HighlightedTripCard.css';

const HighlightedTripCard = ({ trip }) => {

  const calculateAverageRating = (ratings) => {
    if (!ratings.length) return 0;
    const total = ratings.reduce((sum, rating) => sum + rating.rating, 0);
    return total / ratings.length;
  };

  const averageRating = calculateAverageRating(trip.ratings);

  return (
    <div className="featured-trip-card">
      <img src={trip && trip.images && trip.images.length > 0 ? process.env.PUBLIC_URL + trip.images[0].url : ''} alt={trip.title} className="trip-image" />
      <div className="trip-info">
        <h3>{trip.title}</h3>
        <p>{trip.destination}</p>

        <p>{trip.description}</p>
          <Stack spacing={1}>
              <Rating className="rating" name="half-rating-read" value={averageRating} precision={0.1} readOnly />
          </Stack>
      </div>
    </div>
  );
};

export default HighlightedTripCard;
