import type React from 'react';
import Header from '../../../../components/Header/Header';
import Toast, { useToast } from '../../../../components/Toast/Toast';
import Tabs from '../../../../components/Tab/Tabs';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Info, Settings, Upload, X } from 'react-feather';
import { FeatherUpload } from '../../../Sales/Customers/AddCustomer/Add';

const noSpinnerStyle = {
  '-webkit-appearance': 'textfield',
  '-moz-appearance': 'textfield',
  appearance: 'textfield',
} as React.CSSProperties;

interface UsageRow {
  date: string;
  invoiceNumber: string;
  invoiceAmount: number;
  amountDue: number;
  paymentReceivedOn: string;
  paymentUsed: number;
}

interface Summary {
  amountReceived: number;
  amountUsed: number;
  amountRefunded: number;
  amountExcess: number;
}

const AddPaymentMade: React.FC = () => {
  const [activeTab, setActiveKey] = useState('record-expense');
  const navigate = useNavigate();
  const { toast, setToast, showToast } = useToast();

  // Bill Payment Form State
  const [formData, setFormData] = useState({
    vendorName: '',
    paymentNumber: '',
    currency: '₹',
    amount: '',
    paymentDate: '',
    paymentMode: '',
    paidThrough: '',
    reference: '',
    customerNotes: '',
  });

  // Table + Summary State
  const [usageRows, setUsageRows] = useState<UsageRow[]>([
    {
      date: '2025-12-10',
      invoiceNumber: 'INV-001',
      invoiceAmount: 50000,
      amountDue: 25000,
      paymentReceivedOn: '2025-12-12',
      paymentUsed: 0,
    },
    {
      date: '2025-12-11',
      invoiceNumber: 'INV-002',
      invoiceAmount: 30000,
      amountDue: 15000,
      paymentReceivedOn: '2025-12-13',
      paymentUsed: 0,
    },
  ]);

  const [summary, setSummary] = useState<Summary>({
    amountReceived: 0,
    amountUsed: 0,
    amountRefunded: 0,
    amountExcess: 0,
  });

  // SETTING MODAL STATES
  const [showSettings, setShowSettings] = useState(false);
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');
  const [prefix, setPrefix] = useState('');
  const [nextNumber, setNextNumber] = useState('');
  const [restartYear, setRestartYear] = useState(false);
  const [closing, setClosing] = useState(false);

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ---------------- Apply Auto Payment ID ----------------
  const applyAutoSO = () => {
    if (mode === 'auto') {
      setFormData((prev) => ({
        ...prev,
        paymentId: prefix + nextNumber,
      }));
    }
    closePopup();
  };

  const handleUsageChange = (index: number, value: number) => {
    const updated = [...usageRows];
    updated[index].paymentUsed = value;
    setUsageRows(updated);

    const totalUsed = updated.reduce((sum, r) => sum + r.paymentUsed, 0);
    const amountReceived = Number(formData.amount) || 0;

    setSummary((prev) => ({
      ...prev,
      amountUsed: totalUsed,
      amountReceived,
      amountRefunded: 0,
      amountExcess: Math.max(0, amountReceived - totalUsed),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Bill Payment submitted:', { formData, usageRows, summary });
    sessionStorage.setItem('formSuccess', 'Payment saved');
    navigate('/purchases/payments-made');
  };

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFormData((prev) => ({ ...prev, paymentDate: today }));
  }, []);

  const billPayment = () => (
    <div className="sales-orders-page">
      <form onSubmit={handleSubmit} className="sales-order-form">
        {/* TOP DETAILS CARD - 3 columns */}
        <div className="so-details-card mx-5 mb-4">
          <h1 className="sales-order-title mb-4">Bill Payment</h1>

          <div className="row g-3 three-column-form">
            {/* COLUMN 1: Vendor Name + Payment Mode */}
            <div className="col-lg-4">
              <div className="so-form-group mb-4">
                <label className="so-label text-sm text-muted-foreground fw-bold">
                  Vendor Name:
                </label>
                <select
                  name="vendorName"
                  className="form-select so-control"
                  value={formData.vendorName}
                  onChange={handleChange}
                >
                  <option value="">Select Vendor</option>
                  <option value="Vendor A">Vendor A</option>
                  <option value="Vendor B">Vendor B</option>
                  <option value="Vendor C">Vendor C</option>
                </select>
              </div>

              <div className="so-form-group mb-4">
                <label className="so-label text-sm text-muted-foreground fw-bold">
                  Payment Mode:
                </label>
                <select
                  name="paymentMode"
                  className="form-select so-control"
                  value={formData.paymentMode}
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
                  Reference#:
                </label>
                <input
                  type="text"
                  name="reference"
                  className="form-control so-control"
                  value={formData.reference}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* COLUMN 2: Payment Made + Paid Through */}
            <div className="col-lg-4">
              <div className="so-form-group mb-4">
                <label className="so-label text-sm text-muted-foreground fw-bold">
                  Payment Made:
                </label>
                <div className="d-flex gap-2">
                  <select
                    name="currency"
                    className="form-select so-control"
                    style={{ width: '70px' } as React.CSSProperties}
                    value={formData.currency}
                    onChange={handleChange}
                  >
                    <option value="₹">IND</option>
                    <option value="$">USD</option>
                    <option value="€">CAD</option>
                  </select>
                  <input
                    type="number"
                    name="amount"
                    className="form-control so-control flex-grow-1"
                    style={noSpinnerStyle}
                    value={formData.amount}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="so-form-group mb-4">
                <label className="so-label text-sm text-muted-foreground fw-bold">
                  Paid Through:
                </label>
                <select
                  name="paidThrough"
                  className="form-select so-control"
                  value={formData.paidThrough}
                  onChange={handleChange}
                >
                  <option value="">Select Method</option>
                  <option value="Bank Account">Bank Account</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Cash">Cash</option>
                  <option value="Digital Wallet">Digital Wallet</option>
                </select>
              </div>
            </div>

            {/* COLUMN 3: Payment Date + Payment # + Reference */}
            <div className="col-lg-4">
              <div className="so-form-group mb-4">
                <label className="so-label text-sm text-muted-foreground fw-bold">
                  Payment Date:
                </label>
                <input
                  type="date"
                  name="paymentDate"
                  className="form-control so-control"
                  value={formData.paymentDate}
                  onChange={handleChange}
                />
              </div>

              <div className="so-form-group mb-4 position-relative">
                <label className="so-label text-sm text-muted-foreground fw-bold">Payment #:</label>
                <input
                  type="text"
                  name="paymentNumber"
                  className="form-control so-control"
                  value={formData.paymentNumber}
                  onChange={handleChange}
                  style={{ paddingRight: '35px' } as React.CSSProperties}
                />
                <span className="so-settings-icon" onClick={() => setShowSettings(true)}>
                  <Settings size={16} />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* OUTSIDE CARD - Payment Usage Table + Summary + Notes */}
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
                    <tr key={index}>
                      <td>{row.date}</td>
                      <td>{row.invoiceNumber}</td>
                      <td>
                        {formData.currency} {row.invoiceAmount.toLocaleString()}
                      </td>
                      <td>
                        {formData.currency} {row.amountDue.toLocaleString()}
                      </td>
                      <td>{row.paymentReceivedOn}</td>
                      <td>
                        <input
                          type="number"
                          style={noSpinnerStyle}
                          className="form-control form-control-sm border-0 item-input"
                          value={row.paymentUsed || ''}
                          onChange={(e) => handleUsageChange(index, Number(e.target.value) || 0)}
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
                <label className="so-label text-sm text-muted-foreground fw-bold">Note</label>
                <textarea
                  className="form-control so-control textarea"
                  name="customerNotes"
                  value={formData.customerNotes}
                  onChange={handleChange}
                  placeholder="Add note for customer..."
                />
              </div>
            </div>

            <div className="summary-column">
              <div
                className="border rounded p-3"
                style={{ minHeight: '200px' } as React.CSSProperties}
              >
                <div className="d-flex justify-content-between mb-2">
                  <span>Amount Received:</span>
                  <strong>
                    {formData.currency} {Number(formData.amount || 0).toLocaleString()}
                  </strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Amount Used:</span>
                  <strong>
                    {formData.currency} {summary.amountUsed.toLocaleString()}
                  </strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Amount Refunded:</span>
                  <strong>
                    {formData.currency} {summary.amountRefunded.toLocaleString()}
                  </strong>
                </div>
                <div className="d-flex justify-content-between mt-2 pt-2 border-top">
                  <span>Amount in Excess:</span>
                  <strong>
                    {formData.currency} {summary.amountExcess.toLocaleString()}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="row mb-4 mt-3 align-items-start">
            <label className="so-label text-sm text-muted-foreground fw-bold">Documents:</label>
            <div className="col-sm-12">
              <div
                onClick={() => document.getElementById('fileUploadInput')?.click()}
                className="doc-upload-box"
              >
                <FeatherUpload size={32} className="text-muted mb-2" />
                <span className="text-secondary small">Click to Upload Documents</span>

                <input
                  id="fileUploadInput"
                  type="file"
                  multiple
                  className="d-none"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files?.length) {
                      console.log('Files uploaded:', files);
                      alert(`${files.length} file(s) selected!`);
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="form-actions">
            <button type="button" className="btn border me-3 px-4" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn px-4"
              style={{ background: '#7991BB', color: '#FFF' } as React.CSSProperties}
            >
              Save Payment
            </button>
          </div>
        </div>
      </form>
    </div>
  );

  const vendorAdvance = () => {
    // Vendor Advance State
    const [vendorFormData, setVendorFormData] = useState({
      vendorName: '',
      paymentNumber: '',
      currency: '₹',
      amount: '',
      tds: '',
      paymentDate: '',
      paymentMode: '',
      paidThrough: '',
      depositTo: '',
      reference: '',
      note: '',
    });

    useEffect(() => {
      const today = new Date().toISOString().split('T')[0];
      setVendorFormData((prev) => ({ ...prev, paymentDate: today }));
    }, []);

    const handleVendorChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    ) => {
      const { name, value } = e.target;
      setVendorFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };

    const handleVendorSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      console.log('Vendor Advance submitted:', vendorFormData);
    };

    return (
      <div className="sales-orders-page">
        <form onSubmit={handleVendorSubmit} className="sales-order-form">
          {/* TOP DETAILS CARD - 3 columns (3+3+2 fields) */}
          <div className="so-details-card mx-5 mb-4">
            <h1 className="sales-order-title mb-4">Vendor Advance</h1>

            <div className="row g-3 three-column-form">
              {/* COLUMN 1: Vendor Name + Payment Mode + Paid Through (3 fields) */}
              <div className="col-lg-4">
                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">
                    Vendor Name:
                  </label>
                  <select
                    name="vendorName"
                    className="form-select so-control"
                    value={vendorFormData.vendorName}
                    onChange={handleVendorChange}
                  >
                    <option value="">Select Vendor</option>
                    <option value="Vendor A">Vendor A</option>
                    <option value="Vendor B">Vendor B</option>
                    <option value="Vendor C">Vendor C</option>
                  </select>
                </div>

                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">
                    Payment Mode:
                  </label>
                  <select
                    name="paymentMode"
                    className="form-select so-control"
                    value={vendorFormData.paymentMode}
                    onChange={handleVendorChange}
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
                    Paid Through:
                  </label>
                  <select
                    name="paidThrough"
                    className="form-select so-control"
                    value={vendorFormData.paidThrough}
                    onChange={handleVendorChange}
                  >
                    <option value="">Select Method</option>
                    <option value="Bank Account">Bank Account</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Cash">Cash</option>
                    <option value="Digital Wallet">Digital Wallet</option>
                  </select>
                </div>
              </div>

              {/* COLUMN 2: Payment Made + TDS + Deposit To (3 fields) */}
              <div className="col-lg-4">
                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">
                    Payment Made:
                  </label>
                  <div className="d-flex gap-2">
                    <select
                      name="currency"
                      className="form-select so-control"
                      style={{ width: '70px' } as React.CSSProperties}
                      value={vendorFormData.currency}
                      onChange={handleVendorChange}
                    >
                      <option value="₹">IND</option>
                      <option value="$">USD</option>
                      <option value="€">CAD</option>
                    </select>
                    <input
                      type="number"
                      name="amount"
                      className="form-control so-control flex-grow-1"
                      style={noSpinnerStyle}
                      value={vendorFormData.amount}
                      onChange={handleVendorChange}
                    />
                  </div>
                </div>

                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">TDS:</label>
                  <select
                    name="tds"
                    className="form-select so-control"
                    value={vendorFormData.tds}
                    onChange={handleVendorChange}
                  >
                    <option value="">Select TDS</option>
                    <option value="0">No TDS</option>
                    <option value="1">1%</option>
                    <option value="2">2%</option>
                    <option value="5">5%</option>
                    <option value="10">10%</option>
                  </select>
                </div>

                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">
                    Deposit To:
                  </label>
                  <select
                    name="depositTo"
                    className="form-select so-control"
                    value={vendorFormData.depositTo}
                    onChange={handleVendorChange}
                  >
                    <option value="">Select Account</option>
                    <option value="Advance Account">Advance Account</option>
                    <option value="Bank Account">Bank Account</option>
                    <option value="Cash Account">Cash Account</option>
                  </select>
                </div>
              </div>

              {/* COLUMN 3: Payment Date + Payment # + Reference (2 fields + spacer) */}
              <div className="col-lg-4">
                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">
                    Payment Date:
                  </label>
                  <input
                    type="date"
                    name="paymentDate"
                    className="form-control so-control"
                    value={vendorFormData.paymentDate}
                    onChange={handleVendorChange}
                  />
                </div>

                <div className="so-form-group mb-4 position-relative">
                  <label className="so-label text-sm text-muted-foreground fw-bold">
                    Payment #:
                  </label>
                  <input
                    type="text"
                    name="paymentNumber"
                    className="form-control so-control"
                    value={vendorFormData.paymentNumber}
                    onChange={handleVendorChange}
                    style={{ paddingRight: '35px' } as React.CSSProperties}
                  />
                  <span className="so-settings-icon" onClick={() => setShowSettings(true)}>
                    <Settings size={16} />
                  </span>
                </div>

                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">
                    Reference#:
                  </label>
                  <input
                    type="text"
                    name="reference"
                    className="form-control so-control"
                    value={vendorFormData.reference}
                    onChange={handleVendorChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* OUTSIDE CARD - Notes + Documents SIDE BY SIDE */}
          <div className="mx-5">
            <div className="row g-4 mb-4">
              {/* Notes - LEFT */}
              <div className="col-lg-6">
                <div className="so-form-group">
                  <label className="so-label text-sm text-muted-foreground fw-bold">Note:</label>
                  <textarea
                    className="form-control so-control textarea"
                    name="note"
                    value={vendorFormData.note}
                    onChange={handleVendorChange}
                    placeholder="Add note..."
                    rows={4}
                  />
                </div>
              </div>

              {/* Documents - RIGHT */}
              <div className="col-lg-6">
                <div className="so-form-group h-100 d-flex flex-column justify-content-start">
                  <label className="so-label text-sm text-muted-foreground fw-bold mb-2">
                    Documents:
                  </label>
                  <div
                    onClick={() => document.getElementById('fileUploadInput')?.click()}
                    className="doc-upload-box d-flex flex-column align-items-center justify-content-center p-4 border-dashed cursor-pointer flex-grow-1 h-100"
                  >
                    <Upload size={32} className="text-muted mb-2" />
                    <span className="text-secondary small text-center">
                      Click to Upload Documents
                    </span>
                    <input
                      id="fileUploadInput"
                      type="file"
                      multiple
                      className="d-none"
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files?.length) {
                          console.log('Files uploaded:', files);
                          alert(`${files.length} file(s) selected!`);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="form-actions">
              <button type="button" className="btn border me-3 px-4" onClick={() => navigate(-1)}>
                Cancel
              </button>
              <button
                type="submit"
                className="btn px-4"
                style={{ background: '#7991BB', color: '#FFF' }}
              >
                Save Advance
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  };

  const tabs = [
    {
      key: 'record-expense',
      label: 'Bill Payment',
      content: billPayment(),
    },
    {
      key: 'record-mileage',
      label: 'Vendor Advance',
      content: vendorAdvance(),
    },
  ];

  return (
    <>
      <Header />
      <Toast toast={toast} setToast={setToast} />

      <div className="sales-orders-page" style={{ paddingTop: '56px' }}>
        <div className="ps-4">
          <Tabs tabs={tabs} defaultActiveKey="record-expense" onChange={setActiveKey} />
        </div>
        <div className="">{tabs.find((t) => t.key === activeTab)?.content}</div>
      </div>

      {/* ---------------- Settings Modal ---------------- */}
      {showSettings && (
        <div className="settings-overlay" onClick={closePopup}>
          <div
            className={`settings-modal ${closing ? 'closing' : 'opening'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header custom-header">
              <h4 className="mb-0 p-4">Configure Sales Order Number Preferences</h4>
              <X
                size={20}
                style={{ cursor: 'pointer', marginRight: '15px' }}
                onClick={closePopup}
              />
            </div>

            <div className="modal-body mt-3">
              <p style={{ fontSize: '14px', color: '#555' }}>
                Your Sales Orders are currently set to auto-generate numbers. Change settings if
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
                <label className="form-check-label" style={{ fontWeight: 500 }}>
                  Continue auto-generating Sales Order Numbers
                </label>
                <span style={{ marginLeft: '6px', cursor: 'pointer' }}>
                  <Info size={18} />
                </span>
              </div>

              {mode === 'auto' && (
                <div style={{ marginLeft: 25 }}>
                  <div style={{ display: 'flex', gap: 20 }}>
                    <div style={{ flex: 1 }}>
                      <label className="form-label">Prefix</label>
                      <input
                        value={prefix}
                        onChange={(e) => setPrefix(e.target.value)}
                        className="form-control"
                        placeholder="PID-"
                      />
                    </div>

                    <div style={{ flex: 1 }}>
                      <label className="form-label">Next Number</label>
                      <input
                        value={nextNumber}
                        onChange={(e) => setNextNumber(e.target.value)}
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <label>
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

              {/* Manual Mode */}
              <div className="form-check mt-4">
                <input
                  type="radio"
                  name="mode"
                  className="form-check-input"
                  checked={mode === 'manual'}
                  onChange={() => setMode('manual')}
                />
                <label className="form-check-label" style={{ fontWeight: 500 }}>
                  Enter Sales Order Numbers manually
                </label>
              </div>

              <div className="d-flex justify-content-end mt-4" style={{ gap: 10 }}>
                <button className="btn btn-outline-secondary" onClick={closePopup}>
                  Cancel
                </button>
                <button className="btn btn-primary px-4" onClick={applyAutoSO}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddPaymentMade;
