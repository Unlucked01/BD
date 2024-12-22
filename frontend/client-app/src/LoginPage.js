import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginPage({ setClientId }) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://127.0.0.1:8010/client/login', { login, password })
      .then(response => {
        setClientId(response.data.client_id); // Сохраняем client_id
        navigate('/booking');
      })
      .catch(() => {
        setError('Неправильный логин или пароль');
      });
  };

  return (
      <div className="container my-4" style={{ maxWidth: '400px' }}>
        <div className="card p-4 shadow">
          <h1 className="mb-4 text-center">Вход</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="login" className="form-label">Логин</label>
              <input
                  type="text"
                  id="login"
                  className="form-control"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  required
                  placeholder="Введите логин"
              />
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
