import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { useSearchParams } from 'react-router-dom';

function StatisticsPage() {
  const [ticketStats, setTicketStats] = useState([]);
  const [revenueStats, setRevenueStats] = useState([]);

  const [searchParams] = useSearchParams();
  const airlineID = searchParams.get('airline_id');

  useEffect(() => {
    fetchTicketStats();
    fetchRevenueStats();
  }, []);

  const fetchTicketStats = async () => {
    const response = await fetch(`http://localhost:8010/representative/statistics/tickets?airline_id=${airlineID}`);
    const data = await response.json();
    setTicketStats(data);
  };

  const fetchRevenueStats = async () => {
    const response = await fetch(`http://localhost:8010/representative/statistics/revenue?airline_id=${airlineID}`);
    const data = await response.json();
    setRevenueStats(data);
  };

  const COLORS = ['#FF6384', '#36A2EB', '#FFCE56'];

  return (
    <div className="container mt-5">
      <h2>Статистика</h2>
      <div className="row">
        {/* Ticket Statistics */}
        <div className="col-md-6">
          <h4>Количество купленных билетов</h4>
          <BarChart
            width={600}
            height={600}
            data={ticketStats}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="departure_date" label={{ value: 'Дата вылета', position: 'insideBottom', dy: 10 }} />
            <YAxis label={{ value: 'Количество', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="purchased_tickets" fill="#8884d8" name="Купленные билеты" />
          </BarChart>
        </div>

        {/* Revenue Statistics */}
        <div className="col-md-6">
          <h4>Доходы по классам обслуживания</h4>
          <PieChart width={600} height={600}>
            <Pie
              data={revenueStats}
              dataKey="total_revenue"
              nameKey="serve_class"
              cx="50%"
              cy="50%"
              outerRadius={180}
              fill="#8884d8"
              label={(entry) => `${entry.serve_class}: ₽${entry.total_revenue}`}
            >
              {revenueStats.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
      </div>
    </div>
  );
}

export default StatisticsPage;
