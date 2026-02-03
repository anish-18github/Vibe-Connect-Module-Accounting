import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../../components/Header/Header';
import { Toast } from '../../../../components/Toast/Toast';
import { useGlobalToast } from '../../../../components/Toast/ToastContext';
import './recordPayment.css';
import { Info, Settings, X } from 'react-feather';
import api from '../../../../services/api/apiConfig';
import CustomerSelect from '../../../../components/Masters/CustomerMaster/CustomerSelector';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
  TextField,
  Typography,
  Box,
  Chip,
} from '@mui/material';

// ------------------- Interfaces -------------------
export interface PaymentFormData {
  paymentRecord: {
    customerId: string;
    amountReceived: string;
    paymentDate: string;
    paymentId: string;
    paymentMode: string;
    reference: string;
    taxDeducted: boolean;
    tdsAccount: string | null;
    tdsRate: string;
    customerNotes: string;
  };
  paymentSummary: {
    amountReceived: number;
    amountUsed: number;
    amountRefunded: number;
    amountExcess: number;
  };
  paymentUsageRow: {
    date: string;
    invoiceNumber: string;
    invoiceAmount: number;
    amountDue: number;
    paymentReceivedOn: string;
    paymentUsed: number;
  };
}

interface PaymentSummary {
  amountReceived: number;
  amountUsed: number;
  amountRefunded: number;
  amountExcess: number;
}

interface PaymentUsageRow {
  date: string;
  invoiceId: number;
  invoiceNumber: string;
  invoiceAmount: number;
  amountDue: number;
  paymentReceivedOn: string;
  paymentUsed: number;
}

