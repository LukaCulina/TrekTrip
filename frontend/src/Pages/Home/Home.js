import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axios/axiosInstance';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import SearchBar from "../../Components/SearchBar/SearchBar";
import FeaturedTrips from "../../Components/FeaturedTrips/FeaturedTrips";
import { Spinner } from '../../Components/Spinner/Spinner';
import './Home.css';

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
        navigate(`/putovanja/${tripId}`);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [allTripsResponse, top3Response] = await Promise.all([
                    axiosInstance.get('/trip/all'),
                    axiosInstance.get('/trip/top3')
                ]);
                setTrips(allTripsResponse.data);
                setTopTrips(top3Response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching trips:', error);
                setError(error.message);
                setLoading(false);
            }
        };
    
        fetchData();
    }, []);

    if (loading) {
        return <Spinner />;
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
                <SearchBar value={value} onChange={onChange} onSearch={onSearch} trips={trips} />
            </header>

            <section><h2>{t('home.tripsTitle')}</h2>
                <FeaturedTrips trips={topTrips} />
            </section>
        </div>
    );
};

export default Home;
