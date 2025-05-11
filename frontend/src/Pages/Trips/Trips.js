import React, { useState, useEffect } from 'react';
import TripCard from '../../Components/TripCard/TripCard';
import { Link } from 'react-router-dom';
import tripService from '../../Services/tripService/tripService';
import countryService from '../../Services/countryService/countryService';
import { MenuItem, Select, FormControl, InputLabel, Button } from '@mui/material';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
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
        const fetchTrips = async () => {
            try {
                const response = await tripService.getAllTrips();
                setTrips(response.data);
                setOriginalTrips(response.data);
                setLoading(false);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching trips:', error);
                setError('Failed to fetch trips. Please try again later.');
                setLoading(false);
            }
        };

        fetchTrips();

        const fetchCountries = async () => {
            try {
                const response = await countryService.getAllCountries();
                const sortedCountries = response.data.sort((a, b) => a.name.localeCompare(b.name));
                setCountries(sortedCountries);
            } catch (error) {
                console.error('Error fetching countries:', error);
                setError('Failed to fetch countries. Please try again later.');
            }
        };

        fetchCountries();
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
        return <div>Loading...</div>;
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
                <FormControl variant="outlined" className="dropdown">
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
                <FormControl variant="outlined" className="dropdown">
                    <InputLabel>{t('filters.country')}</InputLabel>
                    <Select
                        value={selectedCountry}
                        onChange={handleCountryChange}
                        label="Country"
                        placeholder={t('filters.countryPlaceholder')}
                    >
                        <MenuItem value="Sve">Sve</MenuItem>
                        {countries.map((country) => (
                            <MenuItem key={country.id} value={country.name}>{country.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl variant="outlined" className="dropdown">
                    <InputLabel>{t('filters.month')}</InputLabel>
                    <Select
                        value={selectedMonth}
                        onChange={handleMonthChange}
                        label="Month"
                    >
                        <MenuItem value="Svi">{t('filters.all')}</MenuItem>
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
