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
import { AlertTriangle } from 'react-feather';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fade,
  Slide,
  Snackbar,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
} from '@mui/material';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import AssignmentReturnOutlinedIcon from '@mui/icons-material/AssignmentReturnOutlined';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import UndoOutlinedIcon from '@mui/icons-material/UndoOutlined';
import { useLoading } from '../../../Contexts/Loadingcontext';

interface DeliveryChallan {
  id: number;
  date: string;
  deliveryChallanNo: string;
  reference: string;
  customerName: string;
  status: string;
  invoiceStatus: string;
  amount: number;
  items: Array<{
    description: string;
    quantity: number;
    rate: number;
    taxRate?: number;
  }>;
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
  const { showLoading, hideLoading } = useLoading();

  const [loading, setLoading] = useState(true);
  const [challans, setChallans] = useState<DeliveryChallan[]>([]);
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>({ open: false, challan: null });
  const [recentlyDeleted, setRecentlyDeleted] = useState<DeletedChallan[]>([]);

  // Menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = useState<DeliveryChallan | null>(null);

  useFormSuccess();

  const getStatusStyle = (status?: string) => {
    if (!status) {
      return { bg: '#f3f4f6', color: '#6b7280' };
    }
    switch (status.toLowerCase()) {
      case 'draft':
        return { bg: '#f3f4f6', color: '#374151' };
      case 'open':
        return { bg: '#e0f2fe', color: '#0369a1' };
      case 'delivered':
        return { bg: '#ecfdf5', color: '#047857' };
      case 'returned':
        return { bg: '#fee2e2', color: '#b91c1c' };
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
    const fetchDeliveryChallans = async () => {
      try {
        const response = await api.get<DeliveryChallan[]>('delivery-challans/');
        setChallans(response.data);
      } catch (error: any) {
        setToast({
          stage: 'enter',
          type: 'error',
          message: error.response?.data?.detail || 'Unable to load delivery challans',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchDeliveryChallans();
  }, []);

  // ==================== ACTION HANDLERS ====================

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, row: DeliveryChallan) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (anchorEl) {
        handleMenuClose();
      }
    };

    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [anchorEl]);


  const handleView = (row: DeliveryChallan) => {
    navigate(`/sales/delivery-challan/${row.id}`);
  };

  const handleClone = async (row: DeliveryChallan) => {
    handleMenuClose();
    try {
      await api.post(`delivery-challans/${row.id}/clone/`);
      setToast({ stage: 'enter', type: 'success', message: 'Delivery challan cloned successfully!' });
      const response = await api.get<DeliveryChallan[]>('delivery-challans/');
      setChallans(response.data);
    } catch (error: any) {
      setToast({ stage: 'enter', type: 'error', message: error.response?.data?.detail || 'Failed to clone' });
    }
  };

  const handleConvertToOpen = async (row: DeliveryChallan) => {
    handleMenuClose();
    try {
      console.log(
        await api.patch(`delivery-challans/${row.id}/status/`, { status: 'open' }));
      setToast({ stage: 'enter', type: 'success', message: 'Status changed to Open!' });
      setChallans(prev => prev.map(c => (c.id === row.id ? { ...c, status: 'open', invoiceStatus: 'not invoiced' } : c)));
    } catch (error: any) {
      setToast({ stage: 'enter', type: 'error', message: error.response?.data?.detail || 'Failed to update status' });
    }
  };

  const handleMarkAsDelivered = async (row: DeliveryChallan) => {
    handleMenuClose();
    try {
      await api.patch(`delivery-challans/${row.id}/status/`, { status: 'delivered' });
      setToast({ stage: 'enter', type: 'success', message: 'Marked as Delivered!' });
      setChallans(prev => prev.map(c => (c.id === row.id ? { ...c, status: 'delivered' } : c)));
    } catch (error: any) {
      setToast({ stage: 'enter', type: 'error', message: error.response?.data?.detail || 'Failed to update status' });
    }
  };

  const handleMarkAsReturned = async (row: DeliveryChallan) => {
    handleMenuClose();
    try {
      await api.patch(`delivery-challans/${row.id}/status/`, { status: 'returned' });
      setToast({ stage: 'enter', type: 'success', message: 'Marked as Returned!' });
      setChallans(prev => prev.map(c => (c.id === row.id ? { ...c, status: 'returned' } : c)));
    } catch (error: any) {
      setToast({ stage: 'enter', type: 'error', message: error.response?.data?.detail || 'Failed to update status' });
    }
  };

  const handleRevertToOpen = async (row: DeliveryChallan) => {
    handleMenuClose();
    try {
      await api.patch(`delivery-challans/${row.id}/status/`, { status: 'open' });
      setToast({ stage: 'enter', type: 'success', message: 'Reverted to Open!' });
      setChallans(prev => prev.map(c => (c.id === row.id ? { ...c, status: 'open' } : c)));
    } catch (error: any) {
      setToast({ stage: 'enter', type: 'error', message: error.response?.data?.detail || 'Failed to revert status' });
    }
  };

  const handleConvertToInvoice = async (row: DeliveryChallan) => {
    handleMenuClose();
    // navigate(`/sales/add-invoice?from=dc&id=${row.id}`);
    try {
      showLoading();

      // ✅ FETCH FULL DC
      const response = await api.get(`/delivery-challans/${row.id}/`);
      const fullDc = response.data;
      // console.log(fullDc);
      

      const dcState = {
        fromDeliveryChallan: true,

        dcData: {
          dcId: fullDc.id,
          customerId: fullDc.customer,
          referenceNumber: fullDc.challan_number,
          invoiceDate: fullDc.challan_date,

          customerNotes: fullDc.customer_notes,
          termsAndConditions: fullDc.terms_and_conditions,

          subtotal: fullDc.subtotal,
          adjustment: fullDc.adjustment,
          taxes: fullDc.taxes || [],
          grandTotal: fullDc.grand_total,
        },

        dcItems: fullDc.items.map((item: any) => ({
          description: item.item_details,
          quantity: parseFloat(item.quantity),
          rate: parseFloat(item.rate),
          discount: item.discount || 0,
        })),
      };

      navigate('/sales/add-invoice', { state: dcState });

    } catch (err) {
      console.error('Failed to fetch DC:', err);
      setToast({
        stage: 'enter',
        type: 'error',
        message: 'Failed to load Delivery challan details',
      });
    } finally {
      hideLoading();
    }
  };

  const openDeleteDialog = (row: DeliveryChallan) => {
    handleMenuClose();
    setDeleteDialog({ open: true, challan: row });
  };

  const executeDelete = async () => {
    const challan = deleteDialog.challan!;
    setDeleteDialog({ open: false, challan: null });

    const originalIndex = challans.findIndex(c => c.id === challan.id);
    setRecentlyDeleted(prev => [
      { challan, originalIndex, previousStatus: challan.status, timestamp: Date.now() },
      ...prev.slice(0, 4),
    ]);

    setChallans(prev => prev.filter(c => c.id !== challan.id));

    try {
      await api.patch(`delivery-challans/${challan.id}/status/`, { is_active: false });
    } catch {
      setToast({ stage: 'enter', type: 'error', message: 'Failed to delete delivery challan' });
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
      setToast({ stage: 'enter', type: 'error', message: 'Failed to restore delivery challan' });
    }
  };

  // ==================== DYNAMIC MENU ITEMS ====================

  const isInvoiced = (row: DeliveryChallan) => {
    return row.invoiceStatus?.toLowerCase() === 'invoiced';
  };

  const getMenuItems = (row: DeliveryChallan) => {
    const status = row.status?.toLowerCase();
    const items: React.ReactNode[] = [];

    // DRAFT actions
    if (status === 'draft') {
      items.push(
        <MenuItem key="convert-open" onClick={() => handleConvertToOpen(row)}>
          <ListItemIcon><SendOutlinedIcon fontSize="small" sx={{ color: '#0369a1' }} /></ListItemIcon>
          <ListItemText>Convert to Open</ListItemText>
        </MenuItem>
      );
      items.push(
        <MenuItem key="convert-invoice" onClick={() => handleConvertToInvoice(row)}>
          <ListItemIcon><ReceiptOutlinedIcon fontSize="small" sx={{ color: '#1d4ed8' }} /></ListItemIcon>
          <ListItemText>Convert to Invoice</ListItemText>
        </MenuItem>
      );
    }

    // OPEN actions
    if (status === 'open') {
      items.push(
        <MenuItem key="mark-delivered" onClick={() => handleMarkAsDelivered(row)}>
          <ListItemIcon><LocalShippingOutlinedIcon fontSize="small" sx={{ color: '#047857' }} /></ListItemIcon>
          <ListItemText>Mark as Delivered</ListItemText>
        </MenuItem>
      );
      if (!isInvoiced(row)) {
        items.push(
          <MenuItem key="mark-returned" onClick={() => handleMarkAsReturned(row)}>
            <ListItemIcon><AssignmentReturnOutlinedIcon fontSize="small" sx={{ color: '#b91c1c' }} /></ListItemIcon>
            <ListItemText>Mark as Returned</ListItemText>
          </MenuItem>
        );
        items.push(
          <MenuItem key="convert-invoice" onClick={() => handleConvertToInvoice(row)}>
            <ListItemIcon><ReceiptOutlinedIcon fontSize="small" sx={{ color: '#1d4ed8' }} /></ListItemIcon>
            <ListItemText>Convert to Invoice</ListItemText>
          </MenuItem>
        );
      }
    }

    // DELIVERED actions
    if (status === 'delivered') {
      if (!isInvoiced(row)) {
        items.push(
          <MenuItem key="convert-invoice" onClick={() => handleConvertToInvoice(row)}>
            <ListItemIcon><ReceiptOutlinedIcon fontSize="small" sx={{ color: '#1d4ed8' }} /></ListItemIcon>
            <ListItemText>Convert to Invoice</ListItemText>
          </MenuItem>
        );
      }
      items.push(
        <MenuItem key="revert-open" onClick={() => handleRevertToOpen(row)}>
          <ListItemIcon><UndoOutlinedIcon sx={{ fontSize: 19, color: '#6b7280' }} /></ListItemIcon>
          <ListItemText>Revert to Open</ListItemText>
        </MenuItem>
      );
    }

    // Common actions for all statuses
    if (items.length > 0) {
      items.push(<Divider key="divider-1" sx={{ my: 0.5 }} />);
    }

    items.push(
      <MenuItem key="clone" onClick={() => handleClone(row)}>
        <ListItemIcon><ContentCopyOutlinedIcon sx={{ fontSize: 19, color: '#6b7280' }} /></ListItemIcon>
        <ListItemText>Clone</ListItemText>
      </MenuItem>
    );

    items.push(
      <MenuItem key="delete" onClick={() => openDeleteDialog(row)} sx={{ color: '#dc2626' }}>
        <ListItemIcon><DeleteOutlineOutlinedIcon fontSize="small" sx={{ color: '#dc2626' }} /></ListItemIcon>
        <ListItemText>Delete</ListItemText>
      </MenuItem>
    );

    return items;
  };

  // ==================== ACTIONS COLUMN RENDER ====================

  const renderActions = (row: DeliveryChallan) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <Tooltip title="View Details">
        <IconButton size="small" onClick={() => handleView(row)} sx={{ color: '#6b7280' }}>
          <RemoveRedEyeOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="More Actions">
        <IconButton size="small" onClick={(e) => handleMenuOpen(e, row)} sx={{ color: '#6b7280' }}>
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </div>
  );

