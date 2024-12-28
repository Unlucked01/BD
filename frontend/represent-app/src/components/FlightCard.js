import React from 'react';

function FlightCard({ flight, planes, onEdit, onDelete }) {
  const planeName = planes.find((p) => p.id === flight.ID_plane)?.name || 'N/A';

  return (
    <div className="card mb-3">
      <div className="card-body">
        <h6>Рейс: {flight.ID_flight}</h6>
        <p>
          <strong>Самолет:</strong> {planeName}
          <br />
          <strong>Из:</strong> {flight.FromAirport} ({flight.FromCity})
          <br />
          <strong>В:</strong> {flight.ToAirport} ({flight.ToCity})
          <br />
          <strong>Дата:</strong> {flight.Departure_date}
          <br />
          <strong>Свободных мест:</strong> {flight.Seats_availiable}
        </p>
        <button className="btn btn-warning btn-sm me-2" onClick={() => onEdit(flight)}>
          Редактировать
        </button>
        <button className="btn btn-danger btn-sm" onClick={() => onDelete(flight.ID_flight)}>
          Удалить
        </button>
      </div>
    </div>
  );
}

export default FlightCard;
