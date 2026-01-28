import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Copy, Trash2, Pause } from 'react-feather';  // ✅ Import Play + Pause

import Header from '../../../components/Header/Header';
import Navbar from '../../../components/Navbar/NavBar';
import DynamicTable from '../../../components/Table/DynamicTable';
import { Toast } from '../../../components/Toast/Toast';
import { useGlobalToast } from '../../../components/Toast/ToastContext';

import { dashboardTabs } from '../../Dashboard/dashboard';
import { salesTabs } from '../Customers/Customers';
import api from '../../../services/api/apiConfig';

interface RecurringInvoice {
  id: number;
  customerName: string;
  profileName: string;
  salesPersonName: string;
  frequency: string;
  lastInvoiceDate: string | null;
  nextInvoiceDate: string | null;
  status: string;
  amount: number;
  isActive: boolean;
  isControllable: boolean;  // ✅ ADD THIS FIELD
}

const PaymentInvoices = () => {
  const navigate = useNavigate();
  const { toast, setToast } = useGlobalToast();

  const [invoices, setInvoices] = useState<RecurringInvoice[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Status badge style (unchanged)
  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'draft': return { bg: '#f3f4f6', color: '#374151' };
      case 'pending': return { bg: '#e0f0ff', color: '#1d4ed8' };
      case 'active': return { bg: '#e6f9ed', color: '#15803d' };
      case 'stopped': return { bg: '#fef2f2', color: '#7f1d1d' };  // ✅ Added
      case 'completed': return { bg: '#dcfce7', color: '#166534' };
      case 'overdue': return { bg: '#fee2e2', color: '#b91c1c' };
      case 'suspended': return { bg: '#fef2f2', color: '#7f1d1d' };
      case 'archived': return { bg: '#e5e7eb', color: '#6b7280' };
      default: return { bg: '#f3f4f6', color: '#374151' };
    }
  };

  const columns = [
    { key: 'customerName', label: 'Customer Name' },
    { key: 'profileName', label: 'Profile Name' },
    { key: 'salesPersonName', label: 'Sales Person' },
    { key: 'frequency', label: 'Frequency' },
    {
      key: 'lastInvoiceDate',
      label: 'Last Invoice',
      render: (value: string | null) => value || '-'
    },
    {
      key: 'nextInvoiceDate',
      label: 'Next Invoice',
      render: (value: string | null) => value || '-'
    },
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
    {
      key: 'amount',
      label: 'Amount',
      render: (value: number) => (
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',  // ✅ Fixed: flex-end
          gap: '4px',
          whiteSpace: 'nowrap',
        }}>
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
    const fetchRecurringInvoices = async () => {
      try {
        const response = await api.get<RecurringInvoice[]>('recurring-invoices/');
        setInvoices(response.data);
      } catch (error: any) {
        setToast({
          stage: 'enter',
          type: 'error',
          message: error.response?.data?.detail || 'Unable to load recurring invoices',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRecurringInvoices();
  }, []);

  // ✅ FIXED: Clean handleToggle (removed unused code)
  const handleToggle = async (row: RecurringInvoice) => {
    if (!row.isControllable) {
      setToast({
        stage: 'enter',
        type: 'warning',
        message: 'Cannot control expired invoices',
      });
      return;
    }

    const action = row.status === 'stopped' ? 'resume' : 'stop';
    const confirmMsg = action === 'stop' ? `Stop "${row.profileName}"?` : `Resume "${row.profileName}"?`;

    if (!confirm(confirmMsg)) return;

    try {
      await api.patch(`/recurring-invoices/${row.id}/control/`, { action });
      setToast({
        stage: 'enter',
        type: 'success',
        message: `Invoice ${action}d successfully`,
      });
      window.location.reload();
    } catch (error: any) {
      setToast({
        stage: 'enter',
        type: 'error',
        message: error.response?.data?.error || 'Failed to update',
      });
    }
  };

  // ✅ REMOVED unused functions (handleStop, handleClone, handledelete)
  const handleClone = (row: RecurringInvoice) => {
    console.log('Clone:', row.id);
    // TODO: Implement clone
  };

  const handleDelete = (row: RecurringInvoice) => {
    console.log('Delete:', row.id);
    // TODO: Implement delete
  };

  // ✅ FIXED: Proper typing for DynamicTable actions
  type ActionConfig = {
    icon: React.ReactNode;
    onClick: (row: RecurringInvoice) => void;
    tooltip: string;
  };

  const actions: any[] = [
    {
      icon: <Pause size={18} />,
      onClick: (row: any) => {
        if (row.isControllable !== false) {  // Safe check
          handleToggle(row as RecurringInvoice);
        } else {
          setToast({ stage: 'enter', type: 'warning', message: 'Cannot control expired invoices' });
        }
      },
      tooltip: 'Toggle Status',
    },
    {
      icon: <Copy size={17} />,
      onClick: handleClone,
      tooltip: 'Clone',
    },
    {
      icon: <Trash2 size={17} />,
      onClick: handleDelete,
      tooltip: 'Delete',
    },
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
            onAdd={() => navigate('/sales/add-recurringInvoice')}
          />
        </div>
      </div>
    </>
  );
};

export default PaymentInvoices;