// ------------------- Component -------------------
export default function AddPayment() {
  const navigate = useNavigate();
  const { toast, setToast, showToast } = useGlobalToast();

  const [showSettings, setShowSettings] = useState(false);
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');
  const [nextNumber, setNextNumber] = useState('');
  const [restartYear, setRestartYear] = useState(false);
  const [closing, setClosing] = useState(false);
  const [prefixPattern, setPrefixPattern] = useState<string>('CUSTOM');
  const [receivedFullAmount, setReceivedFullAmount] = useState(false);
  const [submitAction, setSubmitAction] = useState<'paid' | 'draft'>('draft');

  // ✅ NEW: Loading state for table
  const [tableLoading, setTableLoading] = useState(false);

  const calculateTotalUnpaid = () => {
    return usageRows.reduce((sum, row) => sum + Number(row.amountDue || 0), 0);
  };

  const applyReceivedFullAmount = () => {
    const totalUnpaid = calculateTotalUnpaid();
    setFormData((prev) => ({
      ...prev,
      paymentRecord: {
        ...prev.paymentRecord,
        amountReceived: totalUnpaid.toFixed(2),
      },
      paymentSummary: {
        ...prev.paymentSummary,
        amountUsed: totalUnpaid,
        amountExcess: 0,
      },
    }));

    const updatedRows = usageRows.map((row) => ({
      ...row,
      paymentUsed: row.amountDue,
    }));
    setUsageRows(updatedRows);
  };

  const resetReceivedFullAmount = () => {
    setReceivedFullAmount(false);
    setFormData((prev) => ({
      ...prev,
      paymentRecord: {
        ...prev.paymentRecord,
        amountReceived: '',
      },
    }));

    const clearedRows = usageRows.map((row) => ({
      ...row,
      paymentUsed: 0,
    }));
    setUsageRows(clearedRows);

    setSummary({
      amountReceived: 0,
      amountUsed: 0,
      amountRefunded: 0,
      amountExcess: 0,
    });
  };

  const buildPrefixFromPattern = (pattern: string) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    switch (pattern) {
      case 'YEAR':
        return `PID-${year}-`;
      case 'YEAR_MONTH':
        return `PID-${year}${month}-`;
      case 'DATE_DDMMYYYY':
        return `PID-${day}${month}${year}-`;
      case 'YEAR_SLASH_MONTH':
        return `PID-${year}/${month}-`;
      default:
        return 'PID-';
    }
  };

  const closePopup = () => {
    setClosing(true);
    setTimeout(() => {
      setShowSettings(false);
      setClosing(false);
    }, 250);
  };

  useEffect(() => {
    document.body.style.overflow = showSettings ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showSettings]);

  // ---------------- Form State ----------------
  const [usageRows, setUsageRows] = useState<PaymentUsageRow[]>([]);

  const [summary, setSummary] = useState<PaymentSummary>({
    amountReceived: 0,
    amountUsed: 0,
    amountRefunded: 0,
    amountExcess: 0,
  });

  const [formData, setFormData] = useState<PaymentFormData>({
    paymentRecord: {
      customerId: '',
      amountReceived: '',
      paymentDate: new Date().toISOString().split('T')[0],
      paymentId: '',
      paymentMode: '',
      reference: '',
      taxDeducted: false,
      tdsAccount: null,
      tdsRate: '',
      customerNotes: '',
    },
    paymentSummary: {
      amountReceived: 0,
      amountUsed: 0,
      amountRefunded: 0,
      amountExcess: 0,
    },
    paymentUsageRow: {
      date: '',
      invoiceNumber: '',
      invoiceAmount: 0,
      amountDue: 0,
      paymentReceivedOn: '',
      paymentUsed: 0,
    },
  });

  useEffect(() => {
    const customerId = formData.paymentRecord.customerId;

    setReceivedFullAmount(false);
    setSummary({
      amountReceived: 0,
      amountUsed: 0,
      amountRefunded: 0,
      amountExcess: 0,
    });
    setFormData((prev) => ({
      ...prev,
      paymentRecord: {
        ...prev.paymentRecord,
        amountReceived: '',
      },
    }));

    if (!customerId) {
      setUsageRows([]);
      return;
    }

    const fetchUnpaidInvoices = async () => {
      setTableLoading(true); // ✅ Start loading
      try {
        const res = await api.get(`invoices/unpaid/?customer=${customerId}`);
        setUsageRows(
          res.data.map((inv: any) => ({
            invoiceId: inv.id,
            date: inv.invoice_date,
            invoiceNumber: inv.invoice_number,
            invoiceAmount: Number(inv.grand_total),
            amountDue: Number(inv.balance_due),
            paymentReceivedOn: formData.paymentRecord.paymentDate,
            paymentUsed: 0,
          }))
        );
      } catch (err) {
        console.error('Failed to load unpaid invoices', err);
        showToast('Failed to load unpaid invoices', 'error');
        setUsageRows([]);
      } finally {
        setTableLoading(false); // ✅ Stop loading
      }
    };

    fetchUnpaidInvoices();
  }, [formData.paymentRecord.customerId]);

  useEffect(() => {
    if (!receivedFullAmount) return;
    const totalUnpaid = calculateTotalUnpaid().toFixed(2);
    if (formData.paymentRecord.amountReceived !== totalUnpaid) {
      resetReceivedFullAmount();
    }
  }, [formData.paymentRecord.amountReceived]);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFormData((prev) => ({
      ...prev,
      paymentRecord: { ...prev.paymentRecord, paymentDate: today },
    }));
  }, []);

  useEffect(() => {
    setUsageRows((prev) =>
      prev.map((row: PaymentUsageRow) => ({
        ...row,
        paymentReceivedOn: formData.paymentRecord.paymentDate,
      }))
    );
  }, [formData.paymentRecord.paymentDate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target as { name: string; value: string };

    if (name.includes('paymentRecord.')) {
      const field = name.replace('paymentRecord.', '') as keyof typeof formData.paymentRecord;
      setFormData((prev) => ({
        ...prev,
        paymentRecord: { ...prev.paymentRecord, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value } as PaymentFormData));
    }
  };

  useEffect(() => {
    const rcv = Number(formData.paymentRecord.amountReceived || 0);
    const used = summary.amountUsed;
    const refund = summary.amountRefunded;
    setSummary((prev) => ({
      ...prev,
      amountReceived: rcv,
      amountUsed: rcv - used - refund,
    }));
  }, [formData.paymentRecord.amountReceived, summary.amountExcess, summary.amountRefunded]);


  const round2 = (value: number) =>
    Number(Number(value).toFixed(2));




  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const payload = {
        customer: Number(formData.paymentRecord.customerId),
        payment_mode: formData.paymentRecord.paymentMode,
        amount_received: round2(Number(formData.paymentRecord.amountReceived)),
        payment_date: formData.paymentRecord.paymentDate,
        payment_id: formData.paymentRecord.paymentId || null,
        reference: formData.paymentRecord.reference || '',
        tax_deducted: formData.paymentRecord.taxDeducted,
        tds_account: formData.paymentRecord.tdsAccount,
        customer_notes: formData.paymentRecord.customerNotes,
        usages: usageRows
          .filter((row) => row.paymentUsed > 0)
          .map((row) => ({
            invoice: row.invoiceId,
            amount_used: Number(row.paymentUsed),
          })),
        submit_action: submitAction,
      };

      console.log('FINAL PAYMENT PAYLOAD', payload);

      await api.post('payments/create/', payload);

      showToast('Payment recorded successfully', 'success');

      if (summary.amountUsed > Number(formData.paymentRecord.amountReceived)) {
        showToast('Amount used cannot exceed amount received', 'error');
        return;
      }

      setTimeout(() => {
        navigate('/sales/payment-received');
      }, 800);
    } catch (error: any) {
      console.error('PAYMENT ERROR:', error.response?.data || error);
      const message =
        error.response?.data?.detail ||
        error.response?.data?.non_field_errors?.[0] ||
        'Failed to create Payment record';
      showToast(message, 'error');
    }
  };

  const applyAutoSO = () => {
    if (mode === 'auto') {
      const prefix = buildPrefixFromPattern(prefixPattern);
      const fullNumber = `${prefix}${nextNumber || '001'}`;
      setFormData((prev) => ({
        ...prev,
        paymentRecord: {
          ...prev.paymentRecord,
          paymentId: fullNumber,
        },
      }));
    }
    closePopup();
  };

  const noSpinnerStyle = {
    MozAppearance: 'textfield' as const,
  };

  // ✅ Currency formatter
  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // ✅ Table Skeleton Component (inline)
  const TableSkeleton = () => (
    <>
      {[1, 2, 3].map((index) => (
        <TableRow key={index}>
          <TableCell><Skeleton animation="wave" height={24} /></TableCell>
          <TableCell><Skeleton animation="wave" height={24} /></TableCell>
          <TableCell><Skeleton animation="wave" height={24} /></TableCell>
          <TableCell><Skeleton animation="wave" height={24} /></TableCell>
          <TableCell><Skeleton animation="wave" height={24} /></TableCell>
          <TableCell><Skeleton animation="wave" height={36} /></TableCell>
        </TableRow>
      ))}
    </>
  );

  return (
    <>
      <Header />
      <Toast toast={toast} setToast={setToast} />

      <div className="sales-orders-page">
        <form onSubmit={handleSubmit} className="sales-order-form">
          {/* TOP DETAILS CARD - Same as before */}
          <div className="so-details-card mx-5 mb-4">
            <h1 className="sales-order-title mb-4">Record Payment</h1>

            <div className="row g-3 three-column-form">
              {/* COLUMN 1: Customer + Payment Mode */}
              <div className="col-lg-4">
                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">Customer:</label>
                  <CustomerSelect
                    name="paymentRecord.customerId"
                    value={formData.paymentRecord.customerId}
                    onChange={handleChange}
                  />
                </div>

                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">Payment Mode:</label>
                  <select
                    name="paymentRecord.paymentMode"
                    className="form-select so-control"
                    value={formData.paymentRecord.paymentMode}
                    onChange={handleChange}
                  >
                    <option value="">Select Mode</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="UPI">UPI</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>

                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">Amount Received:</label>
                  <input
                    type="number"
                    name="paymentRecord.amountReceived"
                    className="form-control so-control mb-2"
                    style={noSpinnerStyle}
                    value={formData.paymentRecord.amountReceived}
                    onChange={handleChange}
                    disabled={receivedFullAmount}
                  />
                  <div className="form-check" style={{ fontSize: 12 }}>
                    <input
                      type="checkbox"
                      className="me-2 border"
                      id="fullAmount"
                      checked={receivedFullAmount}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        if (checked) {
                          setReceivedFullAmount(true);
                          applyReceivedFullAmount();
                        } else {
                          resetReceivedFullAmount();
                        }
                      }}
                    />
                    <label htmlFor="fullAmount" className="form-check-label">
                      Received full amount
                    </label>
                  </div>
                </div>
              </div>

              {/* COLUMN 2 */}
              <div className="col-lg-4">
                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">Payment Date:</label>
                  <input
                    type="date"
                    name="paymentRecord.paymentDate"
                    className="form-control so-control"
                    value={formData.paymentRecord.paymentDate}
                    onChange={handleChange}
                  />
                </div>

                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">Payment ID:</label>
                  <div style={{ position: 'relative', width: '100%' }}>
                    <input
                      type="text"
                      name="paymentRecord.paymentId"
                      className="form-control so-control"
                      value={formData.paymentRecord.paymentId}
                      onChange={handleChange}
                      style={{ paddingRight: '35px' }}
                    />
                    <span
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '45%',
                        transform: 'translateY(-50%)',
                        cursor: 'pointer',
                        color: '#6c757d',
                      }}
                      onClick={() => setShowSettings(true)}
                    >
                      <Settings size={16} />
                    </span>
                  </div>
                </div>

                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">Reference:</label>
                  <input
                    type="text"
                    name="paymentRecord.reference"
                    className="form-control so-control"
                    value={formData.paymentRecord.reference}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* COLUMN 3 */}
              <div className="col-lg-4">
                <div className="so-form-group" style={{ marginBottom: 36 }}>
                  <label className="so-label text-sm text-muted-foreground fw-bold">Tax Deducted?</label>
                  <div className="radio-row">
                    <div className="form-check">
                      <input
                        type="radio"
                        id="taxNo"
                        className="form-check-input me-2"
                        checked={!formData.paymentRecord.taxDeducted}
                        onChange={() =>
                          setFormData((prev) => ({
                            ...prev,
                            paymentRecord: {
                              ...prev.paymentRecord,
                              taxDeducted: false,
                              tdsAccount: null,
                            },
                          }))
                        }
                      />
                      <label htmlFor="taxNo" className="form-check-label small">
                        No tax deducted
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        type="radio"
                        id="taxYes"
                        className="form-check-input me-2"
                        checked={formData.paymentRecord.taxDeducted}
                        onChange={() =>
                          setFormData((prev) => ({
                            ...prev,
                            paymentRecord: {
                              ...prev.paymentRecord,
                              taxDeducted: true,
                            },
                          }))
                        }
                      />
                      <label htmlFor="taxYes" className="form-check-label small">
                        Yes, tax deducted by customer
                      </label>
                    </div>
                  </div>
                </div>

                {formData.paymentRecord.taxDeducted && (
                  <div className="so-form-group mb-4">
                    <label className="so-label text-sm text-muted-foreground fw-bold">TDS Account</label>
                    <select
                      className="form-select so-control"
                      value={formData.paymentRecord.tdsAccount || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          paymentRecord: {
                            ...prev.paymentRecord,
                            tdsAccount: e.target.value,
                          },
                        }))
                      }
                    >
                      <option value="">Select TDS Account</option>
                      <option value="TDS Receivable - 194J">TDS Receivable – Contractor (194C)</option>
                      <option value="TDS Receivable – Professional (194J)">TDS Receivable – Professional (194J)</option>
                      <option value="TDS Receivable – Commission">TDS Receivable – Commission</option>
                    </select>
                    <small className="text-muted text-center" style={{ fontSize: 12, opacity: 0.8 }}>
                      Choose the account where deducted tax will be tracked
                    </small>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ✅ IMPROVED: Material UI Table with Skeleton Loading */}
          <div className="mx-5">
            <Paper
              elevation={0}
              sx={{
                mb: 4,
                border: '1px solid #e5e7eb',
                borderRadius: 2,
                overflow: 'hidden'
              }}
            >
              {/* Table Header */}
              <Box
                sx={{
                  px: 3,
                  py: 2,
                  borderBottom: '1px solid #e5e7eb',
                  bgcolor: '#fafafa'
                }}
              >
                <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                  Unpaid Invoices
                </Typography>
              </Box>

              <TableContainer>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f8fafc' }}>
                      <TableCell sx={{ fontWeight: 600, color: '#374151', py: 2, fontSize: 13 }}>
                        Date
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#374151', py: 2, fontSize: 13 }}>
                        Invoice No.
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#374151', py: 2, fontSize: 13 }}>
                        Invoice Amount
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#374151', py: 2, fontSize: 13 }}>
                        Amount Due
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#374151', py: 2, fontSize: 13 }}>
                        Payment Received On
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#374151', py: 2, fontSize: 13 }}>
                        Amount Used
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* Loading State */}
                    {tableLoading && <TableSkeleton />}

                    {/* Data Rows */}
                    {!tableLoading && usageRows.length > 0 && usageRows.map((row, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          '&:nth-of-type(odd)': { bgcolor: '#fafbfc' },
                          '&:nth-of-type(even)': { bgcolor: '#ffffff' },
                          '&:hover': { bgcolor: '#f0f7ff' },
                          transition: 'background-color 0.15s ease',
                        }}
                      >
                        <TableCell sx={{ py: 2, fontSize: 13, color: '#6b7280' }}>
                          {row.date}
                        </TableCell>
                        <TableCell sx={{ py: 2, fontSize: 13 }}>
                          <Chip
                            label={row.invoiceNumber}
                            size="small"
                            sx={{
                              bgcolor: '#e0f2fe',
                              color: '#0369a1',
                              fontWeight: 500,
                              fontSize: 12,
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ py: 2, fontSize: 13, fontWeight: 500 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Typography variant="caption" color="text.secondary">₹</Typography>
                            <span>{formatCurrency(row.invoiceAmount)}</span>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ py: 2, fontSize: 13 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Typography variant="caption" color="text.secondary">₹</Typography>
                            <Typography
                              component="span"
                              sx={{
                                fontWeight: 600,
                                fontSize: 14,
                                color: row.amountDue > 0 ? '#dc2626' : '#16a34a'
                              }}
                            >
                              {formatCurrency(row.amountDue)}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ py: 2, fontSize: 13, color: '#6b7280' }}>
                          {row.paymentReceivedOn}
                        </TableCell>
                        <TableCell sx={{ py: 1.5 }}>
                          <TextField
                            type="number"
                            size="small"
                            placeholder='0'
                            value={row.paymentUsed}
                            disabled={receivedFullAmount}
                            inputProps={{
                              min: 0,
                              max: row.amountDue,
                              style: {
                                fontSize: 13,
                                padding: '8px 12px',
                                MozAppearance: 'textfield',
                              },
                            }}
                            sx={{
                              width: 120,

                              '& .MuiOutlinedInput-root': {
                                backgroundColor: '#fff',

                                '& fieldset': {
                                  border: 'none',
                                  borderColor: '#d1d5db',
                                },

                                '&:hover fieldset': {
                                  borderColor: '#7991BB',
                                },

                                '&.Mui-focused fieldset': {
                                  borderColor: '#7991BB',
                                  borderWidth: 1.5,
                                },
                              },

                              '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                                display: 'none',
                              },
                            }}

                            onChange={(e) => {
                              let value = Number(e.target.value) || 0;

                              value = Math.min(value, row.amountDue);

                              const updated = [...usageRows];
                              updated[index].paymentUsed = value;

                              const totalUsed = updated.reduce((sum, r) => sum + r.paymentUsed, 0);

                              const received = Number(formData.paymentRecord.amountReceived || 0);

                              if (totalUsed > received) {
                                const remaining = received - (totalUsed - value);
                                updated[index].paymentUsed = Math.max(0, remaining);
                              }

                              const finalTotal = updated.reduce((sum, r) => sum + r.paymentUsed, 0);

                              setUsageRows(updated);
                              setSummary((prev) => ({ ...prev, amountUsed: finalTotal }));
                            }}

                          />
                        </TableCell>
                      </TableRow>
                    ))}

                    {/* Empty State */}
                    {!tableLoading && usageRows.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              {formData.paymentRecord.customerId
                                ? 'There are no unpaid invoices associated with this customer.'
                                : 'Select a customer to view unpaid invoices.'}
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            {/* Summary + Notes - Same as before */}
            <div className="notes-summary-row">
              <div className="notes-column">
                <div className="so-form-group">
                  <label className="so-label text-sm text-muted-foreground fw-bold">Customer Notes:</label>
                  <textarea
                    className="form-control so-control textarea"
                    name="paymentRecord.customerNotes"
                    value={formData.paymentRecord.customerNotes}
                    onChange={handleChange}
                    placeholder="Add note for customer..."
                  />
                </div>
              </div>

              <div className="summary-column" style={{ background: '#ffff' }}>
                <div className="border rounded p-3" style={{ minHeight: '200px', fontSize: 13, borderRadius: 10 }}>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Amount Received:</span>
                    <strong>₹ {summary.amountReceived}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Amount Used:</span>
                    <strong>₹ {summary.amountUsed}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Amount Refunded:</span>
                    <strong>₹ {summary.amountRefunded}</strong>
                  </div>
                  <div className="d-flex justify-content-between mt-2 pt-2 border-top">
                    <span>Amount in Excess:</span>
                    <strong>₹ {summary.amountExcess}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="form-actions">
              <button
                type="button"
                className="btn border me-3 px-4"
                style={{ fontSize: 14 }}
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn me-3 px-4"
                style={{ background: '#7991BB', color: '#FFF', fontSize: 14 }}
                disabled={summary.amountUsed === 0}
                onClick={() => setSubmitAction('paid')}
              >
                Save and paid
              </button>
              <button
                type="submit"
                className="btn border me-3 px-4"
                style={{ fontSize: 14 }}
                onClick={() => setSubmitAction('draft')}
              >
                Save and draft
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Settings Modal - Same as before */}
      {showSettings && (
        <div className="settings-overlay" onClick={closePopup}>
          <div
            className={`settings-modal ${closing ? 'closing' : 'opening'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header custom-header">
              <h4 className="mb-0" style={{ fontSize: 17 }}>Configure Payment ID Preferences</h4>
              <X size={20} style={{ cursor: 'pointer', color: '#fc0404ff' }} onClick={closePopup} />
            </div>

            <div className="modal-body mt-3">
              <p style={{ fontSize: 13, color: '#555' }}>
                Your payment ID are currently set to auto-generate numbers. Change settings if needed.
              </p>

              <div className="form-check mb-3">
                <input
                  type="radio"
                  name="mode"
                  className="form-check-input"
                  checked={mode === 'auto'}
                  onChange={() => setMode('auto')}
                />
                <label className="form-check-label fw-normal">
                  Continue auto-generating Payment Id Numbers
                </label>
                <span className="i-btn">
                  <Info size={13} />
                </span>
              </div>

              {mode === 'auto' && (
                <div className="auto-settings">
                  <div className="auto-settings-row">
                    <div style={{ flex: 1, fontSize: 13 }}>
                      <label className="so-label text-sm text-muted-foreground fw-bold">Prefix pattern</label>
                      <select
                        className="form-select so-control"
                        value={prefixPattern}
                        onChange={(e) => setPrefixPattern(e.target.value)}
                      >
                        <option value="" disabled>-- Select prefix --</option>
                        <option value="YEAR">Current year (YYYY-)</option>
                        <option value="YEAR_MONTH">Current year + month (YYYYMM-)</option>
                        <option value="DATE_DDMMYYYY">Current date (DDMMYYYY-)</option>
                        <option value="YEAR_SLASH_MONTH">Year/Month (YYYY/MM-)</option>
                      </select>
                      <small className="text-muted d-block mt-1">
                        Example prefix: {buildPrefixFromPattern(prefixPattern)}
                      </small>
                    </div>

                    <div style={{ flex: 1, fontSize: 13 }} className="so-form-group mb-4">
                      <label className="so-label text-sm text-muted-foreground fw-bold">Next Number</label>
                      <input
                        value={nextNumber}
                        onChange={(e) => setNextNumber(e.target.value)}
                        className="form-control so-control border"
                        placeholder="001"
                      />
                      <small className="text-muted d-block mt-1">
                        Full example: {buildPrefixFromPattern(prefixPattern)}{nextNumber || '001'}
                      </small>
                    </div>
                  </div>

                  <div className="mt-3">
                    <label style={{ fontSize: 13 }}>
                      <input
                        type="checkbox"
                        checked={restartYear}
                        onChange={(e) => setRestartYear(e.target.checked)}
                        className="me-2"
                      />
                      Restart numbering every fiscal year.
                    </label>
                  </div>
                </div>
              )}

              <div className="form-check mt-4">
                <input
                  type="radio"
                  name="mode"
                  className="form-check-input"
                  checked={mode === 'manual'}
                  onChange={() => setMode('manual')}
                />
                <label className="form-check-label fw-normal">Enter Payment IDs manually</label>
              </div>

              <div className="d-flex justify-content-center mt-4" style={{ gap: 10 }}>
                <button className="btn border me-3 px-4" onClick={closePopup}>
                  Cancel
                </button>
                <button
                  className="btn me-2 px-4"
                  style={{ background: '#7991BB', color: '#FFF' }}
                  onClick={applyAutoSO}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
