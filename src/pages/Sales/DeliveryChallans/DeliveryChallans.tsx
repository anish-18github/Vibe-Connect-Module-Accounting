import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Header from '../../../components/Header/Header';
import Navbar from '../../../components/Navbar/NavBar';
import DynamicTable from '../../../components/Table/DynamicTable';
import { dashboardTabs } from '../../Dashboard/dashboard';
import { salesTabs } from '../Customers/Customers';

import useFormSuccess from '../../../components/Toast/useFormSuccess';
import { Toast } from '../../../components/Toast/Toast';
import { useGlobalToast } from '../../../components/Toast/ToastContext';

import api from '../../../services/api/apiConfig';
import { AlertTriangle, Copy, Eye, Trash2 } from 'react-feather';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fade, Slide, Snackbar } from '@mui/material';

interface DeliveryChallan {
  id: number;
  date: string;
  deliveryChallanNo: string;
  reference: string;
  customerName: string;
  status: string;
  invoiceStatus: string;
  amount: number;
}

const Transition = React.forwardRef((props: any, ref: React.Ref<unknown>) => {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface DeleteDialogState {
  open: boolean;
  challan: DeliveryChallan | null;
}
interface DeletedChallan {
  challan: DeliveryChallan;
  originalIndex: number;
  previousStatus: string;
  timestamp: number;
}

const DeliveryChallans = () => {
  const navigate = useNavigate();
  const { toast, setToast } = useGlobalToast();

  const [loading, setLoading] = useState(true);
  const [challans, setChallans] = useState<DeliveryChallan[]>([]);
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>({ open: false, challan: null });

  const [recentlyDeleted, setRecentlyDeleted] = useState<DeletedChallan[]>([]);


  useFormSuccess();

  // ✅ Status badge styles (business-meaningful)
  const getStatusStyle = (status?: string) => {
    if (!status) {
      return { bg: '#f3f4f6', color: '#6b7280' }; // neutral for null
    }

    switch (status.toLowerCase()) {
      // Normal Status
      case 'draft':
        return { bg: '#f3f4f6', color: '#374151' };

      case 'open':
        return { bg: '#e0f2fe', color: '#0369a1' };

      case 'delivered':
        return { bg: '#ecfdf5', color: '#047857' };

      case 'returned':
        return { bg: '#fee2e2', color: '#b91c1c' };

      // Invoice Status
      case 'invoiced':
        return { bg: '#e0f0ff', color: '#1d4ed8' };

      case 'not invoiced':
      case 'notinvoiced':
        return { bg: '#fff7db', color: '#a16207' };

      default:
        return { bg: '#f3f4f6', color: '#374151' };
    }
  };


  const columns = [
    { key: 'date', label: 'Date' },
    { key: 'deliveryChallanNo', label: 'Delivery Challan No.' },
    { key: 'reference', label: 'Reference' },
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
      key: 'invoiceStatus',
      label: 'Invoice Status',
      render: (value: string | null) => {
        if (!value) return '-';

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
      }

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
    const fetchDeliveryChallans = async () => {
      try {
        const response = await api.get<DeliveryChallan[]>(
          'delivery-challans/'
        );
        setChallans(response.data);
      } catch (error: any) {
        setToast({
          stage: 'enter',
          type: 'error',
          message:
            error.response?.data?.detail ||
            'Unable to load delivery challans',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveryChallans();
  }, []);



  const openDeleteDialog = (challan: DeliveryChallan) => {
    setDeleteDialog({ open: true, challan });
  }

  const executeDelete = async () => {
    const challan = deleteDialog.challan!;
    setDeleteDialog({ open: false, challan: null });

    const originalIndex = challans.findIndex(c => c.id === challan.id);

    setRecentlyDeleted(prev => [{
      challan,
      originalIndex,
      previousStatus: challan.status,
      timestamp: Date.now(),
    }, ...prev.slice(0, 4)]);

    // Optimistic UI
    setChallans(prev => prev.filter(c => c.id !== challan.id));

    try {
      await api.patch(`delivery-challans/${challan.id}/status/`, {
        is_active: false,
      });
    } catch {
      setToast({
        stage: 'enter',
        type: 'error',
        message: 'Failed to delete delivery challan',
      });
    }
  };

  const handleUndo = async () => {
    const toRestore = recentlyDeleted[0];
    if (!toRestore) return;

    try {
      await api.patch(`delivery-challans/${toRestore.challan.id}/status/`, {
        is_active: true,
        status: toRestore.previousStatus,
      });

      setChallans(prev => {
        const copy = [...prev];
        copy.splice(toRestore.originalIndex, 0, toRestore.challan);
        return copy;
      });

      setRecentlyDeleted(prev => prev.slice(1));
    } catch {
      setToast({
        stage: 'enter',
        type: 'error',
        message: 'Failed to restore delivery challan',
      });
    }
  };


  const actions = [
    {
      icon: <Eye size={17} />,
      onClick: (row: DeliveryChallan) => navigate(`/sales/delivery-challan/${row.id}`),
      tooltip: 'View Details',
    },
    {
      icon: <Copy size={17} color='#3b2ada' />,
      onClick: (row: DeliveryChallan) => console.log('Clone:', row.id),
      tooltip: 'Copy Challan',
    },
    {
      icon: <Trash2 size={17} color="red" />,
      onClick: (row: DeliveryChallan) => openDeleteDialog(row),
      tooltip: 'Delete Challan',
    },
  ];



  return (
    <>
      <Snackbar
        open={recentlyDeleted.length > 0}
        autoHideDuration={6000}
        onClose={() => setRecentlyDeleted(prev => prev.slice(1))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        message={`Delivery challan deleted`}
        action={
          <Button color="inherit" size="small" onClick={handleUndo}>
            UNDO
          </Button>
        }
        TransitionComponent={Fade}
      />
      <Toast toast={toast} setToast={setToast} />


      <Dialog
        open={deleteDialog.open}
        TransitionComponent={Transition}
        keepMounted
        onClose={() =>
          setDeleteDialog({ ...deleteDialog, open: false })
        }
        aria-describedby="delete-dialog-description"
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ color: 'error.main', fontWeight: 'bold' }}>
          Delete Delivery Challan
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          <DialogContentText
            id="delete-dialog-description"
            sx={{ color: 'text.secondary' }}
          >
            {deleteDialog.challan && (
              <>
                Are you sure you want to delete
                <strong> "{deleteDialog.challan.deliveryChallanNo}"</strong>?
                <br /><br />
                <span style={{ color: 'error.main' }}>
                  <AlertTriangle
                    size={17}
                    style={{
                      display: 'inline',
                      verticalAlign: 'middle',
                      marginRight: 8,
                    }}
                  />
                  This action can be undone only before refresh.
                </span>
              </>
            )}
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button
            onClick={() =>
              setDeleteDialog({ ...deleteDialog, open: false })
            }
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
            data={challans}
            loading={loading}
            actions={actions}
            rowsPerPage={10}
            onAdd={() => navigate('/sales/add-deliveryChallans')}
          />
        </div>
      </div>
    </>
  );
};

export default DeliveryChallans;
