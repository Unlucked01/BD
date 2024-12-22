import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ManageTicketsPage({ clientId }) {
  const [reservedTickets, setReservedTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchReservedTickets();
  }, [clientId]);

  const fetchReservedTickets = () => {
    setLoading(true);
    setError(false);
    axios
      .get(`http://127.0.0.1:8010/client/tickets/reserved/${clientId}`)
      .then((response) => {
        setReservedTickets(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Ошибка при загрузке данных:', error);
        setError(true);
        setLoading(false);
      });
  };

  const handleReturnTicket = (ticketId) => {
    setSuccessMessage('');
    setErrorMessage('');
    axios
      .post(`http://127.0.0.1:8010/client/tickets/return/${ticketId}`)
      .then(() => {
        setSuccessMessage(`Билет с ID ${ticketId} успешно возвращён.`);
        fetchReservedTickets(); // Refresh the table after returning the ticket
      })
      .catch((error) => {
        console.error('Ошибка возврата билета:', error);
        setErrorMessage('Не удалось вернуть билет. Попробуйте снова.');
      });
  };

  const handlePayForTicket = (ticketId) => {
    setSuccessMessage('');
    setErrorMessage('');
    axios
      .put(`http://127.0.0.1:8010/client/tickets/pay/${ticketId}`)
      .then(() => {
        setSuccessMessage(`Билет с ID ${ticketId} успешно оплачен.`);
        fetchReservedTickets(); // Refresh the table after payment
      })
      .catch((error) => {
        console.error('Ошибка оплаты билета:', error);
        setErrorMessage('Не удалось оплатить билет. Попробуйте снова.');
      });
  };

  if (loading) {
    return <div className="container my-4">Загрузка данных...</div>;
  }

  if (error) {
    return <div className="container my-4">Ошибка при загрузке данных.</div>;
  }

  return (
    <div className="container my-4">
      <h1 className="mb-4">Управление билетами</h1>

      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      {reservedTickets.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-striped table-bordered align-middle">
            <thead className="table-dark">
              <tr>
                <th>ID Билета</th>
                <th>Класс обслуживания</th>
                <th>Количество билетов</th>
                <th>Общая сумма</th>
                <th>Статус билета</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {reservedTickets.map((ticket, index) => (
                <tr key={index}>
                  <td>{ticket.ticket_id}</td>
                  <td>{ticket.class_name}</td>
                  <td>{ticket.ticket_count}</td>
                  <td>{ticket.total_sum}</td>
                  <td>{ticket.ticket_status}</td>
                  <td>
                    <button
                      className="btn btn-primary me-2"
                      onClick={() => handlePayForTicket(ticket.ticket_id)}
                    >
                      Оплатить билет
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleReturnTicket(ticket.ticket_id)}
                    >
                      Вернуть билет
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Нет забронированных билетов для отображения.</p>
      )}
    </div>
  );
}

export default ManageTicketsPage;
