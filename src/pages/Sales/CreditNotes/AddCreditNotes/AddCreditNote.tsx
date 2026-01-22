import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../../components/Header/Header';
import Toast, { useToast } from '../../../../components/Toast/Toast';
import { Info, Settings, X } from 'react-feather';

import ItemTable, {
  SummaryBox,
  type TcsOption,
  type TdsOption,
} from '../../../../components/Table/ItemTable/ItemTable';

import './creditNotes.css';
import { FeatherUpload } from '../../Customers/AddCustomer/Add';
import api from '../../../../services/api/apiConfig';
import { createTCS, getTCS, getTDS } from '../../../../services/api/taxService';
import SalesPersonSelect from '../../../../components/Masters/SalesPersonsMaster/SalesPersonSelect';
import CustomerSelect from '../../../../components/Masters/CustomerMaster/CustomerSelector';

interface ItemRow {
  itemDetails: string;
  quantity: number | string;
  rate: number | string;
  discount: number | string;
  amount: number | string;
}

interface CreditNoteForm {
  credit: {
    customerId: string;
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

type SubmitType = 'draft' | 'open' | 'closed';


type TaxType = 'TDS' | 'TCS' | '';

export default function AddCreditNote() {
  const navigate = useNavigate();
  const { toast, setToast, showToast } = useToast();

  // ---------------- Modal ----------------
  const [showSettings, setShowSettings] = useState(false);
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');
  const [prefixPattern, setPrefixPattern] = useState('');
  const [nextNumber, setNextNumber] = useState('');
  const [restartYear, setRestartYear] = useState(false);
  const [closing, setClosing] = useState(false);


  /* ---------------- TAX STATE ---------------- */
  const [tdsOptions, setTdsOptions] = useState<TdsOption[]>([]);
  const [tcsOptions, setTcsOptions] = useState<TcsOption[]>([]);
  const [loadingTax, setLoadingTax] = useState(false);

  const [submitType, setSubmitType] = useState<SubmitType>('draft');



  // helper: build prefix string from pattern
  const buildPrefixFromPattern = (pattern: string) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    switch (pattern) {
      case 'YEAR':
        return `CN-${year}-`;
      case 'YEAR_MONTH':
        return `CN-${year}${month}-`;
      case 'DATE_DDMMYYYY':
        return `CN-${day}${month}${year}-`;
      case 'YEAR_SLASH_MONTH':
        return `CN-${year}/${month}-`;
      default:
        return 'CN-';
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
  }, [showSettings]);


  /* ---------------- LOAD TAX ---------------- */
  useEffect(() => {
    const loadTaxes = async () => {
      try {
        setLoadingTax(true);

        const [tdsRes, tcsRes] = await Promise.all([
          getTDS(),
          getTCS(),
        ]);

        // ✅ TDS (read-only)
        setTdsOptions(
          tdsRes.map((t) => ({
            id: Number(t.id),   // TDS → number
            name: t.name,
            rate: Number(t.rate),
          }))
        );

        // ✅ TCS (editable)
        setTcsOptions(
          tcsRes.map((t) => ({
            id: String(t.id),   // TCS → string
            name: t.name,
            rate: Number(t.rate),
          }))
        );
      } catch {
        showToast('Failed to load tax options', 'error');
      } finally {
        setLoadingTax(false);
      }
    };

    loadTaxes();
  }, []);



  // ---------------- Form State ----------------
  const [formData, setFormData] = useState<CreditNoteForm>({
    credit: {
      customerId: '',
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



  // CURRENT DATE
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFormData((prev) => ({
      ...prev,
      credit: {
        ...prev.credit,
        creditDate: today,
      },
    }));
  }, []);


  // ---------------- Handlers ----------------
  const handleTaxChange = (field: string, value: any) => {
    setTaxInfo((prev) => ({ ...prev, [field]: value }));
  };

  // TCS HANDLER
  const handleAddTcs = async (data: { name: string; rate: number }) => {
    const created = await createTCS(data);

    setTcsOptions((prev) => [...prev, created]);

    setTaxInfo((prev) => ({
      ...prev,
      type: 'TCS',
      selectedTax: String(created.id),
    }));
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


  const validateForm = () => {
    if (!formData.credit.customerId) return showToast('Select a customer', 'warning'), false;
    if (!formData.credit.creditNoteNo) return showToast('Credit Note number required', 'warning'), false;
    if (!formData.credit.creditDate) return showToast('Credit Note date required', 'warning'), false;
    if (!formData.itemTable.length) return showToast('Add items', 'warning'), false;
    return true;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const payload = {
      customer: formData.credit.customerId,
      credit_note_number: formData.credit.creditNoteNo,
      credit_date: formData.credit.creditDate,
      reference_no: formData.credit.referenceNo,
      payment_term: formData.credit.paymentTerm,
      sales_person: formData.credit.salesperson || null,
      subject: formData.credit.subject,
      customer_notes: formData.credit.notes,
      terms_and_conditions: formData.credit.terms,
      subtotal: totals.subtotal,
      adjustment: taxInfo.adjustment,
      grand_total: totals.grandTotal,
      status: submitType,  
      items: formData.itemTable.map((row) => ({
        item_details: row.itemDetails,
        quantity: parseFloat(row.quantity as string) || 0,
        rate: parseFloat(row.rate as string) || 0,
        discount: parseFloat(row.discount as string) || 0,
        amount: parseFloat(row.amount as string) || 0,
        // line_order: index,
      })),
      tax_info: taxInfo.type ? {
        tax_type: taxInfo.type,
        ...(taxInfo.type === 'TDS' && { tds_rate: taxInfo.taxRate }),
        ...(taxInfo.type === 'TCS' && { tcs: taxInfo.selectedTax }),
        tax_amount: taxInfo.taxAmount,
      } : undefined,
      // documents: [] if file handling later
    };
    try {
      console.log('FINAL PAYLOAD', payload);
      await api.post('credit-notes/create/', payload);
      showToast('Credit Note created successfully', 'success');
      sessionStorage.setItem('formSuccess', `Credit note ${submitType}d successfully`);

      setTimeout(() => {
        navigate('/sales/credit-notes');

      }, 800);
    } catch (error: any) {
      console.log(error);

      const message =
        error.response?.data?.detail ||
        error.response?.data?.non_field_errors?.[0] ||
        'Failed to create Credit note';

      showToast(message, 'error');
    }
  };


  const applyAutoCN = () => {
    if (mode === 'auto') {
      const prefix = buildPrefixFromPattern(prefixPattern);
      const fullNumber = `${prefix}${nextNumber || '001'}`;

      setFormData((prev) => ({
        ...prev,
        credit: {
          ...prev.credit,
          creditNoteNo: fullNumber,
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
                  <CustomerSelect
                    name="customerId"
                    value={formData.credit.customerId}
                    onChange={handleChange}
                  />
                </div>

                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">
                    Credit Note No:
                  </label>

                  <div style={{ position: 'relative', width: '100%' }}>

                    <input
                      type="text"
                      name="creditNoteNo"
                      className="form-control so-control"
                      value={formData.credit.creditNoteNo}
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
                  <SalesPersonSelect
                    name="salesperson"
                    value={formData.credit.salesperson}
                    onChange={handleChange}
                  />
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
                  tdsOptions={tdsOptions}
                  loadingTax={loadingTax}
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

              <button type="submit" className="btn me-3 px-4" style={{ background: '#7991BB', color: '#FFF' }} onClick={() => setSubmitType('open')}>
                Save & Open
              </button>
              <button type="submit" className="btn border me-3 px-4" onClick={() => setSubmitType('draft')}>
                Save Draft
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
              <h4 className="mb-0" style={{ fontSize: 17 }}>Configure Credit Note Number Preferences</h4>
              <X
                size={20}
                style={{ cursor: 'pointer', color: '#fc0404ff' }}
                onClick={closePopup}
              />
            </div>

            <div className="modal-body mt-3">
              <p style={{ fontSize: 13, color: '#555' }}>
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
                <label className="form-check-label fw-normal">
                  Continue auto-generating Credit Note Numbers
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
                        style={{ fontSize: 13 }}
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
                        style={{ fontSize: 13 }}
                      />
                      <small className="text-muted d-block mt-1" >
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

              {/* MANUAL MODE */}
              <div className="form-check mt-4">
                <input
                  type="radio"
                  name="mode"
                  className="form-check-input"
                  checked={mode === 'manual'}
                  onChange={() => setMode('manual')}
                />
                <label className="form-check-label fw-normal">Enter Credit Note Numbers manually</label>
              </div>

              <div className="d-flex justify-content-center mt-4" style={{ gap: 10 }}>
                <button className="btn border me-3 px-4" onClick={closePopup}>
                  Cancel
                </button>
                <button className="btn me-2 px-4" style={{ background: '#7991BB', color: '#FFF' }} onClick={applyAutoCN}>
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
