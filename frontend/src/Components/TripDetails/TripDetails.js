import { useTranslation } from 'react-i18next';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import TripSummary from "../TripSummary/TripSummary";


const TripDetails = ({ trip, averageRating, handleRatingChange, activeUserId, hasRated }) => {
    const { t } = useTranslation();

    return (
        <div className="trip-details">
            <div className='trip-rating'>
            <Stack spacing={1}>
                <Rating
                    className="rating"
                    name="half-rating"
                    value={averageRating}
                    precision={0.1}
                    size='large'
                    onChange={handleRatingChange}
                    readOnly={!activeUserId || hasRated || activeUserId === trip?.user?.id}
                />
            </Stack>
            <p>{t('trip.rating')}: {averageRating.toFixed(1)}</p>

            </div>
            <TripSummary trip={trip} />
        </div>
    );
};

export default TripDetails;
