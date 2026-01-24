import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/Header/Header';
import Navbar from '../../../components/Navbar/NavBar';
import DynamicTable from '../../../components/Table/DynamicTable';
import { dashboardTabs } from '../../Dashboard/dashboard';
import { salesTabs } from '../Customers/Customers';
import useFormSuccess from '../../../components/Toast/useFormSuccess';
import { useGlobalToast } from '../../../components/Toast/ToastContext';
import { useLoading } from '../../../Contexts/Loadingcontext';
import api from '../../../services/api/apiConfig';
import RequestQuoteOutlinedIcon from '@mui/icons-material/RequestQuoteOutlined';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { Edit } from 'react-feather';
import Toast from '../../../components/Toast/Toast';

interface Invoice {
  id: number;
  invoiceNumber: string;
  date: string;
  dueDate: string | null;
  orderNumber: string;
  customerName: string;
  salesPersonName: string;
  status: string;
  amount: number;
}

const Invoices = () => {
  const navigate = useNavigate();
  const { toast, setToast } = useGlobalToast();
  const { showLoading, hideLoading } = useLoading();
  useFormSuccess();

  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'sent': return { bg: '#e0f0ff', color: '#1d4ed8' };
      case 'draft': return { bg: '#e6f9ed', color: '#15803d' };
      case 'expired': return { bg: '#fde8e8', color: '#b91c1c' };
      case 'accepted': return { bg: '#fff7db', color: '#a16207' };
      default: return { bg: '#f3f4f6', color: '#374151' };
    }
  };

  const columns = [
    { key: 'date', label: 'Date' },
    { key: 'invoiceNumber', label: 'Invoice' },
    { key: 'orderNumber', label: 'Order Number' },
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
              textTransform: 'capitalize', minWidth: '80px',
              display: 'inline-block', textAlign: 'center',
            }}
          >
            {value}
          </span>
        );
      },
    },
    { key: 'dueDate', label: 'Due Date' },
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
  ];

  // ✅ FIXED: Empty deps array (like Quotes/SalesOrders)
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        showLoading();
        const response = await api.get<Invoice[]>('invoices/');
        setInvoices(response.data);
      } catch (error: any) {
        setToast({
          stage: 'enter',
          type: 'error',
          message: error.response?.data?.detail || 'Unable to load invoices',
        });
      } finally {
        hideLoading();
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  // ✅ INVOICE → CREDIT NOTE Conversion
  const handleCreditNoteConversion = useCallback(async (row: Invoice) => {
    try {
      showLoading();

      // ✅ NEW: Check if Credit Note already exists for this Invoice
      const creditNoteCheck = await api.get(`credit-notes/?reference_invoice=${row.id}`);

      if (creditNoteCheck.data.length > 0) {
        hideLoading();
        setToast({
          stage: 'enter',
          type: 'warning',
          message: `Credit Note already exists for Invoice ${row.invoiceNumber}: ${creditNoteCheck.data[0].creditNoteNumber}`,
        });
        return; // ✅ STOP - Don't navigate
      }

      // ✅ FETCH FULL Invoice details (if no existing Credit Note)
      const response = await api.get(`/invoices/${row.id}/`);
      const fullInvoice = response.data;

      const invoiceState = {
        fromInvoice: true,
        invoiceData: {
          customerId: fullInvoice.customer,
          customerName: fullInvoice.customerName,
          referenceNo: row.orderNumber || fullInvoice.sales_order_number || '-',
          salesperson: fullInvoice.sales_person,
          creditDate: new Date().toISOString().split('T')[0],
          paymentTerm: fullInvoice.payment_terms || 'Net 30',
          subject: `Credit Note for Invoice ${fullInvoice.invoice_number}`,
          notes: fullInvoice.customer_notes,
          terms: fullInvoice.terms_and_conditions,
        },
        invoiceItems: fullInvoice.items.map((item: any) => ({
          description: item.item_details,
          quantity: parseFloat(item.quantity),
          rate: parseFloat(item.rate),
          taxRate: 0,
        })),
        invoiceNumber: row.invoiceNumber,
        invoiceId: row.id,
      };

      console.log('🚀 Passing Invoice data:', invoiceState);
      navigate(`/sales/add-creditNote`, { state: invoiceState });
    } catch (error: any) {
      console.error('Failed to fetch Invoice:', error);
      if (error.response?.status !== 404) { // Don't show error for no credit notes
        setToast({
          stage: 'enter',
          type: 'error',
          message: 'Failed to load Invoice details',
        });
      }
    } finally {
      hideLoading();
    }
  }, [navigate, setToast, showLoading, hideLoading]);

  const actions = [
    {
      icon: <RequestQuoteOutlinedIcon sx={{ fontSize: 20 }} />,
      onClick: handleCreditNoteConversion,
      tooltip: 'Convert to Credit Note',
    },
    {
      icon: <RemoveRedEyeOutlinedIcon sx={{ fontSize: 20 }} />,
      onClick: (row: Invoice) => navigate(`/sales/view-invoice/${row.id}`),
      tooltip: 'View Details',
    },
    // {
    //   icon: <Edit size={18} />,
    //   onClick: (row: Invoice) => navigate(`/sales/edit-invoice/${row.id}`),
    //   tooltip: 'Edit Invoice',
    // },
  ];

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
            data={invoices}
            loading={loading}
            actions={actions}
            rowsPerPage={10}
            onAdd={() => navigate('/sales/add-invoice')}
          />
        </div>
      </div>
    </>
  );
};

export default Invoices;
