import React from 'react';

const AirportCard = ({ airport, cities, onEdit, onSave, onDelete }) => {
  const handleBlur = () => {
    if (airport.name.trim() && airport.city_id) {
      onEdit(airport.id, { ...airport, isEditable: false });
      onSave(airport.id, { ...airport }); // Save the airport data
    } else {
      onDelete(airport.id); // Delete invalid airport
    }
  };

  return (
    <div key={airport.id} className="card mb-2 p-2 d-flex align-items-center position-relative">
      {airport.isEditable ? (
        <div className="row-cols-1">
          <input
            type="text"
            className="form-control mb-1"
            placeholder="Название аэропорта"
            value={airport.name}
            onChange={(e) => onEdit(airport.id, { ...airport, name: e.target.value })}
          />
          <select
            id="citySelect"
            className="form-select"
            value={airport.city_id}
            onChange={(e) => onEdit(airport.id, { ...airport, city_id: e.target.value })}
            onBlur={handleBlur}
          >
            <option value="">Выберите город</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <>
          <span>{airport.name}</span>
          <button
            className="btn position-absolute"
            onClick={() => onDelete(airport.id)}
            style={{
              top: '50%',
              right: '10px',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#000000"
              strokeWidth="2.5"
              strokeLinecap="square"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </>
      )}
    </div>
  );
};

export default AirportCard;
