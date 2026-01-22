import { useNavigate } from 'react-router-dom';
import DynamicTable from '../../../components/Table/DynamicTable';
import { useState, useEffect } from 'react';
import Header from '../../../components/Header/Header';
import Navbar from '../../../components/Navbar/NavBar';
import { dashboardTabs } from '../../Dashboard/dashboard';
import { salesTabs } from '../Customers/Customers';
import useFormSuccess from '../../../components/Toast/useFormSuccess';
import { Toast } from '../../../components/Toast/Toast';
import { useGlobalToast } from '../../../components/Toast/ToastContext';
import api from '../../../services/api/apiConfig';
import RestorePageOutlinedIcon from '@mui/icons-material/RestorePageOutlined';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';

interface CreditNote {
  id: number;
  date: string;
  reference: string;
  customerName: string;
  invoiceNumber: string;
  status: string;
  amount: number;
  balance: number;
}



const CreditNote = () => {
  const navigate = useNavigate();
  const { toast, setToast } = useGlobalToast();
  const [loading, setLoading] = useState(true);
  const [creditNotes, setCreditNotes] = useState<CreditNote[]>([]);




  // ✅ NEW: Action handlers
  const handleRefund = (row: any) => {
    console.log('Refund clicked for:', row);
    // Navigate to refund form
    navigate(`/sales/credit-note/${row.id}/refund`);
  };

  const handleView = (row: any) => {
    navigate(`/sales/credit-note/${row.id}`);
  };

  // const handleEdit = (row: any) => {
  //   if (row.status === 'draft') {
  //     navigate(`/sales/edit-credit-note/${row.id}`);
  //   } else {
  //     toast({ type: 'warning', message: 'Only draft credit notes can be edited' });
  //   }
  // };

  // ✅ Define actions array
  const actions = [
    {
      icon: <RemoveRedEyeOutlinedIcon sx={{ fontSize: 20 }} />,
      onClick: handleView,
      tooltip: 'View Details',
    },
    {
      icon: <RestorePageOutlinedIcon sx={{ fontSize: 20 }} />, // Add DollarSign from react-feather
      onClick: handleRefund,
      tooltip: 'Record Refund',
    },
  ];




  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'open':
        return { bg: '#e0f0ff', color: '#1d4ed8' };
      case 'draft':
        return { bg: '#e6f9ed', color: '#15803d' };
      case 'closed':
        return { bg: '#fde8e8', color: '#285766' };
      default:
        return { bg: '#f3f4f6', color: '#374151' };
    }
  };

  useFormSuccess();
  const columns = [
    { key: 'date', label: 'Date' },
    { key: 'reference', label: 'Reference' },
    { key: 'customerName', label: 'Customer Name' },
    { key: 'invoiceNumber', label: 'Invoice' },
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
              minWidth: '80px',
              display: 'inline-block',
              textAlign: 'center',
            }}
          >
            {value}
          </span>
        );
      },
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (value: number) => (
        <div style={{ display: 'flex', gap: '4px', whiteSpace: 'nowrap' }}>
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
    {
      key: 'balance', label: 'Balance',
      render: (value: number) => (
        <div style={{ display: 'flex', gap: '4px', whiteSpace: 'nowrap' }}>
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


  useEffect(() => {
    const fetchCreditNote = async () => {
      try {
        const response = await api.get<CreditNote[]>('credit-notes/');
        // console.log(response);

        setCreditNotes(response.data);
      } catch (error: any) {
        setToast({
          stage: 'enter',
          type: 'error',
          message:
            error.response?.data?.detail || 'Unable to load credit notes',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCreditNote();
  }, []);


  return (
    <>
      <Toast toast={toast} setToast={setToast} />
      <Header />

      <div style={{ padding: '56px 0px 0px' }}>
        <Navbar tabs={dashboardTabs} />
        <Navbar tabs={salesTabs} />

        <div className=" mt-3">
          <DynamicTable
            columns={columns}
            data={creditNotes}
            loading={loading}
            actions={actions}
            rowsPerPage={10}
            onAdd={() => navigate('/sales/add-creditNote')} //May be change it latter. "/add-customer"
            onView={handleView}
          />
        </div>
      </div>
    </>
  );
};

export default CreditNote;
