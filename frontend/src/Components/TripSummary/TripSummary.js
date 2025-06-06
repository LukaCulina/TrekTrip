import { useTranslation } from 'react-i18next';

const TripSummary = ({ trip }) => {
    const { t } = useTranslation();

    return (
        <div className="trip-summary">
            <p><strong>{t('trip.country')}:</strong></p>
            <span>{trip.locations.length > 0 ? trip.locations[0].country.name : 'Unknown Country'}</span>
            <p><strong>{t('trip.destination')}:</strong></p>
            <span>{trip.locations.map(location => location.destination).join(', ')}</span>
            <p><strong>{t('trip.month')}:</strong></p>
            <span>{trip.tripMonth}</span>
            <p><strong>{t('trip.duration')}:</strong></p>
            <span>{trip.lengthInDays} {t('trip.days')}</span>
            <p><strong>{t('trip.price')}:</strong></p>
            <span>{trip.price} €</span>
        </div>
    );
};

export default TripSummary;
