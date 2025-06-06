import { useState, useEffect } from 'react';
import axiosInstance from "../axios/axiosInstance";

const useTrips = () => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const response = await axiosInstance.get(`/trip/all`);
                setTrips(response.data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchTrips();
    }, []);

    return { trips, loading, error };
};

export default useTrips;
