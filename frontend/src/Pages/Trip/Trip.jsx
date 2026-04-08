import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../axios/axiosInstance';
import tripService from '../../Services/tripService/tripService';
import { useTranslation } from 'react-i18next';
import TripComments from "../../Components/TripComments/TripComments";
import TripSummary from "../../Components/TripSummary/TripSummary";
import TripDays from "../../Components/TripDays/TripDays";
import { Spinner } from '../../Components/Spinner/Spinner';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import './Trip.css';

const Trip = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const [trip, setTrip] = useState(null);
    const [userRating, setUserRating] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasRated, setHasRated] = useState(false); // State to track if user has already rated
    const [activeUserId, setActiveUserId] = useState(null); // State to store current active user's ID
    const [days, setDays] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const fetchTripData = async () => {
            try {
                console.log('Fetching trip data for ID:', id);
                const response = await tripService.getTripById(id);
                console.log('Received trip data:', response.data);
                setTrip(response.data);

                const username = localStorage.getItem('username');

                if (username) {
                    setIsLoggedIn(true);
                    const usersResponse = await axiosInstance.get(`/user/all`);
                    const users = usersResponse.data;

                    if (!Array.isArray(users)) {
                        console.error('Expected users to be an array, got:', users);
                        return;
                    }

                    const activeUser = users.find(user => user.username === username);
                    if (activeUser) {
                        setActiveUserId(activeUser.id);
                        console.log(activeUser.id)
                        // Check if the user has already rated this trip
                        console.log(activeUser.id)
                        const existingRating = response.data.ratings?.find(rating => rating.user.id === activeUser.id);
                        if (existingRating) {
                            setUserRating(existingRating.rating);
                            setHasRated(true); // User has already rated
                        }
                    }
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching trip:', error);
                setError('Error fetching trip data.');
                setLoading(false);
            }
        };

        fetchTripData();

        const fetchDaysData = async () => {
            try {
                const daysResponse = await axiosInstance.get(`/day/all`);
                console.log('Received all days data:', daysResponse.data);
                console.log(id)
                console.log(daysResponse.data[0].trip.id)
                console.log('Current trip ID type:', typeof id, id);
                console.log('Day trip ID type:', typeof daysResponse.data[0].trip.id, daysResponse.data[0].trip.id);

                const filteredDays = daysResponse.data.filter(day => day.trip.id === Number(id));
                setDays(filteredDays)
                console.log('Filtered days data:', filteredDays);
            } catch (error) {
                console.error('Error fetching days:', error);
            }
        };
        fetchDaysData();

    }, [id]);

    const handleRatingChange = async (event, newValue) => {
        setUserRating(newValue);
        try {
            await axiosInstance.post(`/rating`, { tripId: id, rating: newValue, userId: activeUserId });
            console.log('Rating added/updated successfully');
            // Refetch trip data to get updated ratings
            const response = await tripService.getTripById(id);
            setTrip(response.data);
            setHasRated(true);
        } catch (error) {
            console.error('Error adding/updating rating:', error);
        }
    };

    const calculateAverageRating = (ratings = []) => {
        if (!ratings.length) return 0;
        const total = ratings.reduce((sum, rating) => sum + rating.rating, 0);
        console.log(total / ratings.length)
        return total / ratings.length;
    };

    if (loading) {
        return <Spinner />;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!trip) {
        return <div>Trip data not found</div>;
    }

    const averageRating = calculateAverageRating(trip.ratings);

    const handleCommentSubmit = async () => {
        try {
            await axiosInstance.post('/comment', {
                content: newComment,
                tripId: id,
                userId: activeUserId,
            });
            // Refresh comments after adding new comment
            const response = await tripService.getTripById(id);
            setTrip(response.data);
            setHasRated(true);
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    };
    console.log('Filtered days:', days);
    return (
        <div className="trip-page">
            <h1>{trip.title}</h1>
            <div className='trip-intro'>
                <p><b>{t('trip.author')}:</b> {trip?.user?.username}</p>
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
                </div>
            </div>
            <div className="main-image"
                style={{ backgroundImage: `url(${trip && trip.images && trip.images.length > 0 ? trip.images[0].url : ''})` }}>
            </div>

            <div className="trip">
                <div className='trip-body'>
                    <div className='trip-description'>
                        <h2 className="intro-text">{trip.description}</h2>
                        <TripDays days={days} />
                    </div>
                    <div className="trip-details">
                        <TripSummary trip={trip} />
                    </div>
                </div>
            </div>
            <div className='comments'>
                <TripComments
                    trip={trip}
                    newComment={newComment}
                    setNewComment={setNewComment}
                    handleCommentSubmit={handleCommentSubmit}
                    isLoggedIn={isLoggedIn}
                />
            </div>
        </div>
    );
}

export default Trip;
