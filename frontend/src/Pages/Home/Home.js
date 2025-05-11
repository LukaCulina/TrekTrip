import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axios/axiosInstance';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import './Home.css';
import SearchInput from "../../Components/SearchInput/SearchInput";
import FeaturedTrips from "../../Components/FeaturedTrips/FeaturedTrips";

const Home = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [topTrips, setTopTrips] = useState([]);
    const [value, setValue] = useState('');

    const onChange = (event) => {
        setValue(event.target.value);
    };

    const onSearch = (title, tripId) => {
        setValue(title); // Set value if needed
        navigate(`/putovanja/${tripId}`);
    };

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const response = await axiosInstance.get(`/trip/all`);
                setTrips(response.data);
                setLoading(false);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching trips:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchTrips();
    }, []);

    useEffect(() => {
        const calculateAverageRating = (ratings) => {
            if (!ratings.length) return 0;
            const total = ratings.reduce((sum, rating) => sum + rating.rating, 0);
            return total / ratings.length;
        };

        const tripsWithAverageRating = trips.map(trip => {
            const averageRating = calculateAverageRating(trip.ratings);
            return { ...trip, averageRating };
        });

        const sortedTrips = tripsWithAverageRating.sort((a, b) => b.averageRating - a.averageRating);

        const topThreeTrips = sortedTrips.slice(0, 3);

        setTopTrips(topThreeTrips);
    }, [trips]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }


    return (
        <div className="homepage">
            <Helmet>
                <title>{t('sitenames.home')}</title>
            </Helmet>
            <header className="homepage-header">
                <h1>{t('home.title')}</h1>
                <p>{t('home.subtitle')}</p>
                <SearchInput value={value} onChange={onChange} onSearch={onSearch} trips={trips} />
            </header>

            <section><h2>{t('home.tripsTitle')}</h2>
                <FeaturedTrips trips={topTrips} />
            </section>
        </div>
    );
};

export default Home;
