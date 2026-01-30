import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Pause, Copy, Trash2, AlertTriangle } from 'react-feather';
import {
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  Button, Alert as MuiAlert, Slide, Snackbar,
  Fade,
} from '@mui/material';

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




// ✅ PERFECT TypeScript Transition
const Transition = React.forwardRef((props: any, ref: React.Ref<unknown>) => {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface ToggleDialogState {
  open: boolean;
  invoice: RecurringInvoice | null;
}

interface DeleteDialogState {
  open: boolean;
  invoice: RecurringInvoice | null;
}

// ✅ NEW: Undo state
interface DeletedInvoice {
  invoice: RecurringInvoice;
  originalIndex: number;
  previousStatus: string;
  timestamp: number;
}

const RecurringInvoices = () => {
  const navigate = useNavigate();
  const { toast, setToast } = useGlobalToast();
  const [invoices, setInvoices] = useState<RecurringInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggleDialog, setToggleDialog] = useState<ToggleDialogState>({ open: false, invoice: null });
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>({ open: false, invoice: null });
  const [successAlert, setSuccessAlert] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // ✅ NEW: Undo + Animation state
  const [recentlyDeleted, setRecentlyDeleted] = useState<DeletedInvoice[]>([]);
  const [deletingRowId, setDeletingRowId] = useState<number | null>(null);

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
          transform: isPlaying ? 'rotate(0deg)' : 'rotate(180deg)',
        }}
      >
        {isPlaying ? <Pause size={18} color="#7c67ca" /> : <Play size={18} color="#1c9247" />}
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
        <div style={{ display: 'flex', gap: '4px', whiteSpace: 'nowrap', justifyContent: 'flex-end' }}>
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
    fetchRecurringInvoices();
  }, []);

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

      fetchRecurringInvoices();
    } catch (error: any) {
      setSuccessAlert({
        open: true,
        message: error.response?.data?.error || 'Failed to update status',
        severity: 'error'
      });
    }
  };

  // ✅ UPGRADED DELETE with Animation + Undo
  const openDeleteDialog = (invoice: RecurringInvoice) => {
    setDeleteDialog({ open: true, invoice });
  };

  const executeDelete = async () => {
    const invoice = deleteDialog.invoice!;
    setDeleteDialog({ open: false, invoice: null });

    // ✅ Find ORIGINAL position
    const originalIndex = invoices.findIndex(item => item.id === invoice.id);

    // ✅ Store for undo (with timestamp)
    setRecentlyDeleted(prev => [{
      invoice,
      originalIndex,
      previousStatus: invoice.status,
      timestamp: Date.now()
    }, ...prev.slice(0, 4)]); // Keep last 5 deletes

    // ✅ Optimistic UI remove + animation
    setDeletingRowId(invoice.id);

    setTimeout(() => {
      setInvoices(prev => prev.filter(item => item.id !== invoice.id));
      setDeletingRowId(null);
    }, 350);

    // ✅ PERMANENT server delete AFTER 8 seconds (undo timeout)
    try {
      await api.patch(`/recurring-invoices/${invoice.id}/status/`, {
        status: 'archived',
        is_active: false,
      });
    } catch (e) {
      setToast({
        stage: 'enter',
        type: 'error',
        message: 'Failed to delete invoice',
      });
    }
  };



  // ✅ UNDO FUNCTIONALITY
  // const handleUndo = () => {
  //   const toRestore = recentlyDeleted[0];
  //   if (toRestore) {
  //     setInvoices(prev => {
  //       const newInvoices = [...prev];
  //       newInvoices.splice(toRestore.originalIndex, 0, toRestore.invoice);
  //       return newInvoices;
  //     });

  //     // ✅ Remove from recently deleted
  //     setRecentlyDeleted(prev => prev.slice(1));
  //   }
  // };
  const handleUndo = async () => {
    const toRestore = recentlyDeleted[0];
    if (!toRestore) return;

    try {
      await api.patch(`/recurring-invoices/${toRestore.invoice.id}/status/`, {
        status: toRestore.previousStatus,
        is_active: true,
      });

      setInvoices(prev => {
        const copy = [...prev];
        const restored = {
          ...toRestore.invoice,
          status: toRestore.previousStatus,
          isActive: true,
        };

        copy.splice(toRestore.originalIndex, 0, restored);
        return copy;
      });

      setRecentlyDeleted(prev => prev.slice(1));
    } catch {
      setToast({
        stage: 'enter',
        type: 'error',
        message: 'Failed to restore invoice',
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
      onClick: (row: RecurringInvoice) => openDeleteDialog(row),
      tooltip: 'Delete Invoice (stops future generation)',
    },
  ];

  return (
    <>
      <Toast toast={toast} setToast={setToast} />

      {/* ✅ REGULAR SUCCESS SNACKBAR */}
      <Snackbar
        open={successAlert.open}
        autoHideDuration={5000}
        onClose={() => setSuccessAlert({ ...successAlert, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ '& .MuiSnackbarContent-root': { minWidth: 400 } }}
      >
        <MuiAlert
          onClose={() => setSuccessAlert({ ...successAlert, open: false })}
          severity={successAlert.severity}
          sx={{ width: '100%' }}
        >
          {successAlert.message}
        </MuiAlert>
      </Snackbar>

      {/* UNDO SNACKBAR */}
      <Snackbar
        open={recentlyDeleted.length > 0}
        autoHideDuration={6000}
        onClose={() => setRecentlyDeleted(prev => prev.slice(1))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        message={`"${recentlyDeleted[0]?.invoice.profileName}" deleted`}
        action={
          <Button
            color="inherit"
            size="small"
            onClick={handleUndo}
            sx={{ fontWeight: 700 }}
          >
            UNDO
          </Button>
        }
        TransitionComponent={Fade}
      />



      {/* ✅ TOGGLE DIALOG */}
      <Dialog
        open={toggleDialog.open}
        TransitionComponent={Transition}
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

      {/* ✅ DELETE CONFIRMATION DIALOG */}
      <Dialog
        open={deleteDialog.open}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setDeleteDialog({ ...deleteDialog, open: false })}
        aria-describedby="delete-dialog-description"
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ color: 'error.main', fontWeight: 'bold' }}>
          Delete Recurring Invoice
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <DialogContentText id="delete-dialog-description" sx={{ color: 'text.secondary' }}>
            {deleteDialog.invoice && (
              <>
                Are you sure you want to delete "<strong>{deleteDialog.invoice.profileName}</strong>"?
                <br /><br />
                <span style={{ color: 'error.main' }}>
                  <AlertTriangle size={17} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }} />
                  This will permanently stop all future invoice generation for this profile.
                </span>
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button
            onClick={() => setDeleteDialog({ ...deleteDialog, open: false })}
            color="inherit"
            sx={{ fontWeight: 600, color: 'text.secondary' }}
          >
            Cancel
          </Button>
          <Button
            onClick={executeDelete}
            variant="contained"
            color="error"
            disableElevation
            sx={{ fontWeight: 700 }}
          >
            Delete
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
            data={invoices.map(invoice => ({ ...invoice, key: invoice.id }))}
            loading={loading}
            actions={actions}
            rowsPerPage={10}
            onAdd={() => navigate('/sales/add-recurringInvoice')}
          />
        </div>
      </div>

      {/* ✅ FADE OUT ANIMATION CSS */}
      <style>{`
  /* All table rows get smooth transitions */
  tr {
    transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  /* Animate deleting rows */
  tr[data-deleting="true"] {
    opacity: 0 !important;
    transform: translateX(20px) !important;
    max-height: 0 !important;
  }
`}</style>
    </>
  );
};

export default RecurringInvoices;
