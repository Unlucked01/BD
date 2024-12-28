import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    surname: '',
    lastName: '',
    password: '',
    airline_id: ''
  });
  const [airlines, setAirlines] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchAirlines = async () => {
      try {
        const response = await axios.get('http://localhost:8010/representative/airlines');
        setAirlines(response.data);
      } catch (err) {
        console.error('Error fetching airlines:', err);
      }
    };
    fetchAirlines();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
        first_name: formData.firstName,
        surname: formData.surname,
        last_name: formData.lastName || null,
        password: formData.password,
        airline_id: formData.airline_id
    };
    axios.post('http://127.0.0.1:8010/representative/register', payload)
      .then(() => {
        navigate('/');
      })
      .catch(() => {
        setError('Ошибка при регистрации. Попробуйте еще раз.');
      });
  };

  return (
    <div className="container my-4" style={{ maxWidth: '400px' }}>
      <div className="card p-4 shadow">
        <h1 className="mb-4 text-center">Регистрация</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="firstName" className="form-label">Имя</label>
            <input
                type="text"
                id="firstName"
                name="firstName"
                className="form-control"
                value={formData.firstName}
                onChange={handleChange}
                required
                placeholder="Введите имя"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="surname" className="form-label">Фамилия</label>
            <input
                type="text"
                id="surname"
                name="surname"
                className="form-control"
                value={formData.surname}
                onChange={handleChange}
                required
                placeholder="Введите фамилию"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="lastName" className="form-label">Отчество</label>
            <input
                type="text"
                id="lastName"
                name="lastName"
                className="form-control"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Введите отчество"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Пароль</label>
            <input
                type="password"
                id="password"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Введите пароль"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="airline_id" className="form-label">ID Авиакомпании</label>
            <select
                id="airline_id"
                name="airline_id"
                className="form-select"
                value={formData.airline_id}
                onChange={handleChange}
                required
            >
              <option value="">Выберите авиакомпанию</option>
              {airlines.map((airline) => (
                  <option key={airline.id} value={airline.id}>
                    {airline.name}
                  </option>
              ))}
            </select>
          </div>
          {error && (
              <div className="alert alert-danger p-2 mb-3">
                {error}
              </div>
          )}
          <button type="submit" className="btn btn-primary w-100">Зарегистрироваться</button>
          <p className="text-center mt-3">
            Есть аккаунт? <a href="/frontend/represent-app/public" className="text-primary">Войти</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
