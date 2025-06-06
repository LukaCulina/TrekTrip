const TripDays = ({ days }) => {
    return (
        <div className='trip-days'>
            {days.map(day => (
                <div key={day.id} className="trip-day">
                    <h3>{day.title}</h3>
                    <p>{day.text}</p>
                </div>
            ))}
        </div>
    );
};

export default TripDays;
