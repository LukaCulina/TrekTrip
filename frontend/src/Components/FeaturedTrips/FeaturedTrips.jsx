import { Link } from 'react-router-dom';
import HighlightedTripCard from '../../Components/HighlightedTripCard/HighlightedTripCard';

const FeaturedTrips = ({ trips }) => {
    return (
        <section className="featured-trips">
            <div className="trip-cards">
                {trips.map((trip) => (
                    <Link key={trip.id} to={`/putovanja/${trip.id}`}>
                        <HighlightedTripCard trip={trip} className="trip-card" />
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default FeaturedTrips;
