import React from 'react';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import './TripCard.css';

function TripCard({ trip }) {

    const ratings = trip?.ratings || [];

    const calculateAverageRating = (ratings) => {
        if (!ratings.length) return 0;
        const total = ratings.reduce((sum, rating) => sum + rating.rating, 0);
        return total / ratings.length;
      };
    
      const averageRating = calculateAverageRating(ratings);

  return (
        <div className="card">
            <img src={trip && trip.images && trip.images.length > 0 ? process.env.PUBLIC_URL + trip?.images[0].url : ''} alt={trip.title} className="card-image" />
            <div className="card-content">
                <h2 className="card-title">{trip?.title}</h2>
                <Stack spacing={1}>
                    <Rating className="rating" name="half-rating-read" value={averageRating} precision={0.1} readOnly />
                </Stack>
                <p className="card-description">{trip?.description}</p>
            </div>
        </div>
  );
}

export default TripCard;