  // Add actions column to columns array
  const columnsWithActions = [
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: DeliveryChallan) => renderActions(row),
    },
    ...columns,
  ];

  return (
    <>
      <Snackbar
        open={recentlyDeleted.length > 0}
        autoHideDuration={6000}
        onClose={() => setRecentlyDeleted(prev => prev.slice(1))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        message="Delivery challan deleted"
        action={
          <Button color="primary" size="small" onClick={handleUndo} sx={{ fontWeight: 600 }}>
            UNDO
          </Button>
        }
        TransitionComponent={Fade}
      />

      <Toast toast={toast} setToast={setToast} />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setDeleteDialog({ ...deleteDialog, open: false })}
        aria-describedby="delete-dialog-description"
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Delete Delivery Challan</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            {deleteDialog.challan && (
              <>
                Are you sure you want to delete
                <strong> "{deleteDialog.challan.deliveryChallanNo}"</strong>?
                <br /><br />
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#a16207' }}>
                  <AlertTriangle size={16} />
                  This action can be undone only before refresh.
                </span>
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteDialog({ ...deleteDialog, open: false })} color="inherit" sx={{ fontWeight: 600 }}>
            Cancel
          </Button>
          <Button onClick={executeDelete} variant="contained" color="error" sx={{ fontWeight: 600 }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dynamic Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        disableScrollLock
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          elevation: 3,
          sx: {
            minWidth: 200,
            borderRadius: 2,
            mt: 0.5,
            '& .MuiMenuItem-root': {
              py: 1,
              px: 2,
            },
          },
        }}
      >
        {selectedRow && getMenuItems(selectedRow)}
      </Menu>

      <Header />

      <div style={{ padding: '56px 0px 0px' }}>
        <Navbar tabs={dashboardTabs} />
        <Navbar tabs={salesTabs} />

        <div className="mt-3">
          <DynamicTable
            columns={columnsWithActions}
            data={challans}
            loading={loading}
            rowsPerPage={10}
            onAdd={() => navigate('/sales/add-deliveryChallans')}
          />
        </div>
      </div>
    </>
  );
};

export default DeliveryChallans;
