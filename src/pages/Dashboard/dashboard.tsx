// ✅ FIXED: Complete Dashboard with TypeScript errors resolved

import Header from '../../components/Header/Header';
import Navbar from '../../components/Navbar/NavBar';
import Card from '../../components/Cards/Card';
import './dashboard.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

import chartData from '../../data/incomeExpense.json';
import topExpenses from '../../data/topExpenses.json';
import cashFlow from '../../data/cashFlow.json';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
);

export const dashboardTabs = [
  { label: 'Dashboard', path: '/' },
  { label: 'Sales', path: '/sales' },
  { label: 'Purchases', path: '/purchases' },
  { label: 'Accountant', path: '/accountant' },
  { label: 'Society', path: '/society' },
  { label: 'Reporting', path: '/reporting' },
];

interface ChartEntry {
  Income: { Label: string; value: number };
  Expense: { Label: string; value: number };
}

interface TopExpenseEntry {
  Category: string;
  Amount: number;
}

interface CashFlowEntry {
  month: string;
  incoming: number;
  outgoing: number;
}

const chartDataTyped: ChartEntry[] = chartData as ChartEntry[];
const topExpensesTyped: TopExpenseEntry[] = topExpenses as TopExpenseEntry[];
const cashFlowTyped: CashFlowEntry[] = cashFlow as CashFlowEntry[];

function Dashboard() {
  // Original formatted data
  const formattedIncomeExpense = {
    labels: chartDataTyped.map((i) => i.Income.Label),
    datasets: [
      {
        label: 'Income',
        data: chartDataTyped.map((i) => i.Income.value),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Expense',
        data: chartDataTyped.map((i) => i.Expense.value),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  const formattedTopExpenses = {
    labels: topExpensesTyped.map((item) => item.Category),
    datasets: [
      {
        label: 'Top Expenses',
        data: topExpensesTyped.map((item) => item.Amount),
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
      },
    ],
  };

  const formattedCashFlow = {
    labels: cashFlowTyped.map((i) => i.month),
    datasets: [
      {
        label: 'Incoming',
        data: cashFlowTyped.map((i) => i.incoming),
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        tension: 0.4,
        fill: false,
      },
      {
        label: 'Outgoing',
        data: cashFlowTyped.map((i) => i.outgoing),
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        tension: 0.4,
        fill: false,
      },
    ],
  };

  // ✅ FIXED: TypeScript-compliant chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle' as const,
          font: {
            size: 14,
            weight: 'bold' as const, // ✅ FIXED: Use 'bold' instead of '500'
          } as const,
        } as const,
      } as const,
    } as const,
    scales: {
      x: {
        grid: { display: false },
        ticks: { maxRotation: 0 },
      },
      y: {
        grid: {
          color: 'rgba(0,0,0,0.05)',
          lineWidth: 1,
          drawBorder: false,
        },
        ticks: {
          callback: function (value: any) {
            return '₹' + Number(value).toLocaleString();
          },
        } as any,
      } as any,
    } as const,
  } as const;

  // Bright styled charts
  // ✅ UPDATED: Income/Expense colors + reduced border radius

  const brightIncomeExpense = {
    ...formattedIncomeExpense,
    datasets: [
      {
        ...formattedIncomeExpense.datasets[0],
        label: 'Income',
        backgroundColor: 'rgba(59, 130, 246, 0.8)', // ✅ Blueish (positive)
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        borderRadius: 4, // ✅ Reduced from 8 to 4
        borderSkipped: false,
      },
      {
        ...formattedIncomeExpense.datasets[1],
        label: 'Expense',
        backgroundColor: 'rgba(239, 68, 68, 0.8)', // ✅ Redish (negative)
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 2,
        borderRadius: 4, // ✅ Reduced from 8 to 4
        borderSkipped: false,
      },
    ],
  };

  const brightTopExpenses = {
    ...formattedTopExpenses,
    datasets: [
      {
        ...formattedTopExpenses.datasets[0],
        backgroundColor: 'rgba(59, 130, 246, 0.8)', // Bright blue
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  // ✅ UPDATED: Cash Flow line chart with alternate colors

  const brightCashFlow = {
    ...formattedCashFlow,
    datasets: [
      {
        ...formattedCashFlow.datasets[0],
        label: 'Incoming',
        borderColor: 'rgba(59, 130, 246, 1)', // ✅ Blue (positive)
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
      {
        ...formattedCashFlow.datasets[1],
        label: 'Outgoing',
        borderColor: 'rgba(239, 68, 68, 1)', // ✅ Red (negative)
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        pointBackgroundColor: 'rgba(239, 68, 68, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  return (
    <>
      <Header />
      <div style={{ padding: '56px 0px 0px' }}>
        <Navbar tabs={dashboardTabs} />

        <div className="dashboard-container">
          {/* Total Receivables */}
          <Card title="Total Receivables" actions>
            <p>
              Total Unpaid Invoice <span>₹ 0.00</span>
            </p>
            <div className="bar"></div>
            <div className="row-values">
              <h2>
                Current <span>₹ 0.00</span>
              </h2>
              <h2>
                Overdue <span>₹ 0.00</span>
              </h2>
            </div>
          </Card>

          {/* Total Payables */}
          <Card title="Total Payables" actions>
            <p>
              Total Unpaid Invoice <span>₹ 0.00</span>
            </p>
            <div className="bar"></div>
            <div className="row-values">
              <h2>
                Current <span>₹ 0.00</span>
              </h2>
              <h2>
                Overdue <span>₹ 0.00</span>
              </h2>
            </div>
          </Card>

          <Card title="Income and Expense" selectable>
            <div className="chart-toggle">
              <button className="toggle-btn accrual active">Accrual</button>
              <button className="toggle-btn cash">Cash</button>
            </div>

            <div className="dataCard customerCard" style={{ height: '350px' }}>
              <Bar data={brightIncomeExpense} options={chartOptions} />
            </div>

            <div className="chart-summary">
              <div className="summary-item">
                <span className="dot income"></span> Income
                <h3>Total Income</h3>
                <h2>₹0.00</h2>
              </div>
              <div className="summary-item">
                <span className="dot expense"></span> Expense
                <h3>Total Expenses</h3>
                <h2>₹0.00</h2>
              </div>
            </div>

            <p className="chart-note">
              * Income and expense values displayed are exclusive of taxes.
            </p>
          </Card>

          <Card title="Top Expenses" selectable>
            <div className="dataCard customerCard" style={{ height: '350px' }}>
              <Bar data={brightTopExpenses} options={chartOptions} />
            </div>
          </Card>

          <Card title="Cash Flow" selectable className="wide-card">
            <div className="cashflow-content">
              <div style={{ height: '350px', flex: 1 }}>
                <Line data={brightCashFlow} options={chartOptions} />
              </div>
              <div className="cashflow-summary">
                <div className="summary-item">
                  <h3>Cash as on 01/04/2025</h3>
                  <h2>₹0.00</h2>
                </div>
                <div className="summary-item">
                  <h3 style={{ color: 'red' }}>Incoming</h3>
                  <h2>₹0.00 +</h2>
                </div>
                <div className="summary-item">
                  <h3>Outgoing</h3>
                  <h2>₹0.00 -</h2>
                </div>
                <div className="summary-item">
                  <h3>Cash as on 01/04/2025</h3>
                  <h2>₹0.00 =</h2>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
