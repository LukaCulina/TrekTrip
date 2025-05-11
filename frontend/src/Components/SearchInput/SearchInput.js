import React from 'react';

const SearchInput = ({ value, onChange, onSearch, trips }) => {
    return (
        <div>
            <input className="searchbar" placeholder="..." type="text" value={value} onChange={onChange} />
            <div className="dropdown">
                {trips.filter(trip => {
                    const searchTerm = value.toLowerCase();
                    const title = trip.title.toLowerCase();
                    return searchTerm && title.startsWith(searchTerm) && title !== searchTerm;
                }).slice(0, 5).map((trip) => (
                    <div onClick={() => onSearch(trip.title, trip.id)} className="dropdown-item" key={trip.id}>
                        {trip.title}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchInput;
