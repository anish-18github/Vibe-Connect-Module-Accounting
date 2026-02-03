import { useNavigate } from 'react-router-dom';
import DynamicTable from '../../../components/Table/DynamicTable';
import { useEffect, useState } from 'react';
import Header from '../../../components/Header/Header';
import Navbar from '../../../components/Navbar/NavBar';
import { dashboardTabs } from '../../Dashboard/dashboard';
import { salesTabs } from '../Customers/Customers';
import useFormSuccess from '../../../components/Toast/useFormSuccess';
import { Toast } from '../../../components/Toast/Toast';
import { useGlobalToast } from '../../../components/Toast/ToastContext';
import api from '../../../services/api/apiConfig';
import { useLoading } from '../../../Contexts/Loadingcontext';

// MUI Icon Imports
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { Trash2 } from 'react-feather';
import KeyboardReturnOutlinedIcon from '@mui/icons-material/KeyboardReturnOutlined';

// MUI Utils
import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  Button, Snackbar, Alert as MuiAlert, Slide, Fade
} from '@mui/material';
import { AlertTriangle } from 'react-feather';


interface Payments {
  id: number;
  paymnetDate: String;
  payment: string;
  reference: string;
  customerName: string;
  invoiceNumber: string;
  paymentMode: string;
  status: string;
  amount: number;
}


interface DeleteDialogState {
  open: boolean;
  payment: Payments | null;
}

// ✅ NEW: Undo state
interface DeletedPayment {
  payment: Payments;
  originalIndex: number;
  previousStatus: string;
  timestamp: number;
}

const Transition = React.forwardRef((props: any, ref: React.Ref<unknown>) => {
  return <Slide direction="up" ref={ref} {...props} />;
});


const PaymentReceived = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<Payments[]>([]);
  const { toast, setToast } = useGlobalToast();
  const [loading, setLoading] = useState(true);
  const { showLoading, hideLoading } = useLoading();
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>({ open: false, payment: null });
  const [successAlert, setSuccessAlert] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });


  const [recentlyDeleted, setRecentlyDeleted] = useState<DeletedPayment[]>([]);
  const [deletingRowId, setDeletingRowId] = useState<number | null>(null);

  // const isControllable = (status: string): boolean => {
  //   return ['paid'].includes(status?.toLowerCase() || '');
  // };

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


  useFormSuccess();
  const columns = [
    { key: 'date', label: 'Date' },
    { key: 'payment', label: 'Payment' },
    { key: 'reference', label: 'Reference' },
    { key: 'customerName', label: 'Customer Name' },
    { key: 'invoice', label: 'Invoice' },
    { key: 'mode', label: 'Mode' },
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
  ];

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        showLoading();
        const response = await api.get<Payments[]>('payments/');
        setPayments(response.data);
      } catch (error: any) {
        setToast({
          stage: 'enter',
          type: 'error',
          message:
            error.response?.data?.detail || 'Unable to load Recoreded payments',
        });
      } finally {
        hideLoading();
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const openDeleteDialog = (payment: Payments) => {
    setDeleteDialog({ open: true, payment });
  };


  const executeDelete = async () => {
    const payment = deleteDialog.payment!;
    setDeleteDialog({ open: false, payment: null });

    const originalIndex = payments.findIndex(item => item.id === payment.id);

    setRecentlyDeleted(prev => [{
      payment,
      originalIndex,
      previousStatus: payment.status,
      timestamp: Date.now()
    }, ...prev.slice(0, 4)]);

    setDeletingRowId(payment.id);

    setTimeout(() => {
      setPayments(prev => prev.filter(item => item.id !== payment.id));
      setDeletingRowId(null);
    }, 350);

    try {
      await api.patch(`/payments/${payment.id}/status/`, {
        // status: 'archived',
        is_active: false,
      });
    } catch (e) {
      setToast({
        stage: 'enter',
        type: 'error',
        message: 'Failed to delete payment',
      });
    }
  };



  const handleUndo = async () => {
    const toRestore = recentlyDeleted[0];
    if (!toRestore) return;

    try {
      await api.patch(`/payments/${toRestore.payment.id}/status/`, {
        is_active: true,
      });

      setPayments(prev => {
        const copy = [...prev];
        copy.splice(toRestore.originalIndex, 0, toRestore.payment);
        return copy;
      });

      setRecentlyDeleted(prev => prev.slice(1));
    } catch {
      setToast({
        stage: 'enter',
        type: 'error',
        message: 'Failed to restore payment',
      });
    }
  };


  const handleRefund = (row: Payments) => {
    console.log('Refund clicked for payment:', row);
    // TODO: Implement refund logic later
  };


  const actions: any[] = [
    {
      icon: <RemoveRedEyeOutlinedIcon sx={{ fontSize: 20 }} />,
      onClick: (row: Payments) => navigate(`/sales/view-payment/${row.id}`),
      tooltip: 'View Details',
    },

    //  REFUND ACTION
    {
      icon: <KeyboardReturnOutlinedIcon sx={{ fontSize: 20, color: '#f59e0b' }} />,
      onClick: (row: Payments) => handleRefund(row),
      tooltip: 'Refund Payment',
    },

    //  DELETE ACTION
    {
      icon: <Trash2 size={17} color="red" />,
      onClick: (row: Payments) => openDeleteDialog(row),
      tooltip: 'Delete Payment',
    },
  ];


  return (
    <>

      <Toast toast={toast} setToast={setToast} />


      <Snackbar
        open={successAlert.open}
        autoHideDuration={5000}
        onClose={() => setSuccessAlert({ ...successAlert, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MuiAlert
          onClose={() => setSuccessAlert({ ...successAlert, open: false })}
          severity={successAlert.severity}
          sx={{ width: '100%' }}
        >
          {successAlert.message}
        </MuiAlert>
      </Snackbar>

      {/* UNDO snackbar */}

      <Snackbar
        open={recentlyDeleted.length > 0}
        autoHideDuration={6000}
        onClose={() => setRecentlyDeleted(prev => prev.slice(1))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        message={`"${recentlyDeleted[0]?.payment.payment}" deleted`}
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
      <Dialog
        open={deleteDialog.open}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setDeleteDialog({ ...deleteDialog, open: false })}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ color: 'error.main', fontWeight: 'bold' }}>
          Delete Payment
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          <DialogContentText sx={{ color: 'text.secondary' }}>
            {deleteDialog.payment && (
              <>
                Are you sure you want to delete payment
                <strong> "{deleteDialog.payment.payment}"</strong>?
                <br /><br />

                <span style={{ color: '#dc2626' }}>
                  <AlertTriangle
                    size={17}
                    style={{
                      display: 'inline',
                      verticalAlign: 'middle',
                      marginRight: 8
                    }}
                  />
                  This will remove the recorded payment entry.
                </span>
              </>
            )}
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button
            onClick={() => setDeleteDialog({ ...deleteDialog, open: false })}
            color="inherit"
            sx={{ fontWeight: 600 }}
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

        <div className=" mt-3">
          <DynamicTable
            columns={columns}
            // data={payments}
            data={payments.map(p => ({
              ...p,
              rowProps: {
                'data-deleting': deletingRowId === p.id
              }
            }))}
            loading={loading}
            actions={actions}
            rowsPerPage={10}
            onAdd={() => navigate('/sales/record-payment')} //May be change it latter. "/add-customer"
          />
        </div>
      </div>
      <style>{`
tr {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

tr[data-deleting="true"] {
  opacity: 0 !important;
  transform: translateX(20px) !important;
  max-height: 0 !important;
}
`}</style>

    </>
  );
};

export default PaymentReceived;
