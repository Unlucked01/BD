import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginPage({ setAirlineId }) {
  const [airlines, setAirlines] = useState([]);
  const [selectedAirline, setSelectedAirline] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch airlines when the component mounts
    const fetchAirlines = async () => {
      try {
        const response = await axios.get('http://localhost:8010/representative/airlines');
        setAirlines(response.data);
      } catch (err) {
        console.error('Ошибка при загрузке авиакомпаний:', err);
      }
    };

    fetchAirlines();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    if (!selectedAirline) {
      setError('Пожалуйста, выберите авиакомпанию');
      return;
    }

    axios
      .post('http://127.0.0.1:8010/representative/login/', { login: selectedAirline, password })
      .then((response) => {
        if (response.data.client_id >= 1) {
          setAirlineId(selectedAirline); // Pass the selected airline ID to the parent component
          navigate('/flights');
        } else {
          setError('Неправильный пароль');
        }
      })
      .catch(() => {
        setError('Неправильный пароль');
      });
  };

  return (
    <div className="container my-4" style={{ maxWidth: '400px' }}>
      <div className="card p-4 shadow">
        <h1 className="mb-4 text-center">Выбор авиакомпании</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="airlineSelect" className="form-label">Выберите авиакомпанию</label>
            <select
              id="airlineSelect"
              className="form-select"
              value={selectedAirline}
              onChange={(e) => setSelectedAirline(e.target.value)}
              required
            >
              <option value="">Выберите...</option>
              {airlines.map((airline) => (
                <option key={airline.id} value={airline.id}>
                  {airline.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Пароль</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Введите пароль"
            />
          </div>
          {error && (
            <div className="alert alert-danger p-2 mb-3">
              {error}
            </div>
          )}
          <button type="submit" className="btn btn-primary w-100">Войти</button>
          <p className="text-center mt-3">
            Нет аккаунта? <a href="/register" className="text-primary">Зарегистрироваться</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
