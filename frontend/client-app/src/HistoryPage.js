import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';

function HistoryPage({ clientId }) {
  const [ticketsByClass, setTicketsByClass] = useState([]);
  const [ticketStats, setTicketStats] = useState([]);
  const [clientFlights, setClientFlights] = useState([]);

  const [loadingClass, setLoadingClass] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingFlights, setLoadingFlights] = useState(true);

  const [errorClass, setErrorClass] = useState(false);
  const [errorStats, setErrorStats] = useState(false);
  const [errorFlights, setErrorFlights] = useState(false);

  useEffect(() => {
    fetchData();
  }, [clientId]);

  const fetchData = () => {
    // Fetch tickets by class
    axios.get(`http://127.0.0.1:8010/client/tickets/class/${clientId}`)
      .then(response => {
        setTicketsByClass(response.data);
        setLoadingClass(false);
      })
      .catch(() => {
        setLoadingClass(false);
        setErrorClass(true);
      });

    // Fetch ticket stats (route-based)
    axios.get(`http://127.0.0.1:8010/client/tickets/stats/${clientId}`)
      .then(response => {
        setTicketStats(response.data);
        setLoadingStats(false);
      })
      .catch(() => {
        setLoadingStats(false);
        setErrorStats(true);
      });

    // Fetch client flights
    axios.get(`http://127.0.0.1:8010/client/flights/${clientId}`)
      .then(response => {
        setClientFlights(response.data);
        setLoadingFlights(false);
      })
      .catch(() => {
        setLoadingFlights(false);
        setErrorFlights(true);
      });
  };

  const handleDeleteTicket = (ticketId) => {
    axios.delete(`http://127.0.0.1:8010/client/tickets/?ticket_id=${ticketId}`)
      .then(response => {
        console.log('Ticket deleted:', response.data);
        // After successful delete, refetch the data:
        fetchData();
      })
      .catch(error => {
        console.error('Ошибка при удалении билета:', error);
      });
  };

  // Prepare data for flight-stats pie (based on total_hours)
  const prepareFlightStatsPieData = (stats) => {
    const labels = stats.map(item => item.route);
    const data = stats.map(item => item.total_hours);
    return { labels, data };
  };

  // Prepare data for ticket-class pie (based on total_sum in rubles)
  const prepareClassStatsPieData = (classes) => {
    const labels = classes.map(item => item.class_name);
    const data = classes.map(item => item.total_income);
    return { labels, data };
  };

  const flightData = prepareFlightStatsPieData(ticketStats);
  const classData = prepareClassStatsPieData(ticketsByClass);

  const colorPalette = [
    '#4dc9f6',
    '#f67019',
    '#f53794',
    '#537bc4',
    '#acc236',
    '#166a8f',
    '#00a950',
    '#58595b',
    '#8549ba'
  ];

  // Total for flight-stats (sum of total_hours)
  const totalFlightHours = flightData.data?.reduce((acc, val) => acc + val, 0) || 0;
  // Total for class-stats (sum of total_sum)
  const totalClassSum = classData.data?.reduce((acc, val) => acc + val, 0) || 0;

  const flightStatsPieData = {
    labels: flightData.labels,
    datasets: [
      {
        label: 'Общее время по маршрутам (часы)',
        data: flightData.data,
        backgroundColor: colorPalette.slice(0, flightData.data.length),
        borderWidth: 1,
        borderColor: '#fff'
      },
    ],
  };

  const classStatsPieData = {
    labels: classData.labels,
    datasets: [
      {
        label: 'Сумма по классам (руб.)',
        data: classData.data,
        backgroundColor: colorPalette.slice(0, classData.data.length),
        borderWidth: 1,
        borderColor: '#fff'
      },
    ],
  };

  const flightStatsOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Распределение по маршрутам (по сумме часов)',
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const route = flightStatsPieData.labels[tooltipItem.dataIndex];
            const hours = flightStatsPieData.datasets[0].data[tooltipItem.dataIndex];
            const percentage = totalFlightHours > 0 ? ((hours / totalFlightHours) * 100).toFixed(2) + '%' : '0%';

            return `${route}: ${hours} ч (${percentage})`;
          },
        },
      },
    },
  };

  const classStatsOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Распределение по классам (по сумме в рублях)',
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const className = classStatsPieData.labels[tooltipItem.dataIndex];
            const sum = classStatsPieData.datasets[0].data[tooltipItem.dataIndex];
            const percentage = totalClassSum > 0 ? ((sum / totalClassSum) * 100).toFixed(2) + '%' : '0%';

            // Find corresponding item in ticketsByClass to get ticket_count
            const originalItem = ticketsByClass.find(item => item.class_name === className);
            const ticketCount = originalItem ? originalItem.ticket_count : 0;

            return `${className}: ${sum} руб. (${percentage}), Билетов: ${ticketCount}`;
          },
        },
      },
    },
  };

  return (
    <div className="container my-4">
      <h1 className="mb-4">История билетов</h1>

      {/* История билетов клиента */}
      <div className="card mb-4">
        <div className="card-header">История билетов клиента</div>
        <div className="card-body">
          {loadingFlights ? (
            <p>Загрузка данных...</p>
          ) : errorFlights ? (
            <p>Ошибка при загрузке данных.</p>
          ) : clientFlights.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped table-bordered align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>ID билета</th>
                    <th>Место</th>
                    <th>Цена</th>
                    <th>Класс обслуживания</th>
                    <th>Дата вылета</th>
                    <th>Аэропорт вылета</th>
                    <th>Аэропорт назначения</th>
                    <th>Модель самолета</th>
                    <th>Статус</th>
                    <th>Удалить</th>
                  </tr>
                </thead>
                <tbody>
                  {clientFlights.map((flight, index) => (
                      <tr key={index}>
                        <td>{flight.ticket_id}</td>
                        <td>{flight.seat_number}</td>
                        <td>{flight.ticket_price}</td>
                        <td>{flight.service_class}</td>
                        <td>{flight.departure_date}</td>
                        <td>{flight.departure_airport}</td>
                        <td>{flight.destination_airport}</td>
                        <td>{flight.plane_model}</td>
                        <td style={{color: flight.ticket_status_color}}>{flight.ticket_status}</td>
                        <td style={{textAlign: 'center'}}>
                          <button
                              className="btn btn-link p-0"
                              onClick={() => handleDeleteTicket(flight.ticket_id)}
                              title="Удалить билет"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                 fill="none"
                                 stroke="#ff0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path
                                  d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              <line x1="10" y1="11" x2="10" y2="17"></line>
                              <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                          </button>
                        </td>
                      </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
              <p>Нет данных для отображения.</p>
          )}
        </div>
      </div>

      {/* Two pie charts in one card below the table */}
      <div className="card mb-4">
        <div className="card-header">Статистика</div>
        <div className="card-body">
          {(loadingStats || loadingClass) ? (
            <p>Загрузка данных...</p>
          ) : (errorStats || errorClass) ? (
            <p>Ошибка при загрузке данных статистики.</p>
          ) : (
            <div className="row">
              <div className="col-md-6 mb-3 d-flex justify-content-center">
                {ticketStats.length > 0 ? (
                  <div style={{ maxWidth: '300px', width: '100%' }}>
                    <Pie data={flightStatsPieData} options={flightStatsOptions} />
                  </div>
                ) : (
                  <p>Нет данных для маршрутов.</p>
                )}
              </div>
              <div className="col-md-6 mb-3 d-flex justify-content-center">
                {ticketsByClass.length > 0 ? (
                  <div style={{ maxWidth: '300px', width: '100%' }}>
                    <Pie data={classStatsPieData} options={classStatsOptions} />
                  </div>
                ) : (
                  <p>Нет данных по классам билетов.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HistoryPage;
