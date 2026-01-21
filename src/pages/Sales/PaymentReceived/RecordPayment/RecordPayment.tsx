import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../../components/Header/Header';
import Toast, { useToast } from '../../../../components/Toast/Toast';
import './recordPayment.css';
import { Info, Settings, X } from 'react-feather';
import api from '../../../../services/api/apiConfig';
import type { Customer } from '../../SalesOrders/AddOrderSales/AddSalesOrders';

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
  }

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
  const { toast, setToast, showToast } = useToast();

  const [showSettings, setShowSettings] = useState(false);
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');
  // const [prefix, setPrefix] = useState('');
  const [nextNumber, setNextNumber] = useState('');
  const [restartYear, setRestartYear] = useState(false);
  const [closing, setClosing] = useState(false);
  const [prefixPattern, setPrefixPattern] = useState<string>('CUSTOM');

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);

  // const [applyFullAmount, setApplyFullAmount] = useState(false);
  const [receivedFullAmount, setReceivedFullAmount] = useState(false);


  const [submitAction, setSubmitAction] = useState<"paid" | "draft">("draft");



  const calculateTotalUnpaid = () => {
    return usageRows.reduce(
      (sum, row) => sum + Number(row.amountDue || 0),
      0
    );
  };


  const applyReceivedFullAmount = () => {
    const totalUnpaid = calculateTotalUnpaid(); // number

    setFormData((prev) => ({
      ...prev,
      paymentRecord: {
        ...prev.paymentRecord,
        amountReceived: totalUnpaid.toFixed(2), // ✅ string
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
    // Reset checkbox
    setReceivedFullAmount(false);

    // Reset amount received
    setFormData((prev) => ({
      ...prev,
      paymentRecord: {
        ...prev.paymentRecord,
        amountReceived: "",
      },
    }));

    // Reset usage rows
    const clearedRows = usageRows.map((row) => ({
      ...row,
      paymentUsed: 0,
    }));
    setUsageRows(clearedRows);

    // Reset summary
    setSummary({
      amountReceived: 0,
      amountUsed: 0,
      amountRefunded: 0,
      amountExcess: 0,
    });
  };



  // const applyFullAmountFIFO = () => {
  //   let remaining = Number(formData.paymentRecord.amountReceived || 0);

  //   const updated = usageRows.map(row => {
  //     if (remaining <= 0) {
  //       return { ...row, paymentUsed: 0 };
  //     }

  //     const used = Math.min(row.amountDue, remaining);
  //     remaining -= used;

  //     return { ...row, paymentUsed: used };
  //   });

  //   setUsageRows(updated);

  //   const totalUsed = updated.reduce(
  //     (sum, r) => sum + r.paymentUsed,
  //     0
  //   );

  //   setSummary(prev => ({
  //     ...prev,
  //     amountUsed: totalUsed,
  //   }));
  // };

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
  // ✅ FIXED: Added missing states with proper types
  const [usageRows, setUsageRows] = useState<PaymentUsageRow[]>([
    {
      date: '',
      invoiceId: 0,
      invoiceNumber: '',
      invoiceAmount: 0,
      amountDue: 0,
      paymentReceivedOn: '',
      paymentUsed: 0,
    },
  ]);

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
        amountReceived: "",
      },
    }));


    if (!customerId) {
      setUsageRows([]);
      return;
    }

    const fetchUnpaidInvoices = async () => {
      try {
        const res = await api.get(
          `invoices/unpaid/?customer=${customerId}`
        );

        // 👇 THIS IS WHERE YOUR LINE GOES
        setUsageRows(
          res.data.map((inv: any) => ({
            invoiceId: inv.id,
            date: inv.invoice_date,
            invoiceNumber: inv.invoice_number,
            invoiceAmount: inv.grand_total,
            amountDue: inv.balance_due,
            paymentReceivedOn: formData.paymentRecord.paymentDate,
            paymentUsed: 0,
          }))
        );


      } catch (err) {
        console.error("Failed to load unpaid invoices", err);
        showToast("Failed to load unpaid invoices", "error");
        setUsageRows([]);
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



  // ---------------- Load customers ----------------
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await api.get<Customer[]>('customers/');
        setCustomers(res.data);
      } catch {
        showToast('Failed to load customers', 'error');
      } finally {
        setLoadingCustomers(false);
      }
    };
    fetchCustomers();
  }, [showToast]);



  // ---------------- Auto fill today's date ----------------
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFormData(prev => ({
      ...prev,
      paymentRecord: { ...prev.paymentRecord, paymentDate: today }
    }));
  }, []);

  useEffect(() => {
    setUsageRows(prev =>
      prev.map((row: PaymentUsageRow) => ({
        ...row,
        paymentReceivedOn: formData.paymentRecord.paymentDate,
      }))
    );
  }, [formData.paymentRecord.paymentDate]);

  // ---------------- Handle Input Change ----------------
  // ✅ FIXED: Proper typed handleChange
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target as { name: string; value: string };

    if (name.includes('paymentRecord.')) {
      const field = name.replace('paymentRecord.', '') as keyof typeof formData.paymentRecord;
      setFormData(prev => ({
        ...prev,
        paymentRecord: { ...prev.paymentRecord, [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value } as PaymentFormData));
    }
  };

  // ---------------- Summary Logic ----------------
  // const [summary, setSummary] = useState<PaymentSummary>({
  //   amountReceived: 0,
  //   amountUsed: 0,
  //   amountRefunded: 0,
  //   amountExcess: 0,
  // });


  useEffect(() => {
    const rcv = Number(formData.paymentRecord.amountReceived || 0);
    const used = summary.amountUsed;
    const refund = summary.amountRefunded;
    setSummary(prev => ({
      ...prev,
      amountReceived: rcv,
      amountUsed: rcv - used - refund,
    }));
  }, [formData.paymentRecord.amountReceived, summary.amountExcess, summary.amountRefunded]);


  // ---------------- Submit ----------------
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const payload = {
        customer: Number(formData.paymentRecord.customerId),
        payment_mode: formData.paymentRecord.paymentMode,
        amount_received: Number(formData.paymentRecord.amountReceived),
        payment_date: formData.paymentRecord.paymentDate,
        payment_id: formData.paymentRecord.paymentId || null,
        reference: formData.paymentRecord.reference || "",
        tax_deducted: formData.paymentRecord.taxDeducted,
        tds_account: formData.paymentRecord.tdsAccount,
        customer_notes: formData.paymentRecord.customerNotes,

        usages: usageRows
          .filter(row => row.paymentUsed > 0)
          .map(row => ({
            invoice: row.invoiceId,
            amount_used: Number(row.paymentUsed),
          })),

        submit_action: submitAction,

      };

      console.log("FINAL PAYMENT PAYLOAD", payload);

      await api.post(
        "payments/create/",
        payload
      );

      showToast("Payment recorded successfully", "success");

      if (summary.amountUsed > Number(formData.paymentRecord.amountReceived)) {
        showToast("Amount used cannot exceed amount received", "error");
        return;
      }

      setTimeout(() => {

        navigate("/sales/payment-received");
      }, 800);

    } catch (error: any) {
      console.error("PAYMENT ERROR:", error.response?.data || error);
      const message =
        error.response?.data?.detail ||
        error.response?.data?.non_field_errors?.[0] ||
        'Failed to create Payment record';

      showToast(message, 'error');
    }
  };


  // ---------------- Apply Auto Payment ID ----------------
  const applyAutoSO = () => {
    if (mode === 'auto') {
      const prefix = buildPrefixFromPattern(prefixPattern);
      const fullNumber = `${prefix}${nextNumber || '001'}`;

      setFormData((prev) => ({
        ...prev,
        paymentRecord: {
          ...prev.paymentRecord,
          paymentId: fullNumber, // ✅ matches the input binding
        },
      }));
    }
    closePopup();
  };
  // ---------------- REMOVE SPINNERS FOR NUMBER INPUT ----------------
  const noSpinnerStyle = {
    MozAppearance: 'textfield' as const,
  };

  return (
    <>
      <Header />
      <Toast toast={toast} setToast={setToast} />

      <div className="sales-orders-page">
        <form onSubmit={handleSubmit} className="sales-order-form">
          {/* TOP DETAILS CARD - 6 fields + radios in 3 columns */}
          <div className="so-details-card mx-5 mb-4">
            <h1 className="sales-order-title mb-4">Record Payment</h1>

            <div className="row g-3 three-column-form">
              {/* COLUMN 1: Customer + Payment Mode */}
              <div className="col-lg-4">
                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">
                    Customer:
                  </label>
                  <select
                    name="paymentRecord.customerId"
                    className="form-select so-control"
                    value={formData.paymentRecord.customerId}
                    onChange={handleChange}
                    disabled={loadingCustomers}
                  >
                    <option value="" >
                      {loadingCustomers ? "Loading customers..." : "Select Customer"}
                    </option>

                    {customers.map((customer) => (
                      <option key={customer.customerId} value={customer.customerId}>
                        {customer.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">
                    Payment Mode:
                  </label>
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
                  <label className="so-label text-sm text-muted-foreground fw-bold">
                    Amount Received:
                  </label>

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

              {/* COLUMN 2: Amount Received + Tax Deducted Radios */}
              <div className="col-lg-4">

                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">
                    Payment Date:
                  </label>
                  <input
                    type="date"
                    name="paymentRecord.paymentDate"
                    className="form-control so-control"
                    value={formData.paymentRecord.paymentDate}
                    onChange={handleChange}
                  />
                </div>

                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">
                    Payment ID:
                  </label>

                  <div style={{ position: 'relative', width: '100%' }}>

                    <input
                      type="text"
                      name="paymentRecord.paymentId"
                      className="form-control so-control"
                      value={formData.paymentRecord.paymentId}
                      onChange={handleChange}
                      style={{ paddingRight: '35px' }}
                    />
                    <span style={{
                      position: 'absolute',
                      right: '10px',
                      top: '45%',
                      transform: 'translateY(-50%)',
                      cursor: 'pointer',
                      color: '#6c757d',
                    }} onClick={() => setShowSettings(true)}>
                      <Settings size={16} />
                    </span>
                  </div>

                </div>

                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">
                    Reference:
                  </label>
                  <input
                    type="text"
                    name="paymentRecord.reference"
                    className="form-control so-control"
                    value={formData.paymentRecord.reference}
                    onChange={handleChange}
                  />
                </div>

              </div>

              {/* COLUMN 3: TDS Rate (conditional) + Payment Date + Payment ID + Reference */}
              <div className="col-lg-4">

                <div className="so-form-group" style={{ marginBottom: 36 }}>
                  <label className="so-label text-sm text-muted-foreground fw-bold">
                    Tax Deducted?
                  </label>

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
                              tdsAccountId: null, // reset
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
                    <label className="so-label text-sm text-muted-foreground fw-bold">
                      TDS Account
                    </label>

                    <select
                      className="form-select so-control"
                      value={formData.paymentRecord.tdsAccount || ""}
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

                      {/* Example static options (later API-driven) */}
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

          {/* OUTSIDE CARD - Custom Payment Usage Table + Summary */}
          <div className="mx-5">
            {/* Payment Usage Table */}
            <div className="item-card mb-4">
              <div className="item-card-header">
                <span className="item-card-title">Unpaid Invoices</span>
              </div>
              <div className="item-card-body">
                <table className="table table-sm align-middle item-table-inner">
                  <thead>
                    <tr>
                      <th className="fw-medium text-dark">Date</th>
                      <th className="fw-medium text-dark">Invoice No.</th>
                      <th className="fw-medium text-dark">Invoice Amount</th>
                      <th className="fw-medium text-dark">Amount Due</th>
                      <th className="fw-medium text-dark">Payment Received On</th>
                      <th className="fw-medium text-dark">Amount Used</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usageRows.map((row, index) => (
                      <tr key={index} style={{ fontSize: 12 }}>
                        <td >{row.date}</td>
                        <td>{row.invoiceNumber}</td>
                        <td>₹ {row.invoiceAmount}</td>
                        <td>₹ {row.amountDue}</td>
                        <td>{row.paymentReceivedOn}</td>
                        <td>
                          <input
                            type="number"
                            style={noSpinnerStyle}
                            className="form-control form-control-sm border-0 item-input"
                            value={row.paymentUsed}
                            disabled={receivedFullAmount}
                            min={0}
                            max={row.amountDue}
                            onChange={(e) => {
                              let value = Number(e.target.value) || 0;

                              // Do not exceed invoice balance
                              value = Math.min(value, row.amountDue);

                              const updated = [...usageRows];
                              updated[index].paymentUsed = value;

                              const totalUsed = updated.reduce(
                                (sum, r) => sum + r.paymentUsed,
                                0
                              );

                              // Do not exceed amount received
                              if (totalUsed > Number(formData.paymentRecord.amountReceived || 0)) {
                                return;
                              }

                              setUsageRows(updated);
                              setSummary(prev => ({ ...prev, amountUsed: totalUsed }));
                            }}

                          />
                        </td>
                      </tr>
                    ))}
                    {/* EMPTY STATE */}
                    {usageRows.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center text-muted py-3">
                          There are no unpaid invoices associated with this customer.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary + Notes */}
            <div className="notes-summary-row">
              <div className="notes-column">
                <div className="so-form-group">
                  <label className="so-label text-sm text-muted-foreground fw-bold">
                    Customer Notes:
                  </label>
                  <textarea
                    className="form-control so-control textarea"
                    name="paymentRecord.customerNotes"
                    value={formData.paymentRecord.customerNotes}
                    onChange={handleChange}
                    placeholder="Add note for customer..."
                  />
                </div>
              </div>

              <div className="summary-column" style={{ background: "#ffff" }}>
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

      {/* ---------------- Settings Modal ---------------- */}
      {showSettings && (
        <div className="settings-overlay" onClick={closePopup}>
          <div
            className={`settings-modal ${closing ? 'closing' : 'opening'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header custom-header">
              <h4 className="mb-0" style={{ fontSize: 17 }}>Configure Sales Order Number Preferences</h4>
              <X
                size={20}
                style={{ cursor: 'pointer', color: '#fc0404ff' }}
                onClick={closePopup}
              />
            </div>

            <div className="modal-body mt-3">
              <p style={{ fontSize: 13, color: '#555' }}>
                Your payment Id are currently set to auto-generate numbers. Change settings if
                needed.
              </p>

              {/* Auto Mode */}
              <div className="form-check mb-3">
                <input
                  type="radio"
                  name="mode"
                  className="form-check-input"
                  checked={mode === 'auto'}
                  onChange={() => setMode('auto')}
                />
                <label className="form-check-label fw-normal" >
                  Continue auto-generating Payment Id Numbers
                </label>
                <span className='i-btn'>
                  <Info size={13} />
                </span>
              </div>

              {mode === 'auto' && (
                <div className="auto-settings">
                  <div className="auto-settings-row">
                    {/* PREFIX PATTERN SELECT */}
                    <div style={{ flex: 1, fontSize: 13 }}>
                      <label className="so-label text-sm text-muted-foreground fw-bold">Prefix pattern</label>
                      <select
                        className="form-select so-control p-6 pt-1 flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
                        value={prefixPattern}
                        onChange={(e) => setPrefixPattern(e.target.value)}
                      >
                        <option value="" disabled>
                          -- Select prefix --
                        </option>
                        <option value="YEAR">Current year (YYYY-)</option>
                        <option value="YEAR_MONTH">Current year + month (YYYYMM-)</option>
                        <option value="DATE_DDMMYYYY">Current date (DDMMYYYY-)</option>
                        <option value="YEAR_SLASH_MONTH">Year/Month (YYYY/MM-)</option>
                      </select>
                      <small className="text-muted d-block mt-1">
                        Example prefix: {buildPrefixFromPattern(prefixPattern)}
                      </small>
                    </div>

                    {/* NEXT NUMBER */}
                    <div style={{ flex: 1, fontSize: 13 }} className="so-form-group mb-4">
                      <label className="so-label text-sm text-muted-foreground fw-bold">Next Number</label>
                      <input
                        value={nextNumber}
                        onChange={(e) => setNextNumber(e.target.value)}
                        className="form-control so-control border"
                        placeholder="001"
                      />
                      <small className="text-muted d-block mt-1">
                        Full example: {buildPrefixFromPattern(prefixPattern)}
                        {nextNumber || '001'}
                      </small>
                    </div>
                  </div>

                  <div className="mt-3">
                    <label style={{ fontSize: 13 }}>
                      <input
                        type="checkbox"
                        checked={restartYear}
                        onChange={(e) => setRestartYear(e.target.checked)}
                        // style={{ fontSize: 12 }}
                        className="me-2"
                      />
                      Restart numbering every fiscal year.
                    </label>
                  </div>
                </div>
              )}

              {/* Manual Mode */}
              <div className="form-check mt-4">
                <input
                  type="radio"
                  name="mode"
                  className="form-check-input"
                  checked={mode === 'manual'}
                  onChange={() => setMode('manual')}
                />
                <label className="form-check-label fw-normal" >
                  Enter Sales Order Numbers manually
                </label>
              </div>

              <div className="d-flex justify-content-center mt-4" style={{ gap: 10 }}>
                <button className="btn border me-3 px-4" onClick={closePopup}>
                  Cancel
                </button>
                <button className="btn me-2 px-4"
                  style={{ background: '#7991BB', color: '#FFF' }} onClick={applyAutoSO}>
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
