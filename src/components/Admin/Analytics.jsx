import React from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import './Analytics.css';

Chart.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Tooltip, Legend);

const Analytics = () => {
  // Dummy data for charts
  const barData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Orders',
        backgroundColor: '#6c47ff',
        data: [120, 190, 170, 210, 230, 250],
        borderRadius: 8,
      },
      {
        label: 'Users',
        backgroundColor: '#f8961e',
        data: [80, 100, 90, 120, 140, 160],
        borderRadius: 8,
      },
    ],
  };

  const donutData = {
    labels: ['Completed', 'Pending', 'Cancelled'],
    datasets: [
      {
        data: [65, 25, 10],
        backgroundColor: ['#4cc9f0', '#6c47ff', '#f72585'],
        borderWidth: 0,
      },
    ],
  };

  const lineData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Revenue',
        data: [1200, 1800, 1500, 2000],
        fill: true,
        backgroundColor: 'rgba(108,71,255,0.08)',
        borderColor: '#6c47ff',
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#6c47ff',
      },
    ],
  };

  return (
    <div className="analytics-admin-page">
      <h2>Analytics & KPIs</h2>
      <div className="analytics-kpi-row">
        <div className="kpi-card">
          <div className="kpi-label">Total Orders</div>
          <div className="kpi-value">1,234</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Total Users</div>
          <div className="kpi-value">2,567</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Revenue</div>
          <div className="kpi-value">$12,345</div>
        </div>
      </div>
      <div className="analytics-charts-row">
        <div className="analytics-chart analytics-bar-chart">
          <h4>Orders & Users (Monthly)</h4>
          <Bar data={barData} options={{ plugins: { legend: { display: true } }, responsive: true, maintainAspectRatio: false }} height={140} />
        </div>
        <div className="analytics-chart analytics-donut-chart">
          <h4>Order Status</h4>
          <Doughnut data={donutData} options={{ plugins: { legend: { display: true, position: 'bottom' } }, cutout: '70%' }} height={220} />
        </div>
        <div className="analytics-chart analytics-line-chart">
          <h4>Revenue Trend</h4>
          <Line data={lineData} options={{ plugins: { legend: { display: false } }, responsive: true, maintainAspectRatio: false }} height={140} />
        </div>
      </div>
    </div>
  );
};

export default Analytics; 