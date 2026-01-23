import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DynamicTable from '../../../components/Table/DynamicTable';
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
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  IconButton,
  CircularProgress,
  Avatar,
  Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useLoading } from '../../../Contexts/Loadingcontext';

interface CreditNote {
  id: number;
  date: string;
  creditNoteNumber: string;
  reference: string;
  customerName: string;
  invoiceNumber: string;
  status: string;
  amount: number;
  balance: number;
}

interface RefundFormData {
  amount: string;
  refundedOn: string;
  payment_mode: string;
  reference: string;
  from_account: string;
  description: string;
}

const CreditNote = () => {
  const navigate = useNavigate();
  const { toast, setToast } = useGlobalToast();
  const { showLoading, hideLoading } = useLoading();  // ✅ Add loading hooks
  const [loading, setLoading] = useState(true);
  const [creditNotes, setCreditNotes] = useState<CreditNote[]>([]);



  const [openModal, setOpenModal] = useState(false);
  const [selectedCreditNote, setSelectedCreditNote] = useState<CreditNote | null>(null);
  const [formData, setFormData] = useState<RefundFormData>({
    amount: '',
    refundedOn: new Date().toISOString().split('T')[0],
    payment_mode: '',
    reference: '',
    from_account: '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleView = (row: CreditNote) => {
    navigate(`/sales/credit-note/${row.id}`);
  };

  const handleRefund = (row: CreditNote) => {

    if (row.status !== 'open') {
      setToast({
        stage: 'enter',
        type: 'warning',
        message: `Cannot refund ${row.status.toUpperCase()} credit note`,
      });
      return;
    }

    if (row.balance <= 0) {
      setToast({
        stage: 'enter',
        type: 'warning',
        message: 'No balance remaining for refund',
      });
      return;
    }

    setSelectedCreditNote(row);
    setFormData({
      amount: '',
      refundedOn: new Date().toISOString().split('T')[0],
      payment_mode: '',
      reference: '',
      from_account: '',
      description: '',
    });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedCreditNote(null);
    setFormData({
      amount: '',
      refundedOn: new Date().toISOString().split('T')[0],
      payment_mode: '',
      reference: '',
      from_account: '',
      description: '',
    });
  };


  const handleSubmitRefund = async () => {
    if (!selectedCreditNote) return;

    setSubmitting(true);
    try {
      await api.post(`/credit-notes/${selectedCreditNote.id}/refunds/`, {
        amount: parseFloat(formData.amount),
        refunded_on: formData.refundedOn,
        payment_mode: formData.payment_mode,
        reference: formData.reference,
        from_account: formData.from_account,
        description: formData.description,
      });

      setToast({
        stage: 'enter',
        type: 'success',
        message: 'Refund recorded successfully!',
      });

      const response = await api.get<CreditNote[]>('credit-notes/');
      setCreditNotes(response.data);
      handleCloseModal();
    } catch (error: any) {
      setToast({
        stage: 'enter',
        type: 'error',
        message: error.response?.data?.detail || 'Failed to record refund',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'CN';
  };

  const formatBalance = (value: number) => {
    return value?.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const isFormValid = formData.amount !== '' && formData.payment_mode !== '' && formData.from_account !== '';

  // ✅ FIXED: Static actions array - NO TypeScript warnings
  const actions = useCallback(() => [
    {
      icon: <RemoveRedEyeOutlinedIcon sx={{ fontSize: 20 }} />,
      onClick: (row: CreditNote) => handleView(row),
      tooltip: 'View Details',
    },
    {
      icon: <RestorePageOutlinedIcon sx={{ fontSize: 20 }} />,
      onClick: (row: CreditNote) => handleRefund(row),
      tooltip: 'Record Refund',
    },
  ], [handleView, handleRefund, setToast]);


  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'open':
        return { bg: '#e0f0ff', color: '#1d4ed8' };
      case 'draft':
        return { bg: '#e6f9ed', color: '#15803d' };
      case 'closed':
        return { bg: '#f1f5f9', color: '#64748b' };
      default:
        return { bg: '#f3f4f6', color: '#374151' };
    }
  };

  useFormSuccess();

  const columns = [
    { key: 'date', label: 'Date' },
    { key: 'creditNoteNumber', label: 'Credit Note Number' },
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
      key: 'balance',
      label: 'Balance',
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
        showLoading();
        const response = await api.get<CreditNote[]>('credit-notes/');
        setCreditNotes(response.data);
      } catch (error: any) {
        setToast({
          stage: 'enter',
          type: 'error',
          message: error.response?.data?.detail || 'Unable to load credit notes',
        });
      } finally {
        hideLoading();
        setLoading(false);  // ✅ This stops skeleton
      }
    };
    fetchCreditNote();
  }, []);  // ✅ EMPTY deps - only run once


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
            data={creditNotes}
            loading={loading}
            actions={actions()}
            rowsPerPage={10}
            onAdd={() => navigate('/sales/add-creditNote')}
          />
        </div>
      </div>

      {/* REFUND MODAL */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '95%', sm: 700 },
            maxWidth: '95vw',
            maxHeight: '90vh',
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 2,
            overflow: 'hidden',
            outline: 'none',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              px: 3,
              py: 2,
              borderBottom: '1px solid #e5e7eb',
            }}
          >
            <Typography variant="h6" fontWeight={600} color="text.primary">
              Refund ({selectedCreditNote?.creditNoteNumber})
            </Typography>
            <Chip
              label={selectedCreditNote?.status?.toUpperCase()}
              size="small"
              color={selectedCreditNote?.status === 'open' ? 'success' : 'error'}
            />
            <IconButton onClick={handleCloseModal} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Customer Info Section */}
          <Box sx={{ px: 3, py: 2.5, bgcolor: '#f8fafc' }}>
            <Box sx={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              {/* Customer Name */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: '#e2e8f0',
                    color: '#64748b',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                  }}
                >
                  {getInitials(selectedCreditNote?.customerName || '')}
                </Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.25 }}>
                    Customer Name
                  </Typography>
                  <Typography variant="body2" fontWeight={550} color="text.primary">
                    {selectedCreditNote?.customerName || 'Loading...'}
                  </Typography>
                </Box>
              </Box>

              {/* Credit Note Number */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 1.5,
                    bgcolor: '#e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <DescriptionOutlinedIcon sx={{ fontSize: 20, color: '#64748b' }} />
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.25 }}>
                    Credit Note Number
                  </Typography>
                  <Typography variant="body2" fontWeight={550} color="text.primary">
                    {selectedCreditNote?.creditNoteNumber || 'N/A'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Form Section */}
          <Box sx={{ px: 3, py: 2.5, maxHeight: 400, overflowY: 'auto' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {/* Amount & Balance Row */}
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
                <TextField
                  fullWidth
                  label="Amount"
                  type="number"
                  size="small"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  inputProps={{ step: '0.01', min: 0, max: selectedCreditNote?.balance }}
                  InputProps={{
                    startAdornment: (
                      <Typography color="text.secondary" sx={{ mr: 1, fontSize: '0.875rem' }}>
                        INR
                      </Typography>
                    ),
                  }}
                />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Balance :
                  </Typography>
                  <Typography variant="h6" fontWeight={600} color="text.primary" sx={{ mt: 0.5 }}>
                    ₹{formatBalance(selectedCreditNote?.balance || 0)}
                  </Typography>
                </Box>
              </Box>

              {/* Refunded On & Payment Mode Row */}
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
                <TextField
                  fullWidth
                  label="Refunded On"
                  type="date"
                  size="small"
                  required
                  value={formData.refundedOn}
                  onChange={(e) => setFormData({ ...formData, refundedOn: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
                <FormControl fullWidth size="small">
                  <InputLabel>Payment Mode</InputLabel>
                  <Select
                    value={formData.payment_mode}
                    label="Payment Mode"
                    onChange={(e) => setFormData({ ...formData, payment_mode: e.target.value })}
                  >
                    <MenuItem value="cash">Cash</MenuItem>
                    <MenuItem value="upi">UPI</MenuItem>
                    <MenuItem value="cheque">Cheque</MenuItem>
                    <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                    <MenuItem value="card">Card</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Reference & From Account Row */}
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">
                    Reference:
                  </label>
                  <input
                    type="text"
                    name="referenceNo"
                    className="form-control so-control"
                    value={formData.reference}
                    onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                    style={{ fontSize: 13 }}
                    placeholder="Enter reference number"
                  />
                </div>
                {/* <TextField
                  fullWidth
                  label="Reference#"
                  size="small"
                  value={formData.reference}
                  onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                  placeholder="Enter reference"
                /> */}
                <FormControl fullWidth size="small" required>
                  <InputLabel>From Account</InputLabel>
                  <Select
                    value={formData.from_account}
                    label="From Account"
                    onChange={(e) => setFormData({ ...formData, from_account: e.target.value })}
                  >
                    <MenuItem value="petty_cash">Petty Cash</MenuItem>
                    <MenuItem value="undeposited_funds">Undeposited Funds</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Description */}
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                size="small"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter description (optional)"
              />
            </Box>
          </Box>

          {/* Footer */}
          <Box
            sx={{
              px: 3,
              py: 2,
              borderTop: '1px solid #e5e7eb',
              bgcolor: '#f8fafc',
              display: 'flex',
              justifyContent: 'center',
              gap: 1.5,
            }}
          >
            <Button
              variant="contained"
              onClick={handleSubmitRefund}
              disabled={!isFormValid || submitting}
              startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : null}
              sx={{ textTransform: 'none', fontWeight: 500 }}
            >
              {submitting ? 'Saving...' : 'Save'}
            </Button>
            <Button
              variant="outlined"
              onClick={handleCloseModal}
              disabled={submitting}
              sx={{ textTransform: 'none', fontWeight: 500 }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default CreditNote;
