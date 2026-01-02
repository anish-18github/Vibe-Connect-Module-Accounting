import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Header from '../../../components/Header/Header';
import Navbar from '../../../components/Navbar/NavBar';
import DynamicTable from '../../../components/Table/DynamicTable';
import { Toast } from '../../../components/Toast/Toast';
import { useGlobalToast } from '../../../components/Toast/ToastContext';

import { salesTabs } from '../Customers/Customers';
import { dashboardTabs } from '../../Dashboard/dashboard';
import api from '../../../services/api/apiConfig';

interface Quote {
  quoteId: number;
  date: string;
  quoteNumber: string;
  referenceNumber: string;
  customerName: string;
  status: string;
  expiredOn: string;
  createdBy: string;
  amount: number;
}

const Quotes = () => {
  const navigate = useNavigate();
  const { toast, setToast } = useGlobalToast();

  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Status badge style (unchanged)
  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'sent':
        return { bg: '#e0f0ff', color: '#1d4ed8' };
      case 'draft':
        return { bg: '#e6f9ed', color: '#15803d' };
      case 'expired':
        return { bg: '#fde8e8', color: '#b91c1c' };
      case 'accepted':
        return { bg: '#fff7db', color: '#a16207' };
      default:
        return { bg: '#f3f4f6', color: '#374151' };
    }
  };

  const columns = [
    { key: 'date', label: 'Date' },
    { key: 'quoteNumber', label: 'Quote Number' },
    { key: 'referenceNumber', label: 'Reference Number' },
    { key: 'customerName', label: 'Customer Name' },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => {
        const { bg, color } = getStatusStyle(value);
        return (
          <span
            style={{
              backgroundColor: bg,
              color,
              padding: '4px 10px',
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'capitalize',
              display: 'inline-block',
              minWidth: '80px',
              textAlign: 'center',
            }}
          >
            {value}
          </span>
        );
      },
    },
    { key: 'expiredOn', label: 'Expire On' },
    { key: 'createdBy', label: 'Created By' },
    {
      key: 'amount',
      label: 'Amount',
      render: (value: number) => (
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '4px',
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ fontSize: '0.8rem', color: '#6c757d' }}>₹</span>
          <span style={{ fontWeight: 600 }}>
            {value.toLocaleString('en-IN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
      ),
    },
  ];

  // ✅ Same loading logic as Customers
  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const response = await api.get<Quote[]>('sales/quotes/');
        setQuotes(response.data);
      } catch (error: any) {
        setToast({
          stage: 'enter',
          type: 'error',
          message:
            error.response?.data?.detail || 'Unable to load quotes',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
  }, []);

  // ✅ View handler (same idea as customer view)
  const handleViewQuote = (row: Quote) => {
    navigate(`/sales/view-quote/${row.quoteId}`);
  };

  return (
    <>
      <Toast toast={toast} setToast={setToast} />
      <Header />

      <div style={{ padding: '56px 0px 0px' }}>
        <Navbar tabs={dashboardTabs} />
        <Navbar tabs={salesTabs} />

        <div className="mt-3">
          <DynamicTable
            columns={columns}
            data={quotes}
            loading={loading}
            actions
            rowsPerPage={10}
            onAdd={() => navigate('/sales/add-quotes')}
            onView={handleViewQuote}
          />
        </div>
      </div>
    </>
  );
};

export default Quotes;
