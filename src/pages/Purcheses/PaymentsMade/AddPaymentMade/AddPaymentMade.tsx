import type React from 'react';
import Header from '../../../../components/Header/Header';
import { Toast } from '../../../../components/Toast/Toast';
import { useGlobalToast } from '../../../../components/Toast/ToastContext';
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

// BILL PAYMENT FORM

export interface BillPaymentFormData {
  billPaymentRecord: BillPaymentRecord;

  billPaymentSummary: BillPaymentSummary;

  billPaymentUsageRows: BillPaymentUsageRow[];
}


export interface BillPaymentRecord {
  vendorName: string;
  paymentMode: string;
  reference: string;

  currency: string;
  amount: number;

  paidThrough: string;
  paymentDate: string;
  paymentNumber: string;

  customerNotes: string;
}


export interface BillPaymentUsageRow {
  date: string;
  invoiceNumber: string;
  invoiceAmount: number;
  amountDue: number;
  paymentReceivedOn: string;
  amountUsed: number;
}


export interface BillPaymentSummary {
  amountReceived: number;
  amountUsed: number;
  amountRefunded: number;
  amountExcess: number;
}

// VENDOR ADVANCE PAYMENT FORM
export interface VendorAdvanceFormData {
  vendorAdvanceRecord: VendorAdvanceRecord;
}


export interface VendorAdvanceRecord {
  vendorName: string;
  paymentMode: string;
  paidThrough: string;

  currency: string;
  amount: number;

  tds: string;
  depositTo: string;

  paymentDate: string;
  paymentNumber: string;
  reference: string;

  note: string;
}



