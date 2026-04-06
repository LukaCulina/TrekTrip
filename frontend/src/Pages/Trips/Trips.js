import { useState, useEffect } from 'react';
import TripCard from '../../Components/TripCard/TripCard';
import { Link } from 'react-router-dom';
import tripService from '../../Services/tripService/tripService';
import { MenuItem, Select, FormControl, InputLabel, Button } from '@mui/material';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { Spinner } from '../../Components/Spinner/Spinner';
import './Trips.css';

const Trips = () => {
    const {t} = useTranslation();
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

    return (
        <div className="trips">
            <Helmet>
                <title>{t('sitenames.trips')}</title>
            </Helmet>
            <div className="filters">
                <FormControl variant="outlined" className="dropdown" size="small">
                    <InputLabel>{t('filters.sort')}</InputLabel>
                    <Select
                        value={sortCriteria}
                        onChange={handleSortChange}
                        label="Sort"
                    >
                        <MenuItem value="highestRated">{t('filters.highestRated')}</MenuItem>
                        <MenuItem value="longest">{t('filters.longest')}</MenuItem>
                        <MenuItem value="shortest">{t('filters.shortest')}</MenuItem>
                        <MenuItem value="mostExpensive">{t('filters.mostExpensive')}</MenuItem>
                        <MenuItem value="leastExpensive">{t('filters.leastExpensive')}</MenuItem>
                    </Select>
                </FormControl>
                <FormControl variant="outlined" className="dropdown" size="small">
                    <InputLabel>{t('filters.country')}</InputLabel>
                    <Select
                        value={selectedCountry}
                        onChange={handleCountryChange}
                        label="Country"
                        placeholder={t('filters.countryPlaceholder')}
                    >
                        {countries.map((country) => (
                            <MenuItem key={country.id} value={country.name}>{country.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl variant="outlined" className="dropdown" size="small">
                    <InputLabel>{t('filters.month')}</InputLabel>
                    <Select
                        value={selectedMonth}
                        onChange={handleMonthChange}
                        label="Month"
                    >
                        {months.map((month, index) => (
                            <MenuItem key={index} value={month}>{month}</MenuItem>
                        ))}
                    </Select>
            </FormControl>
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
