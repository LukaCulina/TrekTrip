import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../axios/axiosInstance';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import { Button } from "@mui/material";
import HighlightedTripCard from '../../Components/HighlightedTripCard/HighlightedTripCard';
import './Profile.css';

const Profile = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [, setId] = useState(null);
  const [, setActiveUser] = useState(null);
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [topTrips, setTopTrips] = useState([]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/prijava'); // Redirect if not logged in
    } else {
      const fetchData = async () => {
        try {
          const username = localStorage.getItem('username');
          const response = await axiosInstance.get(`/user/all`);
          const users = response.data;
          const activeUser = users && Array.isArray(users) ? users.find(user => user.username === username) : null;

          if (activeUser) {
            setActiveUser(activeUser);
            setId(activeUser.id); 
            localStorage.setItem('userId', activeUser.id);

            const userResponse = await axiosInstance.get(`/user/${activeUser.id}`); 
            setUser(userResponse.data);

            const tripsResponse = await axiosInstance.get(`/trip/all`);
            const userTrips = tripsResponse.data.filter(trip => trip.user.username === activeUser.username);

            const userTripsWithAverage = userTrips.map(trip => {
              const averageRating = calculateAverageRating(trip.ratings);
              return { ...trip, averageRating };
            });

            const sortedTrips = userTripsWithAverage.sort((a, b) => b.averageRating - a.averageRating).slice(0, 3);
            setTopTrips(sortedTrips);
          } else {
            console.error('Logged-in user not found');
          }
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      };
    }
  }, [isLoggedIn, navigate]);

  const calculateAverageRating = (ratings) => {
    if (!ratings.length) return 0;
    const total = ratings.reduce((sum, rating) => sum + rating.rating, 0);
    return total / ratings.length;
  };

  return (
    <div>
      <Helmet>
        <title>{t('sitenames.profile')}</title>
      </Helmet>
      {user ? (
        <div className="profile-page">
          <div className="profile-info">
            <div className="profile-details">
              <h1>{user.username}</h1>
              <div className='profile-photo'>
                <img
                  src={user.image && user.image.url ? process.env.PUBLIC_URL + `${user.image.url}` : 'https://static.vecteezy.com/system/resources/previews/036/280/651/non_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg'}
                  alt="Profile"
                  className="profile-pic"
                />
              </div>
              <div className="profile-buttons">
                <Link to='/uredi-profil'>
                  <Button>{t('profile.editProfile')}</Button>
                </Link>
                <Link to='/dodaj-put'>
                  <Button>{t('profile.addTrip')}</Button>
                </Link>
              </div>
            </div>
            <div className="about-me">
              <h2>{t('profile.about')}</h2>
              <p>{user.description}</p>
            </div>
          </div>
          <div className="my-trips">
            <h2>{t('profile.trips')}</h2>
            <div className="trip-cards">
              {topTrips.map((trip) => (
                <Link key={trip.id} to={`/putovanja/${trip.id}`}>
                  <HighlightedTripCard trip={trip} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p>No user data available</p>
      )}
    </div>
  );
};

export default Profile;