const AddPaymentMade: React.FC = () => {
  const [activeTab, setActiveKey] = useState('record-expense');
  const navigate = useNavigate();
const { toast, setToast, showToast } = useGlobalToast();

  // Bill Payment Form State
  const [formData, setFormData] = useState<BillPaymentFormData>({
    billPaymentRecord: {
      vendorName: '',
      paymentMode: '',
      reference: '',

      currency: '₹',
      amount: 0,

      paidThrough: '',
      paymentDate: new Date().toISOString().split('T')[0],
      paymentNumber: '',

      customerNotes: '',
    },

    billPaymentSummary: {
      amountReceived: 0,
      amountUsed: 0,
      amountRefunded: 0,
      amountExcess: 0,
    },

    billPaymentUsageRows: [
      {
        date: '',
        invoiceNumber: '',
        invoiceAmount: 0,
        amountDue: 0,
        paymentReceivedOn: '',
        amountUsed: 0,
      },
    ],
  });


  // Table + Summary State
  // const [usageRows, setUsageRows] = useState<BillPaymentUsageRow[]>([
  //   {
  //     date: '',
  //     invoiceNumber: '',
  //     invoiceAmount: 0,
  //     amountDue: 0,
  //     paymentReceivedOn: '',
  //     amountUsed: 0,
  //   },
  // ]);


  const [usageRows, setUsageRows] = useState<BillPaymentUsageRow[]>([]);


  // const [summary, setSummary] = useState<BillPaymentSummary>({
  //   amountReceived: 0,
  //   amountUsed: 0,
  //   amountRefunded: 0,
  //   amountExcess: 0,
  // });




  // SETTING MODAL STATES
  const [showSettings, setShowSettings] = useState(false);
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');
  const [nextNumber, setNextNumber] = useState('');
  const [restartYear, setRestartYear] = useState(false);
  const [closing, setClosing] = useState(false);
  const [prefixPattern, setPrefixPattern] = useState<string>('CUSTOM');


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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      billPaymentRecord: {
        ...prev.billPaymentRecord,
        [name]: value,
      },
    }));
  };


  // ---------------- Apply Auto Payment ID ----------------
  const applyAutoSO = () => {
    if (mode === 'auto') {

      const prefix = buildPrefixFromPattern(prefixPattern);
      const fullNumber = `${prefix}${nextNumber || '001'}`;

      setFormData((prev) => ({
        ...prev,
        billPaymentRecord: {
          ...prev.billPaymentRecord,
          paymentNumber: fullNumber,
        },
      }));
    }
    closePopup();
  };

  const handleUsageChange = (index: number, value: number) => {
    const updated = [...usageRows];
    updated[index].amountUsed = value;
    setUsageRows(updated);

    const totalUsed = updated.reduce((sum, r) => sum + r.amountUsed, 0);
    const amountReceived = formData.billPaymentRecord.amount || 0;

    setFormData((prev) => ({
      ...prev,
      billPaymentSummary: {
        amountReceived,
        amountUsed: totalUsed,
        amountRefunded: 0,
        amountExcess: Math.max(0, amountReceived - totalUsed),
      },
    }));

  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Bill Payment submitted:', {
      billPaymentRecord: formData.billPaymentRecord,
      billPaymentSummary: formData.billPaymentSummary,
      billPaymentUsage: usageRows,
    });

    sessionStorage.setItem('formSuccess', 'Payment saved');
    navigate('/purchases/payments-made');
  };


  // helper: build prefix string from pattern
  const buildPrefixFromPattern = (pattern: string) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    switch (pattern) {
      case 'YEAR':
        return `PO-${year}-`;
      case 'YEAR_MONTH':
        return `PO-${year}${month}-`;
      case 'DATE_DDMMYYYY':
        return `PO-${day}${month}${year}-`;
      case 'YEAR_SLASH_MONTH':
        return `PO-${year}/${month}-`;
      default:
        return 'PO-';
    }
  };

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFormData((prev) => ({ ...prev, paymentDate: today }));
  }, []);

  const billPayment = () => (
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
                value={formData.billPaymentRecord.vendorName}
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
                value={formData.billPaymentRecord.paymentMode}
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
                value={formData.billPaymentRecord.reference}
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
                  value={formData.billPaymentRecord.currency}
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
                  value={formData.billPaymentRecord.amount}
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
                value={formData.billPaymentRecord.paidThrough}
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
                value={formData.billPaymentRecord.paymentDate}
                onChange={handleChange}
              />
            </div>

            <div className="so-form-group mb-4">
              <label className="so-label text-sm text-muted-foreground fw-bold">Payment #:</label>

              <div style={{ position: 'relative', width: '100%' }}>

                <input
                  type="text"
                  name="paymentNumber"
                  className="form-control so-control"
                  value={formData.billPaymentRecord.paymentNumber}
                  onChange={handleChange}
                  style={{ paddingRight: '35px' } as React.CSSProperties}
                />
                <span style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                  color: '#6c757d',
                }} onClick={() => setShowSettings(true)}>
                  <Settings size={16} />
                </span>

              </div>

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
                {/* EXISTING ROWS */}
                {usageRows.map((row, index) => (
                  <tr key={index} style={{ fontSize: 12 }}>
                    <td>{row.date}</td>
                    <td>{row.invoiceNumber}</td>
                    <td>
                      {formData.billPaymentRecord.currency}{' '}
                      {row.invoiceAmount.toLocaleString()}
                    </td>
                    <td>
                      {formData.billPaymentRecord.currency}{' '}
                      {row.amountDue.toLocaleString()}
                    </td>
                    <td>{row.paymentReceivedOn}</td>
                    <td>
                      <input
                        type="number"
                        min={0}
                        max={row.amountDue}
                        style={noSpinnerStyle}
                        className="form-control form-control-sm border-0 item-input"
                        value={row.amountUsed || ''}
                        onChange={(e) =>
                          handleUsageChange(index, Number(e.target.value) || 0)
                        }
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
              <label className="so-label text-sm text-muted-foreground fw-bold">Note</label>
              <textarea
                className="form-control so-control textarea"
                name="customerNotes"
                value={formData.billPaymentRecord.customerNotes}
                onChange={handleChange}
                placeholder="Add note for customer..."
              />
            </div>
          </div>

          <div className="summary-column">
            <div
              className="border p-3"
              style={{
                minHeight: '200px',
                background: '#ffffff',
                borderRadius: 10,
              }}
            >
              <div className="d-flex justify-content-between mb-2">
                <span>Amount Received:</span>
                <strong>
                  {formData.billPaymentRecord.currency}{' '}
                  {formData.billPaymentSummary.amountReceived.toLocaleString()}
                </strong>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span>Amount Used:</span>
                <strong>
                  {formData.billPaymentRecord.currency}{' '}
                  {formData.billPaymentSummary.amountUsed.toLocaleString()}
                </strong>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span>Amount Refunded:</span>
                <strong>
                  {formData.billPaymentRecord.currency}{' '}
                  {formData.billPaymentSummary.amountRefunded.toLocaleString()}
                </strong>
              </div>

              <div className="d-flex justify-content-between mt-2 pt-2 border-top">
                <span>Amount in Excess:</span>
                <strong>
                  {formData.billPaymentRecord.currency}{' '}
                  {formData.billPaymentSummary.amountExcess.toLocaleString()}
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
  );

  const vendorAdvance = () => {
    const [vendorFormData, setVendorFormData] = useState<VendorAdvanceFormData>({
      vendorAdvanceRecord: {
        vendorName: '',
        paymentMode: '',
        paidThrough: '',

        currency: '₹',
        amount: 0,

        tds: '',
        depositTo: '',

        paymentDate: new Date().toISOString().split('T')[0],
        paymentNumber: '',
        reference: '',

        note: '',
      },
    });

    useEffect(() => {
      const today = new Date().toISOString().split('T')[0];

      setVendorFormData((prev) => ({
        ...prev,
        vendorAdvanceRecord: {
          ...prev.vendorAdvanceRecord,
          paymentDate: today,
        },
      }));
    }, []);


    const handleVendorChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
      const { name, value } = e.target;

      setVendorFormData((prev) => ({
        ...prev,
        vendorAdvanceRecord: {
          ...prev.vendorAdvanceRecord,
          [name]: name === 'amount' ? Number(value) : value,
        },
      }));
    };


    const handleVendorSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      console.log('Vendor Advance submitted:', vendorFormData);
    };

    return (
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
                  value={vendorFormData.vendorAdvanceRecord.vendorName}
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
                  value={vendorFormData.vendorAdvanceRecord.paymentMode}
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
                  value={vendorFormData.vendorAdvanceRecord.paidThrough}
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
                    value={vendorFormData.vendorAdvanceRecord.currency}
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
                    value={vendorFormData.vendorAdvanceRecord.amount}
                    onChange={handleVendorChange}
                  />
                </div>
              </div>

              <div className="so-form-group mb-4">
                <label className="so-label text-sm text-muted-foreground fw-bold">TDS:</label>
                <select
                  name="tds"
                  className="form-select so-control"
                  value={vendorFormData.vendorAdvanceRecord.tds}
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
                  value={vendorFormData.vendorAdvanceRecord.depositTo}
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
                  value={vendorFormData.vendorAdvanceRecord.paymentDate}
                  onChange={handleVendorChange}
                />
              </div>

              <div className="so-form-group mb-4">
                <label className="so-label text-sm text-muted-foreground fw-bold">
                  Payment #:
                </label>

                <div style={{ position: 'relative', width: '100%' }}>

                  <input
                    type="text"
                    name="paymentNumber"
                    className="form-control so-control"
                    value={vendorFormData.vendorAdvanceRecord.paymentNumber}
                    onChange={handleVendorChange}
                    placeholder='Configure Purchase Order number...'
                    style={{ paddingRight: '35px' } as React.CSSProperties}
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
                  Reference#:
                </label>
                <input
                  type="text"
                  name="reference"
                  className="form-control so-control"
                  value={vendorFormData.vendorAdvanceRecord.reference}
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
                  value={vendorFormData.vendorAdvanceRecord.note}
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

      <div className="sales-orders-page" style={{ paddingTop: 39 }}>
        <div className="ps-4 mb-4" style={{ fontSize: 14 }}>
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
              <h4 className="mb-0" style={{ fontSize: 17 }}>Configure Sales Order Number Preferences</h4>
              <X
                size={20}
                style={{ cursor: 'pointer', color: '#fc0404ff' }}
                onClick={closePopup}
              />
            </div>

            <div className="modal-body mt-3">
              <p style={{ fontSize: 13, color: '#555' }}>
                Your Purchase Orders are currently set to auto-generate numbers. Change settings if
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
                <label className="form-check-label fw-normal">
                  Continue auto-generating Purchase Order Number
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
                <label className="form-check-label" style={{ fontWeight: 0 }}>
                  Enter Sales Order Numbers manually
                </label>
              </div>

              <div className="d-flex justify-content-center mt-4 g-0" style={{ gap: 10 }}>
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
};

export default AddPaymentMade;
