import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import axiosInstance from '../../axios/axiosInstance';
import tripService from '../../Services/tripService/tripService';
import { useTranslation } from 'react-i18next';
import './Trip.css';
import TripComments from "../../Components/TripComments/TripComments";
import TripDetails from "../../Components/TripDetails/TripDetails";
import TripDays from "../../Components/TripDays/TripDays";

const Trip = () => {
    const {t} = useTranslation();
    const { id } = useParams();
    const [trip, setTrip] = useState(null);
    const [userRating, setUserRating] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasRated, setHasRated] = useState(false); // State to track if user has already rated
    const [activeUserId, setActiveUserId] = useState(null); // State to store current active user's ID
    const [days, setDays] = useState([]);
    const [comments, setComments] = useState([]);
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
                const activeUser = users.find(user => user.username === username);
                if (activeUser) {
                    setActiveUserId(activeUser.id);
                    console.log(activeUser.id)
                    // Check if the user has already rated this trip
                    console.log(activeUserId)
                    const existingRating = response.data.ratings.find(rating => rating.user.id === activeUser.id);
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

                // Filter the days data to include only days with trip ID equal to the current trip ID
                const filteredDays = daysResponse.data.filter(day => day.trip.id == id);
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

    const calculateAverageRating = (ratings) => {
        if (!ratings.length) return 0;
        const total = ratings.reduce((sum, rating) => sum + rating.rating, 0);
        console.log(total / ratings.length)
        return total / ratings.length;
    };

    if (loading) {
        return <div>Loading...</div>;
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
            <div className="main-image"
                 style={{backgroundImage: `url(${trip && trip.images && trip.images.length > 0 ? process.env.PUBLIC_URL + trip.images[0].url : ''})`}}>
                <div className="overlay"></div>
            </div>
            <div className="trip">
                <div className='trip-intro'>
                    <div className='trip-title'>
                        <h1>{trip.title}</h1>
                        <p className="author">{t('trip.author')}: {trip.user.username}</p>
                    </div>
                    <div className='trip-description'>
                        <p className="intro">{trip.description}</p>
                    </div>
                    <TripDays days={days}/>
                </div>
                <TripDetails
                    trip={trip}
                    averageRating={averageRating}
                    handleRatingChange={handleRatingChange}
                    activeUserId={activeUserId}
                    hasRated={hasRated}
                />
            </div>
            <h2 className="commentSectionTitle">{t('trip.comments')}</h2>

            <TripComments
                trip={trip}
                newComment={newComment}
                setNewComment={setNewComment}
                handleCommentSubmit={handleCommentSubmit}
                isLoggedIn={isLoggedIn}

            />
        </div>
    );
}

export default Trip;


//  Trip days

{/*<div className='trip-days'>*/}
{/*    {days.map(day => (*/}
{/*        <div key={day.id} className="trip-day">*/}
{/*        <h3>{day.title}</h3>*/}
{/*        <p>{day.text}</p>*/}
{/*        </div>*/}
{/*    ))}*/}
{/*</div>*/}

//  Trip details

{/*<div className='trip-details'>*/}
{/*    <Stack spacing={1}>*/}
{/*        <Rating*/}
{/*            className="rating"*/}
{/*            name="half-rating"*/}
{/*            value={averageRating}*/}
{/*            precision={0.1}*/}
{/*            size='large'*/}
{/*            onChange={handleRatingChange}*/}
{/*            readOnly={!activeUserId || hasRated  || activeUserId === trip.user.id} // Disable rating if user is not logged in or has already rated*/}
{/*        />*/}
{/*        <p>Average Rating: {averageRating.toFixed(1)}</p>*/}
{/*    </Stack> */}
{/*    <div className="trip-summary">*/}
{/*        <p><strong>{t('trip.country')}:</strong></p><span>{trip.locations.length > 0 ? trip.locations[0].country.name : 'Unknown Country'}</span>*/}
{/*        <p><strong>{t('trip.destination')}:</strong></p><span>{trip.locations.map(location => location.destination).join(', ')}</span>*/}
{/*        <p><strong>{t('trip.month')}:</strong></p><span>{trip.tripMonth}</span>*/}
{/*        <p><strong>{t('trip.duration')}:</strong></p><span>{trip.lengthInDays} {t('trip.days')}</span>*/}
{/*        <p><strong>{t('trip.price')}:</strong></p><span>{trip.price} €</span>*/}
{/*    </div>   */}
{/*</div>             */}


// Trip comments

{/*<div><h2 className="commentSectionTitle">{t('trip.comments')}</h2></div>*/}
{/*<div className="comments-section">*/}
{/*    <ul className="commentsListContainer">*/}
{/*        {trip.comments.map(comment => (*/}
{/*            <div className="singleCommentContainer">*/}
{/*                <p className="commentDisplayUsername">{comment.user.username}</p>*/}
{/*                <p key={comment.id}>{comment.content} {comment.timeOfPosting}</p>*/}
{/*            </div> */}
{/*        ))}*/}
{/*    </ul>*/}
{/*    {isLoggedIn && (*/}
{/*        <div className="commentInputSection">*/}
{/*            <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} />*/}
{/*            <button onClick={handleCommentSubmit}>Submit Comment</button>*/}
{/*        </div>*/}
{/*    )}*/}
{/*</div>*/}