import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../../components/Header/Header';
import Toast, { useToast } from '../../../../components/Toast/Toast';
import './recordPayment.css';
import { Info, Settings, X } from 'react-feather';

// ------------------- Interfaces -------------------

export interface PaymentFormData {

  paymentRecord: {
    customerName: string;
    amountReceived: string;
    paymentDate: string;
    paymentId: string;
    paymentMode: string;
    reference: string;
    taxDeducted: 'no' | 'yes';
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
  invoiceNumber: string;
  invoiceAmount: number;
  amountDue: number;
  paymentReceivedOn: string;
  paymentUsed: number;
}

// export interface PaymentSummary {
//   amountReceived: number;
//   amountUsed: number;
//   amountRefunded: number;
//   amountExcess: number;
// }

// export interface PaymentUsageRow {
//   date: string;
//   invoiceNumber: string;
//   invoiceAmount: number;
//   amountDue: number;
//   paymentReceivedOn: string;
//   paymentUsed: number;
// }

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
      customerName: '',
      amountReceived: '',
      paymentDate: new Date().toISOString().split('T')[0],
      paymentId: '',
      paymentMode: '',
      reference: '',
      taxDeducted: 'no',
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
      amountExcess: rcv - used - refund,
    }));
  }, [formData.paymentRecord.amountReceived, summary.amountUsed, summary.amountRefunded]);


  // ---------------- Submit ----------------
  // ✅ FIXED: Proper handleSubmit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // ✅ FIXED: Build finalPayload
    const finalPayload = {
      ...formData.paymentRecord,
      amountReceived: Number(formData.paymentRecord.amountReceived),
      usageRows,
      summary,
    };

    console.log('Payment Saved:', finalPayload);
    alert('Payment Saved Successfully!');

    const existing = JSON.parse(localStorage.getItem('payments') || '[]');
    existing.push(finalPayload);
    localStorage.setItem('payments', JSON.stringify(existing));

    navigate('/sales/payment-received');
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
                    name="paymentRecord.customerName"
                    className="form-select so-control"
                    value={formData.paymentRecord.customerName}
                    onChange={handleChange}
                  >
                    <option value="">Select Customer</option>
                    <option value="Customer A">Customer A</option>
                    <option value="Customer B">Customer B</option>
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
                  />
                  <div className="form-check" style={{ fontSize: 12 }}>
                    <input type="checkbox" className="me-2 border" id="fullAmount" />
                    <label htmlFor="fullAmount" className="form-check-label" >
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
                    Tax Deducted:
                  </label>
                  <div className="radio-row">
                    <div className="form-check">
                      <input
                        type="radio"
                        id="taxNo"
                        className="form-check-input me-2"
                        name="paymentRecord.taxDeducted"
                        value="no"
                        checked={formData.paymentRecord.taxDeducted === 'no'}
                        onChange={handleChange}
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
                        name="paymentRecord.taxDeducted"
                        value="yes"
                        checked={formData.paymentRecord.taxDeducted === 'yes'}
                        onChange={handleChange}
                      />
                      <label htmlFor="taxYes" className="form-check-label small">
                        Yes, TDS (Income Tax)
                      </label>
                    </div>
                  </div>
                </div>

                {formData.paymentRecord.taxDeducted === 'yes' && (
                  <div className="so-form-group mb-4">
                    <label className="so-label text-sm text-muted-foreground fw-bold">
                      TDS Amount (%):
                    </label>
                    <select
                      name="paymentRecord.tdsRate"
                      className="form-select so-control"
                      value={formData.paymentRecord.tdsRate}
                      onChange={handleChange}
                    >
                      <option value="">Select TDS Rate</option>
                      <option value="1">1%</option>
                      <option value="5">5%</option>
                      <option value="10">10%</option>
                    </select>
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
                <span className="item-card-title">Payment Usage Table</span>
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
                        <td >{formData.paymentRecord.paymentDate}</td>
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
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              const updated = [...usageRows];
                              updated[index].paymentUsed = Number(e.target.value);
                              setUsageRows(updated);
                              const totalUsed = updated.reduce((sum: number, r: PaymentUsageRow) => sum + r.paymentUsed, 0);
                              setSummary(prev => ({ ...prev, amountUsed: totalUsed }));
                            }}
                          />
                        </td>
                      </tr>
                    ))}
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
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn px-4"
                style={{ background: '#7991BB', color: '#FFF' }}
              >
                Save Payment
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
