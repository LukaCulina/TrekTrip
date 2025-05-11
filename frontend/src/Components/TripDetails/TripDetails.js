import React from 'react';
import { useTranslation } from 'react-i18next';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import TripSummary from "../TripSummary/TripSummary";


const TripDetails = ({ trip, averageRating, handleRatingChange, activeUserId, hasRated }) => {
    const { t } = useTranslation();

    return (
        <div className="trip-details">
            <Stack spacing={1}>
                <Rating
                    className="rating"
                    name="half-rating"
                    value={averageRating}
                    precision={0.1}
                    size='large'
                    onChange={handleRatingChange}
                    readOnly={!activeUserId || hasRated || activeUserId === trip.user.id}
                />
                <p>Average rating :  {averageRating.toFixed(1)}</p>
            </Stack>
            <TripSummary trip={trip} />
        </div>
    );
};

export default TripDetails;
