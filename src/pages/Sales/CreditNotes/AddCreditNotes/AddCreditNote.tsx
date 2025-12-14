import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../../components/Header/Header';
import Toast, { useToast } from '../../../../components/Toast/Toast';
import { Info, Settings, X } from 'react-feather';

import ItemTable, {
  SummaryBox,
  type TcsOption,
} from '../../../../components/Table/ItemTable/ItemTable';

import './creditNotes.css';
import { FeatherUpload } from '../../Customers/AddCustomer/Add';

interface ItemRow {
  itemDetails: string;
  quantity: number | string;
  rate: number | string;
  discount: number | string;
  amount: number | string;
}

interface CreditNoteForm {
  credit: {
    customerName: string;
    creditNoteNo: string;
    creditDate: string;
    referenceNo: string;
    subject: string;
    paymentTerm: string;
    salesperson: string;
    notes: string;
    terms: string;
  };
  itemTable: ItemRow[];
}

type TaxType = 'TDS' | 'TCS' | '';

export default function AddCreditNote() {
  const navigate = useNavigate();
  const { toast, setToast, showToast } = useToast();

  // ---------------- Modal ----------------
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
  }, [showSettings]);

  // ---------------- Form State ----------------
  const [formData, setFormData] = useState<CreditNoteForm>({
    credit: {
      customerName: '',
      creditNoteNo: '',
      creditDate: '',
      referenceNo: '',
      subject: '',
      paymentTerm: '',
      salesperson: '',
      notes: '',
      terms: '',
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

  const computeSubtotal = (items: ItemRow[]) =>
    items.reduce((acc, r) => acc + (parseFloat(String(r.amount)) || 0), 0);

  useEffect(() => {
    const subtotal = computeSubtotal(formData.itemTable);
    let rate = 0;

    if (taxInfo.type === 'TDS') {
      rate = Number(taxInfo.selectedTax);
    } else if (taxInfo.type === 'TCS') {
      const opt = tcsOptions.find((o) => o.id === taxInfo.selectedTax);
      rate = opt ? opt.rate : 0;
    }

    const taxAmount = subtotal * (rate / 100);
    const grand = subtotal + taxAmount + Number(taxInfo.adjustment || 0);

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
  }, [formData.itemTable, taxInfo.type, taxInfo.selectedTax, taxInfo.adjustment]);

  // ---------------- Handlers ----------------
  const handleTaxChange = (field: string, value: any) => {
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
      credit: { ...prev.credit, [name]: value },
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
    const updated = [...formData.itemTable];
    const row = { ...updated[index], [name]: value };

    const qty = parseFloat(String(row.quantity)) || 0;
    const rate = parseFloat(String(row.rate)) || 0;
    const discount = parseFloat(String(row.discount)) || 0;

    const before = qty * rate;
    const final = before - (before * discount) / 100;
    row.amount = final.toFixed(2);

    updated[index] = row;
    setFormData((prev) => ({ ...prev, itemTable: updated }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      totals,
      taxInfo,
      creditNoteId: Math.floor(100000 + Math.random() * 900000),
      createdOn: new Date().toISOString().split('T')[0],
      createdBy: 'Admin',
    };

    const existing = JSON.parse(localStorage.getItem('creditNotes') || '[]');
    existing.push(payload);
    localStorage.setItem('creditNotes', JSON.stringify(existing));
    sessionStorage.setItem('formSuccess', 'Credit note created successfully');
    navigate('/sales/credit-notes');
  };

  const applyAutoCN = () => {
    if (mode === 'auto') {
      setFormData((prev) => ({
        ...prev,
        credit: {
          ...prev.credit,
          creditNoteNo: prefix + nextNumber,
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
          {/* TOP DETAILS CARD */}
          <div className="so-details-card mx-5 mb-4">
            <h1 className="sales-order-title mb-4">New Credit Note</h1>

            <div className="row g-3 three-column-form">
              {/* COLUMN 1: 3 fields */}
              <div className="col-lg-4">
                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">
                    Customer:
                  </label>
                  <select
                    name="customerName"
                    className="form-select so-control"
                    value={formData.credit.customerName}
                    onChange={handleChange}
                  >
                    <option value="">Select Customer</option>
                    <option value="Customer A">Customer A</option>
                    <option value="Customer B">Customer B</option>
                  </select>
                </div>

                <div className="so-form-group mb-4 position-relative">
                  <label className="so-label text-sm text-muted-foreground fw-bold">
                    Credit Note No:
                  </label>
                  <input
                    type="text"
                    name="creditNoteNo"
                    className="form-control so-control"
                    value={formData.credit.creditNoteNo}
                    onChange={handleChange}
                    style={{ paddingRight: '35px' }}
                    placeholder="Auto-generated"
                  />
                  <span className="so-settings-icon" onClick={() => setShowSettings(true)}>
                    <Settings size={16} />
                  </span>
                </div>

                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">
                    Reference:
                  </label>
                  <input
                    type="text"
                    name="referenceNo"
                    className="form-control so-control"
                    value={formData.credit.referenceNo}
                    onChange={handleChange}
                    placeholder="Enter reference number"
                  />
                </div>
              </div>

              {/* COLUMN 2: 2 fields */}
              <div className="col-lg-4">
                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">
                    Payment Terms:
                  </label>
                  <select
                    name="paymentTerm"
                    className="form-select so-control"
                    value={formData.credit.paymentTerm}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="Advance">Advance</option>
                    <option value="Net 15">Net 15</option>
                    <option value="Net 30">Net 30</option>
                    <option value="Net 45">Net 45</option>
                  </select>
                </div>

                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">
                    Credit Note Date:
                  </label>
                  <input
                    type="date"
                    name="creditDate"
                    className="form-control so-control"
                    value={formData.credit.creditDate}
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
                    value={formData.credit.salesperson}
                    onChange={handleChange}
                  >
                    <option value="">Select Salesperson</option>
                    <option value="John">John</option>
                    <option value="Maria">Maria</option>
                  </select>
                </div>
              </div>

              {/* COLUMN 3: 2 fields */}
              <div className="col-lg-4">
                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">Subject:</label>
                  <textarea
                    className="form-control so-control subject-textarea"
                    style={{ height: '60px', resize: 'none' }}
                    name="subject"
                    value={formData.credit.subject}
                    onChange={handleChange}
                    placeholder="Enter credit note subject..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* OUTSIDE CARD - Standard Sales Order layout */}
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
                    className="form-control so-control textarea"
                    name="notes"
                    value={formData.credit.notes}
                    onChange={handleChange}
                    placeholder="Add note for customer..."
                  />
                </div>

                <div className="so-form-group">
                  <label className="so-label text-sm text-muted-foreground fw-bold">
                    Terms & Conditions:
                  </label>
                  <textarea
                    className="form-control so-control textarea"
                    name="terms"
                    value={formData.credit.terms}
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

            <div className="row mb-4 mt-4 align-items-start">
              <label className="so-label text-sm text-muted-foreground fw-bold">Documents:</label>
              <div className="col-sm-12">
                <div
                  className="doc-upload-box"
                  onClick={() => document.getElementById('fileUploadInput')?.click()}
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

      {/* ---------------- SETTINGS MODAL ---------------- */}
      {showSettings && (
        <div className="settings-overlay" onClick={closePopup}>
          <div
            className={`settings-modal ${closing ? 'closing' : 'opening'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header custom-header">
              <h4 className="mb-0 p-4">Configure Credit Note Number Preferences</h4>
              <X
                size={20}
                style={{ cursor: 'pointer', marginRight: '15px' }}
                onClick={closePopup}
              />
            </div>

            <div className="modal-body mt-3">
              <p className="small text-muted">
                Your Credit Notes are currently set to auto-generate numbers. Change settings if
                needed.
              </p>

              {/* AUTO MODE */}
              <div className="form-check mb-3">
                <input
                  type="radio"
                  name="mode"
                  className="form-check-input"
                  checked={mode === 'auto'}
                  onChange={() => setMode('auto')}
                />
                <label className="form-check-label">
                  Continue auto-generating Credit Note Numbers
                </label>
                <span style={{ marginLeft: '6px' }}>
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
                        placeholder="CN-"
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

              {/* MANUAL MODE */}
              <div className="form-check mt-4">
                <input
                  type="radio"
                  name="mode"
                  className="form-check-input"
                  checked={mode === 'manual'}
                  onChange={() => setMode('manual')}
                />
                <label className="form-check-label">Enter Credit Note Numbers manually</label>
              </div>

              <div className="d-flex justify-content-end mt-4" style={{ gap: 10 }}>
                <button className="btn btn-outline-secondary" onClick={closePopup}>
                  Cancel
                </button>
                <button className="btn btn-primary px-4" onClick={applyAutoCN}>
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
