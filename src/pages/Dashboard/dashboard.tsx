import Header from '../../components/Header/Header';
import Navbar from '../../components/Navbar/NavBar';
import Card from '../../components/Cards/Card';
import './dashboard.css';

import { Bar, Line, Doughnut } from 'react-chartjs-2';

import chartData from '../../data/incomeExpense.json';
import topExpenses from '../../data/topExpenses.json';
import cashFlow from '../../data/cashFlow.json';
import { useGlobalToast } from '../../components/Toast/ToastContext';
import { useEffect, useState } from 'react';
import { Skeleton } from '@mui/material';


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


  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { showToast } = useGlobalToast();


  // LOAD BACKEND DATA 

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(false);  // ← NOW WORKS
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            if (Math.random() < 0.1) reject(new Error('Backend unavailable'));
            else resolve(true);
          }, 2500 + Math.random() * 1500);
        });
      } catch (err) {
        setError(true);  // ← NOW WORKS
        showToast('Failed to load dashboard data. Using mock data.', 'warning');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [showToast]);




  // DATA FORMATTING 

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

  const totalTopExpenses = topExpensesTyped.reduce(
    (sum, item) => sum + item.Amount,
    0
  );

  const formattedTopExpenses = {
    labels: topExpensesTyped.map(item =>
      item.Category.length > 14
        ? item.Category.slice(0, 14) + '…'
        : item.Category
    ),
    datasets: [
      {
        label: 'Top Expenses',
        data: topExpensesTyped.map(item => item.Amount),
        backgroundColor: [
          '#3B82F6', // blue
          '#EF4444', // red
          '#F59E0B', // amber
          '#10B981', // green
          '#8B5CF6', // purple
          '#EC4899', // pink
        ],
        borderWidth: 2,
        hoverOffset: 12,
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
    layout: { padding: { bottom: 35 } },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle' as const,
          font: { size: 14, weight: 'bold' as const } as const,
        } as const,
      } as const,
    } as const,
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          align: 'inner',
          callback: function (value: any) {
            if (typeof value === 'number') {
              return chartDataTyped[value]?.Income.Label || '';
            }
            const parts = String(value).split(' ');
            return parts.length === 2 ? `${parts[0]}\n${parts[1]}` : value;
          },
          maxRotation: 0,
          minRotation: 0,
          autoSkip: true,
          padding: 12,
          font: { size: 10 },
        } as any,
      },
      y: {
        grid: { color: 'rgba(0,0,0,0.05)', lineWidth: 1, drawBorder: false },
        ticks: {
          callback: function (value: any) {
            return '₹' + Number(value).toLocaleString();
          },
        } as any,
      } as any,
    } as const,
  } as const;

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%', // donut thickness
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 16,
          font: {
            size: 12,
            weight: 'bold' as const,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.label || '';
            const value = context.raw || 0;

            const percentage = totalTopExpenses
              ? ((value / totalTopExpenses) * 100).toFixed(1)
              : 0;

            return `${label}: ₹${value.toLocaleString()} (${percentage}%)`;

          },
        },
      },
    },
  };




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


  // const ReceivablesSkeleton = () => (
  //   <>
  //     <p><Skeleton variant="text" width="80%" /> <Skeleton variant="text" width="40%" sx={{ display: 'inline-block' }} /></p>
  //     <div className="bar"><Skeleton variant="rectangular" height={4} /></div>
  //     <div className="row-values">
  //       <h2><Skeleton variant="text" width="60%" height={32} /></h2>
  //       <h2><Skeleton variant="text" width="60%" height={32} /></h2>
  //     </div>
  //   </>
  // );

  const ChartSkeleton = ({ height = 350 }: { height?: number }) => (
    <div className="dataCard customerCard" style={{ height }}>
      <Skeleton variant="rectangular" height="100%" />
    </div>
  );


  const receivableActions = [
    { label: 'New Invoice', path: '/sales/add-invoice' },
    { label: 'New Recurring Invoice', path: '/sales/add-recurringInvoice' },
    { label: 'New Customer Payment', path: '/sales/record-payment' },
  ];

  const payableActions = [
    { label: 'New Bill', path: '/purchases/add-bill' },
    { label: 'New Vendor Payment', path: '/purchases/add-paymentMade' },
    { label: 'New Recurring Bill', path: '/purchases/add-recurringBill' },
  ];

  // LOADING SKELETON
  if (loading) {
    return (
      <>
        <Header />
        <div style={{ padding: '56px 0px 0px' }}>
          <Navbar tabs={dashboardTabs} />
          <div className="dashboard-container">
            {/* FIXED: Add empty children for Card loading */}
            <Card title="Total Receivables" loading />
            <Card title="Total Payables" loading />

            <Card title="Income and Expense" selectable>
              <div className="chart-toggle">
                <Skeleton variant="rounded" width={80} height={32} />
                <Skeleton variant="rounded" width={80} height={32} sx={{ ml: 2 }} />
              </div>
              <ChartSkeleton />
              <div className="chart-summary">
                <div className="summary-item">
                  <Skeleton variant="circular" width={12} height={12} sx={{ display: 'inline-block', mr: 1 }} />
                  <Skeleton width="60%" />
                </div>
                <div className="summary-item">
                  <Skeleton variant="circular" width={12} height={12} sx={{ display: 'inline-block', mr: 1 }} />
                  <Skeleton width="60%" />
                </div>
              </div>
            </Card>

            <Card title="Top Expenses" selectable>
              <div className="dataCard customerCard donut-wrapper" style={{ height: 350, paddingTop: '20px', paddingBottom: '10px' }}>
                <Skeleton variant="circular" width={200} height={200} sx={{ mx: 'auto' }} />
              </div>
            </Card>

            <Card title="Cash Flow" selectable className="wide-card">
              <div className="cashflow-content">
                <div style={{ height: '350px', flex: 1 }}>
                  <ChartSkeleton />
                </div>
                <div className="cashflow-summary">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="summary-item">
                      <Skeleton width="80%" height={24} />
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </>
    );
  }


  if (error) {
    // Fallback to mock data (your current json/static values)
    showToast('Backend failed - showing cached/mock data.', 'info');
  }


  return (
    <>
      <Header />
      <div style={{ padding: '56px 0px 0px' }}>
        <Navbar tabs={dashboardTabs} />

        <div className="dashboard-container">
          {/* Total Receivables */}
          <Card title="Total Receivables" actionMenu={receivableActions}>
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
          <Card title="Total Payables" actionMenu={payableActions}>
            <p>
              Total Unpaid Bills <span>₹ 0.00</span>
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
            <div className="dataCard customerCard donut-wrapper" style={{
              height: '350px',
              paddingTop: '20px',      // ✅ creates space from card header
              paddingBottom: '10px',
            }}>
              <Doughnut data={formattedTopExpenses} options={donutOptions} />
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
