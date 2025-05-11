import { useState, useEffect } from 'react';

const useTopTrips = (trips) => {
    const [topTrips, setTopTrips] = useState([]);

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
        setTopTrips(sortedTrips.slice(0, 3));
    }, [trips]);

    return topTrips;
};

export default useTopTrips;
