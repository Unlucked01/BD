import React, { useState } from 'react';
import axios from 'axios';
import { FixedSizeList as List } from 'react-window';

function SearchFlightsPage({ currentUser }) {
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [seats, setSeats] = useState('');
  const [flights, setFlights] = useState([]);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [selectedFlightId, setSelectedFlightId] = useState(null);
  const [selectedClassId, setSelectedClassId] = useState('1'); // Default class id
  const [ticketCount, setTicketCount] = useState(1);

  // Extract currentUser fields
  const { first_name, surname, last_name, id: clientId } = currentUser || {};

  const handleSearch = (e) => {
    e.preventDefault();
    axios
      .post('http://127.0.0.1:8010/client/flights/search', {
        from_city: fromCity,
        to_city: toCity || null,
        departure_date: departureDate || null,
        seats: seats || null,
      })
      .then((response) => {
        setFlights(response.data);
      })
      .catch((error) => {
        console.error('Ошибка при поиске рейсов:', error);
      });
  };

  const handleOpenModal = (flightId) => {
    setSelectedFlightId(flightId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedClassId('1');
    setTicketCount(1);
  };

  const handleBookTickets = () => {
    if (!clientId || !selectedFlightId || !selectedClassId) {
      return; // Validate data if needed
    }

    axios
      .post('http://127.0.0.1:8010/client/tickets/', {
        client_id: parseInt(clientId, 10),
        flight_id: parseInt(selectedFlightId, 10),
        serve_stat_id: parseInt(selectedClassId, 10),
        ticket_status_id: 2,
        ticket_count: parseInt(ticketCount, 10),
      })
      .then((response) => {
        console.log('Билеты успешно забронированы:', response.data);
        handleCloseModal();
      })
      .catch((error) => {
        console.error('Ошибка при бронировании билета:', error);
      });
  };

  // Row rendering function for react-window
  const Row = ({ index, style }) => {
    const flight = flights[index];
    return (
      <div style={style} className="col-12">
        <div className="card p-3 mb-3" style={{ margin: '0 10px' }}>
          <div className="row">
            <div className="col-md-6">
              <p><strong>Рейс:</strong> {flight.ID_flight}</p>
              <p><strong>От:</strong> {flight.FromAirport}</p>
              <p><strong>До:</strong> {flight.ToAirport}</p>
              <p><strong>Дата:</strong> {flight.Departure_date}</p>
            </div>
            <div className="col-md-6">
              <p><strong>Модель самолёта:</strong> {flight.Model_plane}</p>
              <p><strong>Свободные места:</strong> {flight.Seats_availiable}</p>
              <button
                className="btn btn-success mt-3"
                onClick={() => handleOpenModal(flight.ID_flight)}
              >
                Забронировать
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container my-4">
      {/* Панель поиска */}
      <div className="card p-3 mb-4">
        <h2 className="mb-3">Поиск рейсов</h2>
        <form onSubmit={handleSearch}>
          <div className="row g-3 align-items-end">
            <div className="col-md-3">
              <label className="form-label">Откуда</label>
              <input
                type="text"
                placeholder="Откуда"
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                required
                className="form-control"
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Куда</label>
              <input
                type="text"
                placeholder="Куда"
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
                className="form-control"
              />
            </div>
            <div className="col-md-2">
              <label className="form-label">Дата вылета</label>
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="form-control"
              />
            </div>
            <div className="col-md-2">
              <label className="form-label">Количество билетов</label>
              <input
                type="number"
                placeholder="Кол-во билетов"
                min="1"
                value={seats}
                onChange={(e) => setSeats(e.target.value)}
                className="form-control"
              />
            </div>
            <div className="col-md-2 d-grid">
              <button type="submit" className="btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                     stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Список рейсов (RecyclerView-like with react-window) */}
      <div>
        <h2 className="mb-3">Доступные рейсы</h2>
        {flights.length > 0 ? (
            <List height={400}
            itemCount={flights.length}
            itemSize={200}
            width={'100%'}
          >
            {Row}
          </List>
        ) : (
          <p>Рейсы не найдены.</p>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Бронирование билета</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                {/* Display current user name fields as read-only */}
                <div className="mb-3">
                  <label className="form-label">Имя</label>
                  <input type="text" className="form-control" value={first_name || ''} readOnly />
                </div>
                <div className="mb-3">
                  <label className="form-label">Фамилия</label>
                  <input type="text" className="form-control" value={surname || ''} readOnly />
                </div>
                <div className="mb-3">
                  <label className="form-label">Отчество</label>
                  <input type="text" className="form-control" value={last_name || ''} readOnly />
                </div>

                {/* Dropdown for ticket class */}
                <div className="mb-3">
                  <label className="form-label">Класс обслуживания</label>
                  <select
                    className="form-select"
                    value={selectedClassId}
                    onChange={(e) => setSelectedClassId(e.target.value)}
                  >
                    <option value="1">бизнес (ID=1)</option>
                    <option value="2">эконом (ID=2)</option>
                    <option value="3">1-класс (ID=3)</option>
                  </select>
                </div>

                {/* Number of tickets */}
                <div className="mb-3">
                  <label className="form-label">Количество билетов</label>
                  <input
                    type="number"
                    className="form-control"
                    value={ticketCount}
                    min="1"
                    onChange={(e) => setTicketCount(e.target.value)}
                  />
                </div>

              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Отмена
                </button>
                <button type="button" className="btn btn-primary" onClick={handleBookTickets}>
                  Оформить бронь
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default SearchFlightsPage;
