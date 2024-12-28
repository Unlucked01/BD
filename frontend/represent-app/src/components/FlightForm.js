import React from 'react';

function FlightForm({ formData, setFormData, planes, airports, onSubmit }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={onSubmit} className="row g-3 mb-3">
      <div className="col-md-2">
        <label>Из аэропорта</label>
        <select
          name="airport_from"
          className="form-control"
          value={formData.airport_from}
          onChange={handleChange}
          required
        >
          <option value="">Выберите аэропорт</option>
          {airports.map((airport) => (
            <option key={airport.id} value={airport.id}>
              {airport.name}
            </option>
          ))}
        </select>
      </div>
      <div className="col-md-2">
        <label>В аэропорт</label>
        <select
          name="airport_dest"
          className="form-control"
          value={formData.airport_dest}
          onChange={handleChange}
          required
        >
          <option value="">Выберите аэропорт</option>
          {airports.map((airport) => (
            <option key={airport.id} value={airport.id}>
              {airport.name}
            </option>
          ))}
        </select>
      </div>
      <div className="col-md-2">
        <label>Самолет</label>
        <select
          name="plane_id"
          className="form-control"
          value={formData.plane_id}
          onChange={handleChange}
          required
        >
          <option value="">Выберите самолет</option>
          {planes.map((plane) => (
            <option key={plane.id} value={plane.id}>
              {plane.name}
            </option>
          ))}
        </select>
      </div>
      <div className="col-md-2">
        <label>Дата вылета</label>
        <input
          type="date"
          name="departure_date"
          className="form-control"
          value={formData.departure_date}
          onChange={handleChange}
          required
        />
      </div>
      <div className="col-md-2">
        <label>Мест доступно</label>
        <input
          type="number"
          name="seats_available"
          className="form-control"
          value={formData.seats_available}
          onChange={handleChange}
          required
        />
      </div>
      <div className="col-md-1">
        <button type="submit" className="btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="70" viewBox="0 0 24 24" fill="none"
               stroke="#000000" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </button>
      </div>
    </form>
  );
}

export default FlightForm;
