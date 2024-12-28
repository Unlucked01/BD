import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import InfiniteScrollList from '../components/InfiniteScroll';
import FlightForm from '../components/FlightForm';
import FlightCard from '../components/FlightCard';
import PlaneCard from "../components/PlaneCard";
import AirportCard from "../components/AirportCard";

function ManageFlightsPage({ airlineID }) {
  const navigate = useNavigate();

  const [allFlights, setAllFlights] = useState([]);
  const [displayedFlights, setDisplayedFlights] = useState([]);
  const [hasMoreFlights, setHasMoreFlights] = useState(false);

  const [airports, setAirports] = useState([]);
  const [displayedCities, setDisplayedCities] = useState([]);
  const [hasMoreCities, setHasMoreCities] = useState(false);

  const [planes, setPlanes] = useState([]);
  const [displayedPlanes, setDisplayedPlanes] = useState([]);
  const [hasMorePlanes, setHasMorePlanes] = useState(false);

  const [cities, setCities] = useState([]);

  const [newPlaneData, setNewPlaneData] = useState({
    name: '',
    capacity: '',
    airline_id: airlineID,
  });

  const [formData, setFormData] = useState({
    ID_flight: null,
    airport_from: '',
    airport_dest: '',
    plane_id: '',
    departure_date: '',
    seats_available: '',
  });

  useEffect(() => {
    fetchFlights();
    fetchAirports();
    fetchPlanes();
    fetchCities();
  }, [airlineID]);

  const handleNavigateToStats = () => {
        navigate(`/stats?airline_id=${airlineID}`);
    };

  const fetchFlights = async () => {
    try {
      const resp = await fetch(`http://localhost:8010/representative/flights?airline_id=${airlineID}`);
      if (!resp.ok) throw new Error('Ошибка при загрузке рейсов');
      const data = await resp.json();
      setAllFlights(data);
      setDisplayedFlights(data.slice(0, 5));
      setHasMoreFlights(data.length > 5);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCities = async () => {
    try {
      const response = await fetch('http://localhost:8010/representative/cities');
      if (!response.ok) {
        throw new Error('Ошибка при загрузке городов');
      }
      const data = await response.json();
      setCities(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAirports = async () => {
    try {
      const resp = await fetch('http://localhost:8010/representative/airports');
      if (!resp.ok) throw new Error('Ошибка при загрузке аэропортов');
      const data = await resp.json();
      setAirports(data);
      setDisplayedCities(data.slice(0, 5));
      setHasMoreCities(data.length > 5);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPlanes = async () => {
    try {
      const resp = await fetch(`http://localhost:8010/representative/planes/?airline_id=${airlineID}`);
      if (!resp.ok) throw new Error('Ошибка при загрузке самолетов');
      const data = await resp.json();
      setPlanes(data);
      setDisplayedPlanes(data.slice(0, 5));
      setHasMorePlanes(data.length > 5);
    } catch (error) {
      console.error(error);
    }
  };

  const loadMoreFlights = () => {
    const currentLen = displayedFlights.length;
    const nextChunk = allFlights.slice(currentLen, currentLen + 5);
    setDisplayedFlights((prev) => [...prev, ...nextChunk]);
    setHasMoreFlights(currentLen + nextChunk.length < allFlights.length);
  };

  const loadMoreCities = () => {
    const currentLen = displayedCities.length;
    const nextChunk = airports.slice(currentLen, currentLen + 5);
    setDisplayedCities((prev) => [...prev, ...nextChunk]);
    setHasMoreCities(currentLen + nextChunk.length < airports.length);
  };

  const loadMorePlanes = () => {
    const currentLen = displayedPlanes.length;
    const nextChunk = planes.slice(currentLen, currentLen + 5);
    setDisplayedPlanes((prev) => [...prev, ...nextChunk]);
    setHasMorePlanes(currentLen + nextChunk.length < planes.length);
  };

  const getNextFlightID = () => {
    const maxID = allFlights.reduce((max, flight) => Math.max(max, flight.ID_flight), 0);
    return maxID + 1;
  };

  const handleAddAirport = async (id, newAirport) => {
  try {
    const resp = await fetch(
      `http://localhost:8010/representative/airports?name=${newAirport.name}&city_id=${newAirport.city_id}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    if (!resp.ok) throw new Error('Ошибка при добавлении аэропорта');
    const data = await resp.json();
    alert(data.message);
    fetchAirports(); // Refresh the list of airports
  } catch (error) {
    console.error(error);
    alert('Не удалось добавить аэропорт');
  }
};

  const handleAddPlane = async () => {
    try {
      console.log(newPlaneData)
      const resp = await fetch(
      `http://localhost:8010/representative/planes?name=${newPlaneData.name}&capacity=${newPlaneData.capacity}&airline_id=${airlineID}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
      );
      if (!resp.ok) throw new Error('Ошибка при добавлении самолета');
      const data = await resp.json();
      fetchPlanes();
    } catch (error) {
      console.error(error);
    }
  };


  const handleAddEditFlight = async (e) => {
    e.preventDefault();
    const isEdit = formData.ID_flight !== null;
    const flightID = isEdit ? formData.ID_flight : getNextFlightID();

    const method = isEdit ? 'PUT' : 'POST';
    const endpoint = isEdit
      ? `http://localhost:8010/representative/flights/${flightID}`
      : 'http://localhost:8010/representative/flights/add';

    try {
      if (formData.seats_available <= 0) alert(`Ошибка при сохранении рейса!`)
      const resp = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          flight_id: flightID,
          airport_from: formData.airport_from,
          airport_dest: formData.airport_dest,
          plane_id: formData.plane_id,
          departure_date: formData.departure_date,
          seats_availiable: formData.seats_available,
        }),
      });
      if (!resp.ok) throw new Error('Ошибка при сохранении рейса');
      fetchFlights();
      setFormData({
        ID_flight: null,
        airport_from: '',
        airport_dest: '',
        plane_id: '',
        departure_date: '',
        seats_available: '',
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditFlight = (flight) => {
    const airportFromId = airports.find((airport) => airport.name === flight.FromAirport)?.id || '';
    const airportDestId = airports.find((airport) => airport.name === flight.ToAirport)?.id || '';

    setFormData({
      ID_flight: flight.ID_flight,
      airport_from: airportFromId,
      airport_dest: airportDestId,
      plane_id: flight.ID_plane,
      departure_date: flight.Departure_date,
      seats_available: flight.Seats_availiable,
    });
  };

  const handleDeleteFlight = async (flightId) => {
    try {
      const resp = await fetch(`http://localhost:8010/representative/flights/${flightId}`, {
        method: 'DELETE',
      });
      if (!resp.ok) throw new Error('Ошибка при удалении рейса');
      fetchFlights();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteAirport = async (cityId) => {
    try {
      const resp = await fetch(`http://localhost:8010/representative/airports/${cityId}`, {
        method: 'DELETE',
      });
      if (!resp.ok) throw new Error('Ошибка при удалении города');
      fetchAirports();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeletePlane = async (planeId) => {
    try {
      const resp = await fetch(`http://localhost:8010/representative/planes/${planeId}`, {
        method: 'DELETE',
      });
      if (!resp.ok) throw new Error('Ошибка при удалении самолета');
      fetchPlanes();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mt-3">
      <h2>
        <button className="btn-sm" onClick={handleNavigateToStats} style={{background: 'none', border: 'none'}}>
          <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none"
               stroke="#000000" stroke-width="2.5" stroke-linecap="square" stroke-linejoin="round">
            <path d="M3 3v18h18"/>
            <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
          </svg>
        </button>
      </h2>
      <FlightForm
          formData={formData}
          setFormData={setFormData}
          planes={planes}
          airports={airports}
          onSubmit={handleAddEditFlight}
      />
      <div className="row">
        {/* Flights */}
        <div className="col-md-5">
          <h5>Рейсы</h5>
          <InfiniteScrollList
              items={displayedFlights}
              loadMore={loadMoreFlights}
              hasMore={hasMoreFlights}
              renderItem={(flight) => (
                  <FlightCard
                      key={flight.ID_flight}
                      flight={flight}
                      planes={planes}
                      onEdit={handleEditFlight}
                      onDelete={handleDeleteFlight}
                  />
              )}
          />
        </div>

        {/* Airports */}
        <div className="col-md-3">
          <div className="d-flex justify-content-between align-items-center">
            <h5>Аэропорты</h5>
            <button
                className="btn btn-sm"
                onClick={() => {
                  const lastId = displayedCities.reduce((max, city) => Math.max(max, city.id || 0), 0);
                  setDisplayedCities([{id: lastId + 1, name: '', isEditable: true}, ...displayedCities]);
                }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                   stroke="#000000" stroke-width="3" stroke-linecap="square" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </div>
          <InfiniteScrollList
              items={displayedCities}
              loadMore={loadMoreCities}
              hasMore={hasMoreCities}
              renderItem={(airport) => (
                  <AirportCard
                    key={airport.id}
                    airport={airport}
                    cities={cities}
                    onEdit={(id, updatedAirport) =>
                        setDisplayedCities((prev) =>
                        prev.map((a) => (a.id === id ? updatedAirport : a)))}
                    onSave={handleAddAirport}
                    onDelete={handleDeleteAirport}
              />
            )}
          />
        </div>

        {/* Planes */}
        <div className="col-md-3">
          <div className="d-flex justify-content-between align-items-center">
            <h5>Самолеты</h5>
            <button
                className="btn btn-sm"
                onClick={() => {
                  const lastId = displayedPlanes.reduce((max, plane) => Math.max(max, plane.id || 0), 0);
                  setDisplayedPlanes([{id: lastId + 1, name: '', isEditable: true}, ...displayedPlanes]);
                }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                   stroke="#000000" stroke-width="3" stroke-linecap="square" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </div>
          <InfiniteScrollList
              items={displayedPlanes}
              loadMore={loadMorePlanes}
              hasMore={hasMorePlanes}
              renderItem={(plane) => (
                  <PlaneCard
                  key={plane.id}
                  plane={plane}
                  onEdit={(id, updatedPlane) => {
                    setDisplayedPlanes((prev) =>
                      prev.map((p) => (p.id === id ? { ...updatedPlane, airline_id: airlineID } : p))
                    );
                  }}
                  onDelete={(id) => {
                    setDisplayedPlanes((prev) => prev.filter((p) => p.id !== id));
                    handleDeletePlane(id); // Backend deletion
                  }}
                  onSave={(id, updatedPlane) => {
                    console.log(updatedPlane)
                    handleAddPlane(setNewPlaneData(updatedPlane));
                  }}
                />
            )}
          />
        </div>
      </div>
    </div>
  );
}

export default ManageFlightsPage;
