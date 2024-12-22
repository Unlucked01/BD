import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SearchFlightsPage from "./SearchFlightsPage";

function BookingPage({ clientId }) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [errorUser, setErrorUser] = useState(false);

  useEffect(() => {
    if (!clientId) {
      navigate('/'); // Если нет clientId, перенаправляем на логин
      return;
    }

    // Fetch current user data
    axios.get(`http://127.0.0.1:8010/client/profile/${clientId}`)
      .then(response => {
        setCurrentUser(response.data);
        setLoadingUser(false);
      })
      .catch(error => {
        console.error('Ошибка при загрузке данных пользователя:', error);
        setErrorUser(true);
        setLoadingUser(false);
      });
  }, [clientId, navigate]);

  if (!clientId) {
    return null; // Already redirecting
  }

  if (loadingUser) {
    return <div className="container my-4">Загрузка данных пользователя...</div>;
  }

  if (errorUser || !currentUser) {
    return <div className="container my-4">Ошибка при загрузке данных пользователя.</div>;
  }

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Бронирование билетов</h1>
        <div>
          <button className="btn btn-primary me-2" onClick={() => navigate('/tickets/manage')}>
            Купить/Вернуть билет
          </button>

          <button className="btn btn-secondary" onClick={() => navigate('/history')}>
            История билетов
          </button>
        </div>
      </div>
      <div className="card p-3">
        {/* Pass currentUser as prop */}
        <SearchFlightsPage currentUser={currentUser} />
      </div>
    </div>
  );
}

export default BookingPage;
