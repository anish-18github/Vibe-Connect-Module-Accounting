import React, { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/Header/Header';
import Navbar from '../../../components/Navbar/NavBar';
import DynamicTable from '../../../components/Table/DynamicTable';
import { useGlobalToast } from '../../../components/Toast/ToastContext';
import PublishedWithChangesOutlinedIcon from '@mui/icons-material/PublishedWithChangesOutlined';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
// import { Edit } from 'react-feather';
import { salesTabs } from '../Customers/Customers';
import { dashboardTabs } from '../../Dashboard/dashboard';
import api from '../../../services/api/apiConfig';
import { useLoading } from '../../../Contexts/Loadingcontext';
import Toast from '../../../components/Toast/Toast';

interface Quote {
  id: number;
  date: string;
  quoteNumber: string;
  referenceNumber: string;
  customerName: string;
  status: string;
  expiredOn: string;
  createdBy: string;
  amount: number;
  customerId: number;
  salesPersonName: string;
  quoteDate: string;
  expiryDate: string;
  projectName: string;
  customerNotes?: string;
  termsAndConditions?: string;
  items: Array<{
    description: string;
    quantity: number;
    rate: number;
    taxRate?: number;
  }>;
}

const Quotes = () => {
  const navigate = useNavigate();
  const { toast, setToast } = useGlobalToast();
  const { showLoading, hideLoading } = useLoading();

  const [quotes, setQuotes] = React.useState<Quote[]>([]);
  const [loading, setLoading] = React.useState(true);

  // ✅ Status badge style
  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'sent': return { bg: '#e0f0ff', color: '#1d4ed8' };
      case 'draft': return { bg: '#e6f9ed', color: '#15803d' };
      case 'expired': return { bg: '#fde8e8', color: '#b91c1c' };
      case 'accepted': return { bg: '#fff7db', color: '#a16207' };
      default: return { bg: '#f3f4f6', color: '#374151' };
    }
  };

  // ✅ FIXED Columns (CSS fix)
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
              backgroundColor: bg, color, padding: '4px 10px',
              borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600,
              textTransform: 'capitalize', display: 'inline-block',
              minWidth: '80px', textAlign: 'center',
            }}
          >
            {value}
          </span>
        );
      },
    },
    { key: 'expiredOn', label: 'Expire On' },
    {
      key: 'amount',
      label: 'Amount',
      render: (value: number) => (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px', whiteSpace: 'nowrap' }}>
          <span style={{ fontSize: '0.8rem', color: '#6c757d' }}>₹</span>
          <span style={{ fontWeight: 600 }}>
            {value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      ),
    },
    {
      key: 'createdBy',
      label: 'Created By',
      render: (value: string) => (
        <div style={{ display: 'flex', justifyContent: 'flex-end', whiteSpace: 'nowrap' }}>
          {value}
        </div>
      ),
    },
  ];

  // ✅ PERFECT useEffect with LoadingContext
  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        showLoading();
        const response = await api.get<Quote[]>('quotes/');
        setQuotes(response.data);
      } catch (error: any) {
        setToast({
          stage: 'enter',
          type: 'error',
          message: error.response?.data?.detail || 'Unable to load quotes',
        });
      } finally {
        hideLoading();
        setLoading(false);
      }
    };
    fetchQuotes();
  }, []);

  // ✅ FIXED: Proper useCallback handlers
  const handleViewQuote = useCallback((row: Quote) => {
    navigate(`/sales/view-quote/${row.id}`);
  }, [navigate]);

  const handleEditQuote = useCallback((row: Quote) => {
    navigate(`/sales/edit-quote/${row.id}`);
  }, [navigate]);

  // ✅ QUOTE → SALES ORDER: Complete data transfer
  const handleQuoteConversion = useCallback(async (row: Quote) => {
    // ✅ VALIDATION: Only ACCEPTED quotes
    const quoteStatus = row.status?.toLowerCase();

    if (quoteStatus !== 'accepted') {
      setToast({
        stage: 'enter',
        type: 'warning',
        message: `Only ACCEPTED quotes can be converted.`,
      });
      return;
    }

    try {
      showLoading();

      // ✅ FETCH FULL QUOTE DETAILS
      const response = await api.get(`/quotes/${row.id}/`);
      const fullQuote = response.data;

      const quoteState = {
        fromQuote: true,

        quoteData: {
          customerId: fullQuote.customer,
          customerName: fullQuote.customerName,
          referenceNumber: fullQuote.reference_number,
          salesPerson: fullQuote.sales_person,
          salesOrderDate: fullQuote.quote_date,
          expectedShipmentDate: fullQuote.quote_date,
          // paymentTerms: 'Net 30',
          deliveryMethod: 'Courier',
          customerNotes: fullQuote.customer_notes,
          termsAndConditions: fullQuote.terms_and_conditions,

          // ✅ NEW
          subtotal: fullQuote.subtotal,
          adjustment: fullQuote.adjustment,
          taxes: fullQuote.taxes || [],
          grandTotal: fullQuote.grand_total,
        },

        quoteItems: fullQuote.items.map((item: any) => ({
          description: item.item_details,
          quantity: parseFloat(item.quantity),
          rate: parseFloat(item.rate),
        })),
      };


      console.log('🚀 Passing quote data:', quoteState);
      navigate(`/sales/add-salesOrders`, { state: quoteState });
    } catch (error: any) {
      console.error('Failed to fetch quote:', error);
      setToast({
        stage: 'enter',
        type: 'error',
        message: 'Failed to load quote details',
      });
    } finally {
      hideLoading();
    }
  }, [navigate, setToast, showLoading, hideLoading]);



  // ✅ FIXED: All actions are FUNCTIONS
  const actions = [
    {
      icon: <PublishedWithChangesOutlinedIcon sx={{ fontSize: 20 }} />,
      onClick: handleQuoteConversion,
      tooltip: 'Convert to Sales Order',
    },
    {
      icon: <RemoveRedEyeOutlinedIcon sx={{ fontSize: 20 }} />,
      onClick: handleViewQuote,
      tooltip: 'View Quote',
    },
    // {
    //   icon: <Edit size={18} />,
    //   onClick: handleEditQuote,
    //   tooltip: 'Edit Quote',
    // },
  ];

  return (
    <>
      {/* ✅ Toast handled by App.tsx - REMOVED duplicate */}
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
            actions={actions}
            rowsPerPage={10}
            onAdd={() => navigate('/sales/add-quotes')}
          />
        </div>
      </div>
    </>
  );
};

export default Quotes;
