import { useState, useEffect } from 'react';
import TripCard from '../../Components/TripCard/TripCard';
import { Link } from 'react-router-dom';
import tripService from '../../Services/tripService/tripService';
import { MenuItem, Select, FormControl, InputLabel, Button } from '@mui/material';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { Spinner } from '../../Components/Spinner/Spinner';
import Filter from '../../Components/Filter/Filter';
import './Trips.css';

const Trips = () => {
    const { t } = useTranslation();
    const [trips, setTrips] = useState([]);
    const [originalTrips, setOriginalTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortCriteria, setSortCriteria] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('');
    const [countries, setCountries] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('');
    const months = t('months', { returnObjects: true });
    const [filtersApplied, setFiltersApplied] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await tripService.getAllTrips();
                setTrips(response.data);
                setOriginalTrips(response.data);

                const uniqueCountries = [...new Set(
                    response.data
                        .filter(trip => trip.locations[0]?.country?.name)
                        .map(trip => trip.locations[0].country.name)
                )].sort();
                setCountries(uniqueCountries.map(name => ({ name })));

                setLoading(false);
            } catch (error) {
                console.error('Error fetching trips:', error);
                setError('Failed to fetch trips. Please try again later.');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const sortTrips = (trips, criteria) => {
        const sortedTrips = [...trips];
        switch (criteria) {
            case 'highestRated':
                return sortedTrips.sort((a, b) => calculateAverageRating(b.ratings) - calculateAverageRating(a.ratings));
            case 'longest':
                return sortedTrips.sort((a, b) => b.lengthInDays - a.lengthInDays);
            case 'shortest':
                return sortedTrips.sort((a, b) => a.lengthInDays - b.lengthInDays);
            case 'mostExpensive':
                return sortedTrips.sort((a, b) => b.price - a.price);
            case 'leastExpensive':
                return sortedTrips.sort((a, b) => a.price - b.price);
            default:
                return sortedTrips;
        }
    };

    const calculateAverageRating = (ratings) => {
        if (!ratings.length) return 0;
        const total = ratings.reduce((sum, rating) => sum + rating.rating, 0);
        return total / ratings.length;
    };

    const handleSortChange = (event) => {
        const criteria = event.target.value;
        setSortCriteria(criteria);
        setFiltersApplied(true);
    };

    const handleCountryChange = (event) => {
        const country = event.target.value;
        setSelectedCountry(country);
        setFiltersApplied(true);
    };

    const handleMonthChange = (event) => {
        const month = event.target.value;
        setSelectedMonth(month);
        setFiltersApplied(true);
    };

    const handleClearFilters = () => {
        setTrips(originalTrips);
        setSortCriteria('');
        setSelectedCountry('');
        setSelectedMonth('');
        setFiltersApplied(false);
    };

    if (loading) {
        return <Spinner />;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    let displayedTrips = filtersApplied
        ? sortTrips(
            trips.filter(trip =>
                (!selectedCountry || trip.locations[0].country.name === selectedCountry) &&
                (!selectedMonth || trip.tripMonth === selectedMonth)
            ),
            sortCriteria
        )
        : trips;

    const sortOptions = [
        { value: 'highestRated', label: t('filters.highestRated') },
        { value: 'longest', label: t('filters.longest') },
        { value: 'shortest', label: t('filters.shortest') },
        { value: 'mostExpensive', label: t('filters.mostExpensive') },
        { value: 'leastExpensive', label: t('filters.leastExpensive') },
    ];

    const countryOptions = countries.map(c => ({
        value: c.name,
        label: c.name
    }));

    const monthOptions = months.map(month => ({
        value: month,
        label: month
    }));

    return (
        <div className="trips">
            <Helmet>
                <title>{t('sitenames.trips')}</title>
            </Helmet>
            <div className="filters">
                <Filter
                    label={t('filters.sort')}
                    value={sortCriteria}
                    onChange={handleSortChange}
                    options={sortOptions}
                />
                <Filter
                    label={t('filters.country')}
                    value={selectedCountry}
                    onChange={handleCountryChange}
                    options={countryOptions}
                />
                <Filter
                    label={t('filters.month')}
                    value={selectedMonth}
                    onChange={handleMonthChange}
                    options={monthOptions}
                />
                <Button variant="contained" color="secondary" onClick={handleClearFilters}>
                    {t('filters.clearFilters')}
                </Button>
            </div>
            <div className="destinations">
                {displayedTrips.map((trip) => (
                    <Link key={trip.id} to={`/putovanja/${trip.id}`}>
                        <TripCard trip={trip} />
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Trips;
