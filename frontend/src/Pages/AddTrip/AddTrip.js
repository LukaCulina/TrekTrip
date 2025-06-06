import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import tripService from '../../Services/tripService/tripService';
import axiosInstance from '../../axios/axiosInstance';
import { useTranslation } from 'react-i18next';
import { MenuItem, Select, FormControl, InputLabel, Button } from '@mui/material';
import countryService from '../../Services/countryService/countryService';
import './AddTrip.css';

const AddTrip = () => {
  const { t } = useTranslation();
  const months = t('months', { returnObjects: true });
  const [selectedCountry, setSelectedCountry] = useState('');
  const [countries, setCountries] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [days, setDays] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    lengthInDays: '',
    price: '',
    tripMonth: '',
    isPublic: false,
    images: [],
  });

  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    
    const fetchCountries = async () => {
        try {
            const response = await countryService.getAllCountries();
            const sortedCountries = response.data.sort((a, b) => a.name.localeCompare(b.name));
            setCountries(sortedCountries);
        } catch (error) {
            console.error('Error fetching countries:', error);
        }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        if (selectedCountry) {
          const countryCode = countries.find(country => country.name === selectedCountry)?.code;
            if (countryCode) {
            const username = 'luka58';
            const apiUrl = `http://api.geonames.org/searchJSON?country=${encodeURIComponent(countryCode)}&username=${username}`;

            const response = await fetch(apiUrl);
            const data = await response.json();

            // Extract locations from the response
            const locations = data.geonames.map(location => ({
              id: location.geonameId,
              name: location.name
            }));
            const sortedLocations = locations.sort((a, b) => a.name.localeCompare(b.name));
            
            console.log(sortedLocations);
            setLocations(sortedLocations);
          }
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchLocations();
  }, [selectedCountry]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : files ? Array.from(files) : value
    }));
  
    if (name === 'lengthInDays') {
      const length = parseInt(value, 10);
      if (!isNaN(length)) {
        const newDays = Array.from({ length }, (_, i) => ({
          dayNumber: i + 1,
          title: '',
          text: ''
        }));
        setDays(newDays);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAdding(true);
    setError('');
  
    try {
      const imageIds = [];

      if (formData.images.length > 0) {
        for (const image of formData.images) {
          const imageFormData = new FormData();
          imageFormData.append('file', image);
  
          const imageRes = await axiosInstance.post('/image', imageFormData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
  
          const imageId = imageRes.data.id;
  
          imageIds.push(imageId);
        }
      }
      
      const locationIds = [];
      if (selectedLocations.length > 0) {
        const countryId = countries.find(country => country.name === selectedCountry)?.id;
        console.log(countryId)
        for (const locationName of selectedLocations) {
          const locationData = {
            destination: locationName,
            country: {id: countryId},
          };
          const response = await axiosInstance.post('/location', locationData);
          locationIds.push(response.data.id);
        }
      }

      const tripData = {
        trip: {
          title: formData.title,
          description: formData.description,
          lengthInDays: formData.lengthInDays,
          price: formData.price,
          tripMonth: formData.tripMonth,
          isPublic: formData.isPublic,
          user: { id: userId }
        },
        imageIds: imageIds,
        locationIds: locationIds,
      };
  
      console.log(tripData.imageIds);
      
      const response = await tripService.createTrip(tripData);
  
      console.log('Trip added successfully:', response.data);

      try {
        // Iterate over each day in the array
        for (const dayData of days) {
            // Make a POST request to create a new day
            await axiosInstance.post('/day', {
                title: dayData.title,
                text: dayData.text,
                tripId: response.data.id
            });
        }
        console.log('All days created successfully');
    
    } catch (error) {
        console.error('Error creating days:', error);
    }  
      navigate('/putovanja');
    } catch (error) {
      console.error('Adding trip failed:', error);
      setError('Failed to add trip. Please try again later.');
    } finally {
      setAdding(false);
    }
  };
  
  const handleCountryChange = (event) => {
    const country = event.target.value;
    setSelectedCountry(country);
    const countryId = countries.find(country => country.name === selectedCountry)?.id;
    console.log(countryId)
  };
  
  const handleLocationChange = (event) => {
    setSelectedLocations(event.target.value);
    console.log(days)
  };

  const handleDayChange = (index, field, value) => {
    setDays(prevDays => {
      const newDays = [...prevDays];
      newDays[index][field] = value;
      return newDays;
    });
  }; 

  const handleClearAll = () => {
    setSelectedCountry('');
    setSelectedLocations([]);
  };

  return (
    <div className="auth-container">
      <Helmet>
        <title>{t('sitenames.addTrip')}</title>
      </Helmet>
      <form className="auth-form" onSubmit={handleSubmit} enctype="multipart/form-data">
        <h1 className="auth-title">{t('addTrip.title')}</h1>
        <label>
          {t('addTrip.name')}
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </label>
        <label>
          {t('addTrip.description')}
          <textarea name="description" value={formData.description} onChange={handleChange} required />
        </label>
        <label>
        {t('addTrip.length')}
        <input type="number" name="lengthInDays" value={formData.lengthInDays} onChange={handleChange} required />
      </label>
      {/* Render day inputs dynamically */}
      {days.map((day, index) => (
        <div key={index} className="day-input">
          <h3>Day {day.dayNumber}</h3>
          <label>
            {t('addTrip.dayTitle')}
            <input
              type="text"
              value={day.title}
              onChange={(e) => handleDayChange(index, 'title', e.target.value)}
              required
            />
          </label>
          <label>
            {t('addTrip.dayText')}
            <textarea
              value={day.text}
              onChange={(e) => handleDayChange(index, 'text', e.target.value)}
              required
            />
          </label>
        </div>
      ))}
        <label>
          {t('addTrip.price')}
          <input type="number" name="price" value={formData.price} onChange={handleChange} required />
        </label>
        <FormControl variant="outlined" className="dropdown">
          <InputLabel>{t('addTrip.month')}</InputLabel>
          <Select name="tripMonth" value={formData.tripMonth} onChange={handleChange} required>
            <MenuItem value="">{t('addTrip.chooseMonth')}</MenuItem>
            {months.map((month, index) => (
              <MenuItem key={index} value={month}>{month}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl variant="outlined" className="dropdown">
          <InputLabel>{t('addTrip.country')}</InputLabel>
          <Select
              value={selectedCountry}
              onChange={handleCountryChange}
              label="Country"
          >
              {countries.map((country) => (
                  <MenuItem key={country.id} value={country.name}>{country.name}</MenuItem>
              ))}
          </Select>
        </FormControl>
        {locations.length > 0 && (
          <FormControl variant="outlined" className="dropdown">
            <InputLabel>{t('addTrip.location')}</InputLabel>
            <Select multiple value={selectedLocations} onChange={handleLocationChange} label="Location">
              {locations.map((location) => (
                <MenuItem key={location.id} value={location.name}>
                  {location.name}
                </MenuItem>
              ))}
            </Select>
            <Button onClick={handleClearAll}>
              {t('addTrip.clear')}
            </Button>
          </FormControl>
        )}
        <label>
          Javno
          <input type="checkbox" name="isPublic" checked={formData.isPublic} onChange={handleChange} />
        </label>
        <label>
          {t('addTrip.images')}
          <input type="file" name="images" onChange={handleChange} multiple />
        </label>
        <button type="submit" className="auth-submit" disabled={adding}>
          {adding ? 'Dodavanje...' : 'Dodaj Putovanje'}
        </button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default AddTrip;