import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../../components/Header/Header';
import Toast, { useToast } from '../../../../components/Toast/Toast';
import { Info, Settings, X } from 'react-feather';
import './addInvoice.css';
import ItemTable, {
  SummaryBox,
  type TcsOption,
} from '../../../../components/Table/ItemTable/ItemTable';
import { FeatherUpload } from '../../Customers/AddCustomer/Add';

interface ItemRow {
  itemDetails: string;
  quantity: number | string;
  rate: number | string;
  discount: number | string;
  amount: number | string;
}

interface InvoiceForm {
  invoice: {
    customerName: string;
    invoiceNo: string;
    invoiceDate: string;
    dueDate: string;
    paymentTerms: string;
    salesperson: string;
    customerNotes: string;
    termsAndConditions: string;
  };
  itemTable: ItemRow[];
}

type TaxType = 'TDS' | 'TCS' | '';

export default function AddInvoice() {
  const navigate = useNavigate();
  const { toast, setToast, showToast } = useToast();

  // ---------------- Modal + Settings ----------------
  const [showSettings, setShowSettings] = useState(false);
  const [closing, setClosing] = useState(false);
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');
  // const [prefix, setPrefix] = useState('');
  const [nextNumber, setNextNumber] = useState('');
  const [restartYear, setRestartYear] = useState(false);
  const [prefixPattern, setPrefixPattern] = useState<string>('CUSTOM');


  const buildPrefixFromPattern = (pattern: string) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    switch (pattern) {
      case 'YEAR':
        return `INV-${year}-`;
      case 'YEAR_MONTH':
        return `INV-${year}${month}-`;
      case 'DATE_DDMMYYYY':
        return `INV-${day}${month}${year}-`;
      case 'YEAR_SLASH_MONTH':
        return `INV-${year}/${month}-`;
      default:
        return 'INV-';
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
  const [formData, setFormData] = useState<InvoiceForm>({
    invoice: {
      customerName: '',
      invoiceNo: '',
      invoiceDate: '',
      dueDate: '',
      paymentTerms: '',
      salesperson: '',
      customerNotes: '',
      termsAndConditions: '',
    },
    itemTable: [
      {
        itemDetails: '',
        quantity: '',
        rate: '',
        discount: '',
        amount: '',
      },
    ],
  });

  // ---------------- TCS Options ----------------
  const [tcsOptions, setTcsOptions] = useState<TcsOption[]>([
    { id: 'tcs_5', name: 'TCS Standard', rate: 5 },
    { id: 'tcs_12', name: 'TCS Standard', rate: 12 },
    { id: 'tcs_18', name: 'TCS Standard', rate: 18 },
  ]);

  // ---------------- Tax & Totals ----------------
  const [taxInfo, setTaxInfo] = useState({
    type: '' as TaxType,
    selectedTax: '',
    adjustment: 0,
    taxRate: 0,
    taxAmount: 0,
    total: 0,
  });

  const [totals, setTotals] = useState({
    subtotal: 0,
    tax: 0,
    total: 0,
    grandTotal: 0,
  });

  const computeSubtotal = (items: ItemRow[]) => {
    return items.reduce((acc, r) => {
      const amt = parseFloat(String(r.amount || '0')) || 0;
      return acc + amt;
    }, 0);
  };

  useEffect(() => {
    const subtotal = computeSubtotal(formData.itemTable);

    let rate = 0;

    if (taxInfo.type === 'TDS') {
      rate = Number(taxInfo.selectedTax);
    } else if (taxInfo.type === 'TCS') {
      const opt = tcsOptions.find((o) => o.id === taxInfo.selectedTax);
      rate = opt ? opt.rate : 0;
    }

    const taxAmount = +(subtotal * (rate / 100));

    const grand =
      taxInfo.type === 'TDS'
        ? subtotal - taxAmount + Number(taxInfo.adjustment || 0)
        : subtotal + taxAmount + Number(taxInfo.adjustment || 0);

    setTaxInfo((prev) => ({
      ...prev,
      taxRate: rate,
      taxAmount,
      total: grand,
    }));

    setTotals({
      subtotal,
      tax: taxAmount,
      total: grand,
      grandTotal: grand,
    });
  }, [formData.itemTable, taxInfo.type, taxInfo.selectedTax, taxInfo.adjustment, tcsOptions]);


  // CURRENT DATE
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFormData((prev) => ({
      ...prev,
      invoice: {
        ...prev.invoice,
        invoiceDate: today,
      },
    }));
  }, []);


  // ---------------- Handlers ----------------
  const handleTaxChange = (field: any, value: any) => {
    setTaxInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddTcs = (opt: TcsOption) => {
    setTcsOptions((prev) => [...prev, opt]);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      invoice: { ...prev.invoice, [name]: value },
    }));
  };

  const handleAddRow = () => {
    setFormData((prev) => ({
      ...prev,
      itemTable: [
        ...prev.itemTable,
        { itemDetails: '', quantity: '', rate: '', discount: '', amount: '' },
      ],
    }));
  };

  const handleRemoveRow = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      itemTable: prev.itemTable.filter((_, i) => i !== index),
    }));
  };

  const handleRowChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = [...prev.itemTable];
      const row = { ...updated[index] };
      row[name as keyof ItemRow] = value;

      const qty = parseFloat(String(row.quantity || '0')) || 0;
      const rate = parseFloat(String(row.rate || '0')) || 0;
      const discount = parseFloat(String(row.discount || '0')) || 0;

      const before = qty * rate;
      const final = before - (before * discount) / 100;

      row.amount = final ? final.toFixed(2) : '';

      updated[index] = row;
      return { ...prev, itemTable: updated };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalPayload = {
      ...formData,
      totals,
      taxInfo,
      invoiceId: Math.floor(100000 + Math.random() * 900000),
      createdOn: new Date().toISOString().split('T')[0],
      createdBy: 'Admin',
    };

    const existing = JSON.parse(localStorage.getItem('invoices') || '[]');
    existing.push(finalPayload);
    localStorage.setItem('invoices', JSON.stringify(existing));
    sessionStorage.setItem('formSuccess', 'Invoice created');
    navigate('/sales/invoices');
  };

  const applyAutoSO = () => {
    if (mode === 'auto') {
      const prefix = buildPrefixFromPattern(prefixPattern);
      const fullNumber = `${prefix}${nextNumber || '001'}`;

      setFormData((prev) => ({
        ...prev,
        invoice: {
          ...prev.invoice,
          invoiceNo: fullNumber, // ✅ matches the input binding
        },
      }));
    }
    closePopup();
  };

  // ---------------- UI ----------------
  return (
    <>
      <Header />
      <Toast toast={toast} setToast={setToast} />

      <div className="sales-orders-page">
        <form onSubmit={handleSubmit} className="sales-order-form">
          <div className="so-details-card mx-5 mb-4">
            <h1 className="sales-order-title mb-4">Invoice</h1>

            <div className="row g-3 three-column-form">
              {/* COLUMN 1: Customer + Invoice Date */}
              <div className="col-lg-4">
                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">
                    Customer:
                  </label>
                  <select
                    name="customerName"
                    className="form-select so-control"
                    value={formData.invoice.customerName}
                    onChange={handleChange}
                  >
                    <option value="">Select Customer</option>
                    <option value="Customer A">Customer A</option>
                    <option value="Customer B">Customer B</option>
                  </select>
                </div>

                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">
                    Invoice Date:
                  </label>
                  <input
                    type="date"
                    name="invoiceDate"
                    className="form-control so-control"
                    value={formData.invoice.invoiceDate}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* COLUMN 2: Payment Terms + Invoice No */}
              <div className="col-lg-4">
                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">
                    Payment Terms:
                  </label>
                  <select
                    name="paymentTerms"
                    className="form-select so-control"
                    value={formData.invoice.paymentTerms}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="Advance">Advance</option>
                    <option value="Net 15">Net 15</option>
                    <option value="Net 30">Net 30</option>
                  </select>
                </div>

                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">
                    Invoice No:
                  </label>

                  <div style={{ position: 'relative', width: '100%' }}>

                    <input
                      type="text"
                      name="invoiceNo"
                      className="form-control so-control"
                      value={formData.invoice.invoiceNo}
                      onChange={handleChange}
                      style={{ paddingRight: '35px' }}
                      placeholder="Auto-generated"
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
              </div>

              {/* COLUMN 3: Due Date + Salesperson */}
              <div className="col-lg-4">
                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">
                    Due Date:
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    className="form-control so-control"
                    value={formData.invoice.dueDate}
                    onChange={handleChange}
                  />
                </div>

                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">
                    Salesperson:
                  </label>
                  <select
                    name="salesperson"
                    className="form-select so-control"
                    value={formData.invoice.salesperson}
                    onChange={handleChange}
                  >
                    <option value="">Select Salesperson</option>
                    <option value="John">John</option>
                    <option value="Maria">Maria</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Rest of the layout, outside the top card */}
          <div className="mx-5">
            <ItemTable
              rows={formData.itemTable}
              onRowChange={handleRowChange}
              onAddRow={handleAddRow}
              onRemoveRow={handleRemoveRow}
            />

            <div className="notes-summary-row">
              <div className="notes-column">
                <div className="so-form-group">
                  <label className="so-label text-sm text-muted-foreground fw-bold">
                    Customer Notes:
                  </label>
                  <textarea
                    name="customerNotes"
                    className="form-control so-control textarea"
                    value={formData.invoice.customerNotes}
                    onChange={handleChange}
                    placeholder="Add note for customer..."
                  />
                </div>

                <div className="so-form-group">
                  <label className="so-label text-sm text-muted-foreground fw-bold">
                    Terms & Conditions:
                  </label>
                  <textarea
                    name="termsAndConditions"
                    className="form-control so-control textarea"
                    value={formData.invoice.termsAndConditions}
                    onChange={handleChange}
                    placeholder="Enter terms and conditions..."
                  />
                </div>
              </div>

              <div className="summary-column">
                <SummaryBox
                  totals={totals}
                  taxInfo={taxInfo}
                  onTaxChange={handleTaxChange}
                  tcsOptions={tcsOptions}
                  onAddTcs={handleAddTcs}
                />
              </div>
            </div>

            <div className="row mt-4 mb-4 align-items-start">
              <label className="so-label text-sm text-muted-foreground fw-bold">Documents:</label>
              <div className="col-sm-12">
                <div
                  className="doc-upload-box"
                  onClick={() => document.getElementById('fileUploadInput')?.click()}
                >
                  <FeatherUpload size={28} className="text-muted mb-2" />
                  <span className="text-secondary small">Click to Upload Documents</span>
                  <input
                    id="fileUploadInput"
                    type="file"
                    multiple
                    className="d-none"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files?.length) {
                        alert(`${files.length} file(s) selected!`);
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn border me-3 px-4" onClick={() => navigate(-1)}>
                Cancel
              </button>
              <button
                type="submit"
                className="btn px-4"
                style={{ background: '#7991BB', color: '#FFF' }}
              >
                Save
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
              <h4 className="mb-0" style={{ fontSize: 17 }}>Configure Invoice Number Preferences</h4>
              <X
                size={20}
                style={{ cursor: 'pointer', color: '#fc0404ff' }}
                onClick={closePopup}
              />
            </div>

            <div className="modal-body mt-3">
              <p style={{ fontSize: 13, color: '#555' }}>
                Your Invoices are currently set to auto-generate numbers. Change settings if needed.
              </p>

              {/* Auto mode */}
              <div className="form-check mb-3">
                <input
                  type="radio"
                  name="mode"
                  className="form-check-input"
                  checked={mode === 'auto'}
                  onChange={() => setMode('auto')}
                />
                <label className="form-check-label fw-normal">Continue auto-generating Invoice Numbers</label>
                <Info size={13} />
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

              {/* Manual mode */}
              <div className="form-check mt-4">
                <input
                  type="radio"
                  name="mode"
                  className="form-check-input"
                  checked={mode === 'manual'}
                  onChange={() => setMode('manual')}
                />
                <label className="form-check-label">Enter Invoice Numbers manually</label>
              </div>

              <div className="d-flex justify-content-center mt-4" style={{ gap: 10 }}>
                <button className="btn border me-3 px-4" onClick={closePopup}>
                  Cancel
                </button>
                <button className="btn me-2 px-4" style={{ background: '#7991BB', color: '#FFF' }} onClick={applyAutoSO}>
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
