import React, { useEffect, useMemo, useState } from 'react';
import Header from '../../../../components/Header/Header';
import Tabs from '../../../../components/Tab/Tabs';
import CommentBox from '../../../../components/ViewComponents/CommentBox';
import Transactions from '../../../../components/ViewComponents/Transactions';
import MailSystem from '../../../../components/ViewComponents/MailSystem';
// import Chart from 'chart.js/auto';
// import vendorExpenseData from '../../../../data/vendorExpense.json';
import Card from '../../../../components/Cards/Card';
import { getCurrentFY } from '../../../../utils/financialYear';
// import type { RangeType } from '../../../Sales/Customers/ViewCustomer/View';
import { expenseByFY } from '../../../../data/expenseData';
import { Bar } from 'react-chartjs-2';


export type RangeType = '6M' | '12M' | 'THIS_YEAR' | 'LAST_YEAR';

// interface ExpenseData {
//   month: string;
//   expense: number;
// }

const ViewVendor: React.FC = () => {
  // const { id } = useParams<{ id: string }>();
  const [activeKey, setActiveKey] = React.useState('overview');
  // const chartRef = useRef<HTMLCanvasElement>(null);
  // const chartInstanceRef = useRef<Chart | null>(null);
  const [selectedFY, setSelectedFY] = useState<string>(getCurrentFY());
  const [range, setRange] = useState<RangeType>('12M');


  // Chart data from JSON
  // const expenseData: ExpenseData[] = vendorExpenseData as ExpenseData[];


  const expenseBarOptions = {
    responsive: true,
    maintainAspectRatio: false,

    animations: {
      duration: 600,
      easing: 'easeOutQuart',
    },

    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: any) =>
            ` ₹${Number(ctx.raw).toLocaleString()}`,
        },
      },
    },

    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0,0,0,0.08)',
        },
        ticks: {
          callback: (value: any) =>
            '₹' + Number(value).toLocaleString(),
        },
      },
      x: {
        grid: { display: false },
      },
    },
  };



  const getPreviousFY = (fy: string) => {
    const [start, end] = fy.replace('FY ', '').split('-').map(Number);
    return `FY ${start - 1}-${end - 1}`;
  };

  const getTotalLabel = () => {
    switch (range) {
      case '6M':
        return 'Last 6 Months';
      case '12M':
        return 'Last 12 Months';
      case 'THIS_YEAR':
        return 'This Financial Year';
      case 'LAST_YEAR':
        return 'Last Financial Year';
      default:
        return '';
    }
  };


  const chartData = useMemo(() => {
    const fyData = expenseByFY[selectedFY] ?? [];

    switch (range) {
      case '6M':
        return fyData.slice(-6);

      case '12M':
      case 'THIS_YEAR':
        return fyData;

      case 'LAST_YEAR': {
        const prevFY = getPreviousFY(selectedFY);
        return expenseByFY[prevFY] ?? [];
      }

      default:
        return [];
    }
  }, [selectedFY, range]);


  const expenseBarData = {
    labels: chartData.map((item) => item.month),
    datasets: [
      {
        label: 'Expenses (₹)',
        data: chartData.map((item) => item.expense),
        backgroundColor: 'rgba(220, 53, 69, 0.8)',
        borderRadius: 4,
      },
    ],
  };

  useEffect(() => {
    setRange('12M');
  }, [selectedFY]);








  const renderOverview = () => (
    <div>
      {/* ================= Payment Info ================= */}
      <div className="mb-2">
        <p style={{ color: '#5E5E5E', margin: 0, fontSize: '14px' }}>
          Payment Due Period
        </p>
        <p style={{ margin: 0, fontSize: '15px', fontWeight: 500 }}>
          Due on Receipt
        </p>
      </div>

      {/* ================= Payables ================= */}
      <h5 className="fw-bold">Payables</h5>

      <table className="table mt-3 rounded-table">
        <thead className="table-light">
          <tr>
            <th>Currency</th>
            <th>Outstanding Payables</th>
            <th>Unused Credits</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>INR - Indian Rupee</td>
            <td>₹0.00</td>
            <td>₹0.00</td>
          </tr>
        </tbody>
      </table>

      {/* ================= Expense Chart ================= */}
      <h4 className="chart-header">Vendor Expenses</h4>

      <Card
        title="Expense Overview"
        selectable
        selectedFY={selectedFY}
        onFYChange={setSelectedFY}
      >
        {/* HEADER ROW */}
        <div className="d-flex justify-content-between align-items-center mb-2">
          {/* LEFT */}
          <div className="d-flex align-items-center gap-2">
            <h6 className="fw-bold mb-0">Expenses</h6>
            <p
              className="text-muted mb-0"
              style={{ fontSize: '13px', whiteSpace: 'nowrap' }}
            >
              This chart is displayed in the organization base currency.
            </p>
          </div>

          {/* RIGHT DROPDOWNS */}
          <div className="d-flex gap-2">
            <select
              value={range}
              onChange={(e) => setRange(e.target.value as RangeType)}
              className="form-select form-select-sm"
              style={{
                color: '#0D6EFD',
                width: '150px',
                border: 'none',
                borderRight: '1px solid #D0D0D0',
                paddingRight: '12px',
              }}
            >
              <option value="6M">Last 6 Months</option>
              <option value="12M">Last 12 Months</option>
              <option value="THIS_YEAR">This Year</option>
              <option
                value="LAST_YEAR"
                disabled={!expenseByFY[getPreviousFY(selectedFY)]}
              >
                Last Year
              </option>

            </select>

            <select
              className="form-select form-select-sm"
              style={{
                width: '120px',
                color: '#0D6EFD',
                fontWeight: 500,
                border: 'none',
              }}
            >
              <option value="accrual">Accrual</option>
              <option value="cash">Cash</option>
            </select>
          </div>
        </div>

        {/* CHART */}
        <div style={{ height: 220 }}>
          {chartData.length > 0 ? (
            <Bar data={expenseBarData} options={expenseBarOptions} />
          ) : (
            <div className="text-muted text-center pt-5">
              No expense data available for selected period
            </div>
          )}
        </div>


        {/* FOOTER */}
        <p className="mt-3" style={{ fontSize: '15px' }}>
          Total Expenses ({getTotalLabel()}):{' '}
          <span className="fw-semibold text-danger">
            ₹{chartData
              .reduce((sum, item) => sum + item.expense, 0)
              .toLocaleString()}
          </span>
        </p>
      </Card>
    </div>
  );


  const renderComments = () => <CommentBox />;

  const renderTransactions = () => (
    <Transactions
      section={{
        title: 'Go to Transactions',
        children: [
          {
            title: 'Invoices',
            columns: ['Date', 'Invoice Number', 'Order Number', 'Amount', 'Balance Due', 'Status'],
            path: '/sales/add-invoice',
            emptyMessage: 'There are no invoices',
            // invoiceData <- new Invoice form
            data: [
              ['12-11-25', 'INV-587346598', 52364, '45,0000', '0', 'Paid'],
              ['03-12-25', 'INV-897487347', 31209, '20,000', '20,000', 'Over due'],
            ],
          },
          {
            title: 'Customer Payments',
            columns: [
              'Date',
              'Payment Number',
              'Reffrence Number',
              'Payment Mode',
              'Amount',
              'Unused Amount',
            ],
            path: '/add-invoice',
            emptyMessage: 'No payments have been received or recorded yet.',
            data: [],
          },
          {
            title: 'Quotes',
            columns: ['Date', 'Quotes', 'Reference Number', 'Amount', 'Status'],
            path: '/sales/add-quotes',
            emptyMessage: 'There are no quotes.',
            data: [],
          },
          {
            title: 'Sales Orders',
            columns: [
              'Date',
              'Shipment Date',
              'Reference Number',
              'Sales Order',
              'Amount',
              'Status',
            ],
            path: '/sales/add-salesOrders',
            emptyMessage: 'There are no Sales Orders.',
            data: [],
          },
          {
            title: 'Delivery Challans',
            columns: ['Date', 'Delivery Challan', 'Reference Number', 'Reference Number', 'Status'],
            path: '/sales/add-deliveryChallans',
            emptyMessage: 'There are no Delivery Challans.',
            data: [],
          },
          {
            title: 'Recurring Invoices',
            columns: [
              'Profile Name',
              'Frequency',
              'Last Invoice Date',
              'Next Invoice Date',
              'Status',
            ],
            path: '/sales/add-recurringInvoice',
            emptyMessage: 'There are no recurring invoices.',
            data: [],
          },
          {
            title: 'Expenses',
            columns: ['Date', 'Expense Category', 'Invoice Number', 'Amount', 'Status'],
            path: '/add-invoice',
            emptyMessage: 'There are no expenses.',
            data: [],
          },
          {
            title: 'Recurring Expenses',
            columns: [
              'Profile Name',
              'Expense Category',
              'Frequency',
              'Last Invoice Date',
              'Next Invoice Date',
              'Status',
            ],
            path: '/add-invoice',
            emptyMessage: 'There are no recurring expenses.',
            data: [],
          },
          {
            title: 'Journals',
            columns: ['Date', 'Journal Number', 'Reference Number', 'Debit', 'Credit'],
            path: '/add-invoice',
            emptyMessage: 'There are no journals created. ',
            data: [],
          },
          {
            title: 'Bills',
            columns: [
              'Date',
              'Bill',
              'Order Number',
              'Vendor Name',
              'Amount',
              'Customer associated Line Items total',
              'Balance Due',
            ],
            path: '/add-invoice',
            emptyMessage: 'There are no Bills.',
            data: [],
          },
          {
            title: 'Credit Notes',
            columns: [
              'Date',
              'Credit Note Number',
              'Reference Number',
              'Reference Number',
              'Status',
            ],
            path: '/sales/add-creditNote',
            emptyMessage: 'There are no Credit Note created.',
            data: [],
          },
        ],
      }}
    />
  );

  const renderMails = () => <MailSystem />;

  const renderStatements = () => {
    return (
      <div className="statement-container">

        {/* TOP CONTROLS */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          {/* LEFT: DROPDOWNS */}
          <div className="d-flex gap-2">
            <select
              className="form-select form-select-sm"
              style={{ width: 170 }}
            >
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
              <option>This Quarter</option>
              <option>This Year</option>
              <option>Yesterday</option>
              <option>Previous Week</option>
              <option>Previous Month</option>
              <option>Previous Quarter</option>
              <option>Previous Year</option>
              <option>Custom</option>
            </select>

            <select
              className="form-select form-select-sm"
              style={{ width: 140 }}
            >
              <option>Filter By: All</option>
              <option>Bills</option>
              <option>Payments</option>
              <option>Credits</option>
            </select>
          </div>

          {/* RIGHT: DOWNLOAD */}
          <button
            className="btn px-4"
            style={{ background: '#7991BB', color: '#FFF', fontSize: 14 }}
          >
            Download Statement
          </button>
        </div>

        {/* TITLE */}
        <div className="text-center mb-4">
          <h5 className="fw-bold mb-1">Vendor Statement</h5>
          <p className="text-muted mb-0">
            From 01/01/2026 to 31/01/2026
          </p>
        </div>

        {/* STATEMENT BODY */}
        <div className="statement-paper">
          {/* You can reuse StatementPreview later if needed */}
          <div className="text-center text-muted py-5">
            Vendor statement content will appear here.
          </div>
        </div>
      </div>
    );
  };


  const tabs = [
    { key: 'overview', label: 'Overview', content: renderOverview() },
    { key: 'comments', label: 'Comments', content: renderComments() },
    { key: 'transactions', label: 'Transactions', content: renderTransactions() },
    { key: 'mails', label: 'Mails', content: renderMails() },
    { key: 'statements', label: 'Statements', content: renderStatements() },
  ];

  const activeContent = tabs.find((t) => t.key === activeKey)?.content;

  return (
    <>
      <Header />

      <div className="container-fluid ">
        <div className="sales-orders-page" style={{ paddingTop: 39 }}>
          {/* Tabs Header */}
          <Tabs tabs={tabs} defaultActiveKey="overview" onChange={(key) => setActiveKey(key)} />

          <div className="row mt-4">
            {/* LEFT STATIC CARD */}
            <div className="col-md-3 pe-0">
              <div className="customer-card shadow-sm p-3">
                <div className="text-center mb-3">
                  <div
                    className="rounded-circle bg-secondary"
                    style={{ width: 70, height: 70, margin: 'auto' }}
                  ></div>
                  <h5 className="mt-2 fw-semibold">Mr. Ram</h5>
                </div>

                <div className="mb-3">
                  <div className="section-title">Address</div>

                  <div className="section-box">
                    <p>
                      Billing Address: <span className="text-primary">New Address</span>
                    </p>
                    <p>
                      Shipping Address: <span className="text-primary">New Address</span>
                    </p>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="section-title">Other Details</div>

                  <div className="section-box">
                    <p>Customer Type: Individual</p>
                    <p>Default Currency: INR</p>
                    <p>Portal Status: Disabled</p>
                    <p>Portal Language: English</p>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="section-title">Contact</div>

                  <div className="section-box">
                    <p className="text-muted">No contact details</p>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="section-title">Record Info</div>

                  <div className="section-box">
                    <p>Customer ID: 34</p>
                    <p>Created On: 23/06/2025</p>
                    <p>Created By: Admin</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT DYNAMIC CARD */}
            <div className="col-md-9">
              <div
                className="customer-card shadow-sm"
                style={{ padding: activeKey === 'mails' ? 0 : '1.5rem' }}
              >
                {activeContent}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewVendor;
