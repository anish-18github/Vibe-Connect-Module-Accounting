import React, { useEffect, useState } from 'react';  // ✅ Fixed React import
import { useNavigate } from 'react-router-dom';
import { Play, Pause, Copy, Trash2 } from 'react-feather';
import {
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  Button, Alert as MuiAlert, Slide, Snackbar
} from '@mui/material';
import type { ForwardedRef } from 'react';
import type { TransitionProps as MuiTransitionProps } from '@mui/material/transitions';

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
  isControllable: boolean;
}

// ✅ Fixed TransitionProps type
const Transition = React.forwardRef(function Transition(
  props: MuiTransitionProps & {
    children: React.ReactElement;
  },
  ref: ForwardedRef<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

Transition.displayName = 'ToggleTransition';

interface ToggleDialogState {
  open: boolean;
  invoice: RecurringInvoice | null;
}

const PaymentInvoices = () => {
  const navigate = useNavigate();
  const { toast, setToast } = useGlobalToast();
  const [invoices, setInvoices] = useState<RecurringInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggleDialog, setToggleDialog] = useState<ToggleDialogState>({ open: false, invoice: null });
  const [successAlert, setSuccessAlert] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const isControllable = (status: string): boolean => {
    return ['active', 'stopped'].includes(status?.toLowerCase() || '');
  };

  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'draft': return { bg: '#f3f4f6', color: '#374151' };
      case 'pending': return { bg: '#e0f0ff', color: '#1d4ed8' };
      case 'active': return { bg: '#e6f9ed', color: '#15803d' };
      case 'stopped': return { bg: '#fef2f2', color: '#7f1d1d' };
      case 'completed': return { bg: '#dcfce7', color: '#166534' };
      case 'overdue': return { bg: '#fee2e2', color: '#b91c1c' };
      case 'suspended': return { bg: '#fef2f2', color: '#7f1d1d' };
      case 'archived': return { bg: '#e5e7eb', color: '#6b7280' };
      default: return { bg: '#f3f4f6', color: '#374151' };
    }
  };

  // ✅ SMOOTH ANIMATED TOGGLE ICON
  const AnimatedToggleIcon = ({ status }: { status: string }) => {
    const isPlaying = status !== 'stopped';

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 32,
          height: 32,
          borderRadius: '6px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          // background: isPlaying ? 'rgba(255, 152, 0, 0.1)' : 'rgba(76, 175, 80, 0.1)',
          transform: isPlaying ? 'rotate(0deg)' : 'rotate(180deg)',
        }}
      >
        {/* {isPlaying ? <Pause size={18} /> : <Play size={18} />} */}
        <div style={{ padding: '2px' }}> {/* ✅ Inner padding */}
          {isPlaying ? <Pause size={18} color={isPlaying ? '#7c67ca' : '#4caf50'} /> : <Play size={18} color="#1c9247" />}
        </div>
      </div>
    );
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
  }, [setToast]);

  const openToggleDialog = (invoice: RecurringInvoice) => {
    if (!isControllable(invoice.status)) {
      setToast({
        stage: 'enter',
        type: 'warning',
        message: `Cannot control ${invoice.status} invoices`,
      });
      return;
    }
    setToggleDialog({ open: true, invoice });
  };

  const executeToggle = async () => {
    const invoice = toggleDialog.invoice!;
    const action = invoice.status === 'stopped' ? 'resume' : 'stop';

    setToggleDialog({ open: false, invoice: null });

    try {
      await api.patch(`/recurring-invoices/${invoice.id}/control/`, { action });

      setSuccessAlert({
        open: true,
        message: `${invoice.profileName} ${action}d successfully`,
        severity: 'success'
      });

      const response = await api.get<RecurringInvoice[]>('recurring-invoices/');
      setInvoices(response.data);
    } catch (error: any) {
      setSuccessAlert({
        open: true,
        message: error.response?.data?.error || 'Failed to update status',
        severity: 'error'
      });
    }
  };

  const getToggleIcon = (status: string): React.ReactNode => {
    return <AnimatedToggleIcon status={status} />;
  };

  const actions: any[] = [
    {
      icon: (row: RecurringInvoice) => getToggleIcon(row.status),
      onClick: (row: RecurringInvoice) => openToggleDialog(row),
      tooltip: (row: RecurringInvoice) =>
        isControllable(row.status)
          ? `Click to ${row.status === 'stopped' ? 'Resume' : 'Stop'}`
          : `Cannot control ${row.status} invoices`,
      disabled: (row: RecurringInvoice) => !isControllable(row.status),
    },
    {
      icon: <Copy size={17} color='#3b2ada' />,
      onClick: (row: RecurringInvoice) => console.log('Clone:', row.id),
      tooltip: 'Clone Invoice',
    },
    {
      icon: <Trash2 size={17} color='red' />,
      onClick: (row: RecurringInvoice) => console.log('Delete:', row.id),
      tooltip: 'Delete Invoice',
    },
  ];

  return (
    <>
      <Toast toast={toast} setToast={setToast} />

      {/* ✅ FIXED: MUI Snackbar + Alert (NOT standalone Alert) */}
      <Snackbar
        open={successAlert.open}
        autoHideDuration={4000}
        onClose={() => setSuccessAlert({ ...successAlert, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ '& .MuiSnackbarContent-root': { minWidth: 400 } }}
      >
        <MuiAlert
          onClose={() => setSuccessAlert({ ...successAlert, open: false })}
          severity={successAlert.severity}
          sx={{
            width: '100%',
            animation: 'slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {successAlert.message}
        </MuiAlert>
      </Snackbar>

      {/* ✅ MUI TOGGLE CONFIRMATION DIALOG */}
      <Dialog
        open={toggleDialog.open}
        TransitionComponent={Transition as any}  // ✅ Simplest fix
        keepMounted
        onClose={() => setToggleDialog({ ...toggleDialog, open: false })}
        aria-describedby="toggle-dialog-description"
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ color: 'primary.dark', fontWeight: 'bold' }}>
          {toggleDialog.invoice?.status === 'stopped' ? 'Resume Profile' : 'Stop Profile'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <DialogContentText id="toggle-dialog-description" sx={{ color: 'text.secondary' }}>
            {toggleDialog.invoice && (
              <>
                {toggleDialog.invoice.status === 'stopped'
                  ? `Are you sure you want to resume "${toggleDialog.invoice.profileName}"?`
                  : `Are you sure you want to stop "${toggleDialog.invoice.profileName}"? This will pause all future invoice generation.`
                }
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button
            onClick={() => setToggleDialog({ ...toggleDialog, open: false })}
            color="inherit"
            sx={{ fontWeight: 600, color: 'text.secondary' }}
          >
            Cancel
          </Button>
          <Button
            onClick={executeToggle}
            variant="contained"
            color={toggleDialog.invoice?.status === 'stopped' ? "success" : "error"}
            disableElevation
            sx={{ fontWeight: 700 }}
          >
            {toggleDialog.invoice?.status === 'stopped' ? 'Resume' : 'Stop'}
          </Button>
        </DialogActions>
      </Dialog>

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

      {/* ✅ FIXED: Global CSS for Alert animation */}
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        /* ✅ PERFECT: Remove DynamicTable button backgrounds */
        .custom-table button {
          background: transparent !important;
        }
        
        .custom-table button:hover {
          background: transparent !important;
          transform: none !important;
        }
        
        /* ✅ Keep only icon hover effect */
        .custom-table button:hover .toggle-icon-container {
          transform: scale(1.05) !important;
        }
`}</style>
    </>
  );
};

export default PaymentInvoices;
