// import React, { useState, useEffect } from 'react';
import customerExpences from '../../data/customerExpences.json'; // Adjust path as needed
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2'; // Changed to Bar

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ExpenseData {
  month: string;
  expense: number;
}

const ExpenseChart: React.FC = () => {
  const expenses: ExpenseData[] = customerExpences as ExpenseData[];

  const chartData = {
    labels: expenses.map((item) => item.month),
    datasets: [
      {
        label: 'Expenses (₹)',
        data: expenses.map((item) => item.expense),
        backgroundColor: 'rgba(13, 110, 253, 0.8)',
        borderColor: '#0D6EFD',
        borderWidth: 1,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#0D6EFD',
        borderWidth: 1,
        callbacks: {
          label: (context: any) => `₹${context.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 11 } },
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0,0,0,0.05)' },
        ticks: {
          callback: (value: any) => '₹' + (value as number).toLocaleString(),
          font: { size: 11 },
        },
      },
    },
  };

  return (
    <div
      className="chart-wrapper h-100"
      style={{ height: '100%', position: 'relative', borderRadius: '8px' }}
    >
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default ExpenseChart;
