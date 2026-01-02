import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../../../components/Header/Header';
import Tabs from '../../../../components/Tab/Tabs';

import './viewCustomer.css';

// import { Bold } from "react-feather";
import CommentBox from '../../../../components/ViewComponents/CommentBox';
import Transactions from '../../../../components/ViewComponents/Transactions';
import MailSystem from '../../../../components/ViewComponents/MailSystem';

import customerIncomeData from '../../../../data/customerIncomes.json';
import Chart from 'chart.js/auto';
import api from '../../../../services/api/apiConfig';
import { Mail, Phone } from 'react-feather';
// import Card from "../../../../components/Cards/Card";

interface Customer {
  id: number;
  name: string;
  email: string;
}


interface IncomeData {
  month: string;
  income: number;
}

const ViewCustomer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeKey, setActiveKey] = React.useState('overview');
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);
  const [customer, setCustomer] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);


  const IncomeData: IncomeData[] = customerIncomeData as IncomeData[];

  // Create chart on mount and cleanup
  useEffect(() => {
    if (chartRef.current && IncomeData.length > 0) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        // Destroy existing chart if it exists
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
        }

        chartInstanceRef.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: IncomeData.map((item) => item.month),
            datasets: [
              {
                label: 'Expenses (₹)',
                data: IncomeData.map((item) => item.income),
                backgroundColor: 'rgba(13, 110, 253, 0.8)',
                borderColor: 'rgba(13, 110, 253, 1)',
                borderWidth: 1,
                borderRadius: 4,
                borderSkipped: false,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: function (value) {
                    return '₹' + (value as number).toLocaleString();
                  },
                },
                grid: {
                  color: 'rgba(0,0,0,0.1)',
                },
              },
              x: {
                grid: {
                  display: false,
                },
              },
            },
          },
        });
      }
    }

    // Cleanup function
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [IncomeData]);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await api.get<Customer>(`sales/customers/${id}/`);
        setCustomer(res.data);
      } catch (error) {
        console.error('Failed to fetch customer', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCustomer();
  }, [id]);


  // ---------------- TAB CONTENT -----------------

  // Overview Tab
  const renderOverview = () => (
    <div>
      <div className="mb-2">
        <p style={{ color: '#5E5E5E', margin: 0, fontSize: '14px' }}>Payment Due Period</p>
        <p style={{ margin: 0, fontSize: '15px', fontWeight: 500 }}>Due on Receipt</p>
      </div>

      <h5 className="fw-bold">Receivables</h5>

      <table className="table mt-3 rounded-table">
        <thead className="table-light">
          <tr>
            <th>Currency</th>
            <th>Outstanding Receivables</th>
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

      <h4 className="chart-header">Enter Opening Balance</h4>

      <div className="border rounded p-3 chart-container" style={{ background: '#FFFFFF' }}>
        {/* ROW: Income + helper text + dropdowns */}
        <div className="d-flex justify-content-between align-items-center">
          {/* LEFT SIDE TEXT */}
          <div className="d-flex align-items-center gap-2">
            <h6 className="fw-bold mb-0">Income</h6>
            <p className="text-muted mb-0" style={{ fontSize: '13px', whiteSpace: 'nowrap' }}>
              This chart is displayed in the organization base currency.
            </p>
          </div>

          {/* RIGHT SIDE DROPDOWNS */}
          <div className="d-flex gap-2">
            {/* Last 6 months dropdown */}
            <select
              className="form-select form-select-sm"
              style={{
                color: '#0D6EFD',
                width: '150px',
                border: 'none',
                borderRight: '1px solid #D0D0D0',
                paddingRight: '12px',
              }}
            >
              <option>Last 6 Months</option>
              <option>Last 12 Months</option>
              <option>This Year</option>
              <option>Last Year</option>
            </select>

            {/* Accrual dropdown (blue text) */}
            <select
              className="form-select form-select-sm"
              style={{
                width: '120px',
                color: '#0D6EFD',
                fontWeight: 500,
                border: 'none',
                paddingLeft: '12px',
              }}
            >
              <option value="accrual">Accrual</option>
              <option value="cash">Cash</option>
            </select>
          </div>
        </div>

        {/* CHART AREA - Updated with Canvas */}
        <div style={{ height: 200, position: 'relative' }}>
          <canvas ref={chartRef}></canvas>
        </div>
      </div>

      <p className="mt-3" style={{ fontSize: '15px' }}>
        Total Income (Last 6 Months): <span className="fw-semibold">₹52,500</span>
      </p>
    </div>
  );

  // Commenet Tab
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

  const renderStatements = () => <div>Statements content…</div>;

  const tabs = [
    { key: 'overview', label: 'Overview', content: renderOverview() },
    { key: 'comments', label: 'Comments', content: renderComments() },
    { key: 'transactions', label: 'Transactions', content: renderTransactions() },
    { key: 'mails', label: 'Mails', content: renderMails() },
    { key: 'statements', label: 'Statements', content: renderStatements() },
  ];

  const activeContent = tabs.find((t) => t.key === activeKey)?.content;

  // const billingAddress = customer?.addresses?.find(
  //   (a: any) => a.address_type === 'billing'
  // );

  // const shippingAddress = customer?.addresses?.find(
  //   (a: any) => a.address_type === 'shipping'
  // );


  if (loading) {
    return (
      <>
        <Header />
        <div className="container-fluid p-4">Loading customer details…</div>
      </>
    );
  }


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

                {/* ================= Profile ================= */}
                <div className="text-center mb-3">
                  <div
                    className="rounded-circle bg-secondary"
                    style={{ width: 70, height: 70, margin: "auto" }}
                  ></div>

                  <h5 className="mt-2 fw-normal" style={{ fontSize: 16 }}>
                    {customer?.salutation} {customer?.first_name} {customer?.last_name}
                  </h5>
                </div>

                {/* ================= Address ================= */}
                <div className="mb-3">
                  <div className="section-title">Billing Address</div>

                  <div className="section-box">
                    <p>
                      Address:{' '}
                      <span className="text-primary">
                        {customer?.address
                          ? `${customer.address.address1}, ${customer.address.city}, ${customer.address.state} - ${customer.address.zip_code}`
                          : "—"}
                      </span>
                    </p>

                    <p>
                      Country:{' '}
                      <span className="text-primary">
                        {customer?.address?.country || "—"}
                      </span>
                    </p>

                    <p>
                      Phone:{' '}
                      <span className="text-primary">
                        {customer?.address?.phone_number || "—"}
                      </span>
                    </p>
                  </div>
                </div>

                {/* ================= Other Details ================= */}
                <div className="mb-3">
                  <div className="section-title">Other Details</div>

                  <div className="section-box">
                    <p>Customer Type: {customer?.customer_type}</p>
                    <p>Default Currency: {customer?.currency}</p>
                    <p>Portal Language: {customer?.portal_language}</p>
                  </div>
                </div>

                {/* ================= Contacts ================= */}
                <div className="mb-3">
                  <div className="section-title">Contact Persons</div>

                  <div className="section-box">
                    {customer?.contacts?.length ? (
                      customer.contacts.map((c: any, index: number) => (
                        <div key={index} className="mb-2">
                          <strong>
                            {c.salutation} {c.first_name} {c.last_name}
                          </strong>
                          <div className="text-muted ">
                            {c.designation || "—"} • {c.department || "—"}
                          </div>
                          <div className="contact-rows">
                            <Phone size={ 14 } /> {c.phone || "—"} <br />
                            <Mail size={ 14 }/> {c.email || "—"}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted mb-0">No contact details</p>
                    )}
                  </div>
                </div>

                {/* ================= Record Info ================= */}
                <div className="mb-3">
                  <div className="section-title">Record Info</div>

                  <div className="section-box">
                    <p>Customer ID: {customer?.id}</p>
                    <p>
                      Created On:{" "}
                      {customer?.created_on
                        ? new Date(customer.created_on).toLocaleDateString()
                        : "—"}
                    </p>
                    <p>Created By: {customer?.created_by_name || "System"}</p>
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
};

export default ViewCustomer;
