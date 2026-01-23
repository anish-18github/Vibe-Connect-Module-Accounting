import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../../components/Header/Header';
import { Toast } from '../../../../components/Toast/Toast';
import { useGlobalToast } from '../../../../components/Toast/ToastContext';
// import { Info, Settings, X } from "react-feather";
import './addRecurringInvoice.css';

import ItemTable, {
  SummaryBox,
  type TcsOption,
  type TdsOption,
} from '../../../../components/Table/ItemTable/ItemTable';

import { FeatherUpload } from '../../Customers/AddCustomer/Add';
import api from '../../../../services/api/apiConfig';
import SalesPersonSelect from '../../../../components/Masters/SalesPersonsMaster/SalesPersonSelect';
import { createTCS, getTCS, getTDS } from '../../../../services/api/taxService';
import { Info, Settings, X } from 'react-feather';
import CustomerSelect from '../../../../components/Masters/CustomerMaster/CustomerSelector';

interface ItemRow {
  itemDetails: string;
  quantity: number | string;
  rate: number | string;
  discount: number | string;
  amount: number | string;
}

interface RecurringInvoiceForm {
  invoice: {
    customerId: string;
    invoiceNo: string;
    orderNumber: string;
    profileName: string;
    repeatEvery: string;
    startOn: string;
    endOn: string;
    paymentTerms: string;
    salesPerson: string;
    subject: string;
    customerNotes: string;
    termsAndConditions: string;
  };
  itemTable: ItemRow[];
}

type SubmitType = 'draft' | 'active';


type TaxType = 'TDS' | 'TCS' | '';

export default function AddRecurringInvoices() {
  const navigate = useNavigate();

  // ---------------- Modal + Settings ----------------
  const [showSettings, setShowSettings] = useState(false);
  const [closing, setClosing] = useState(false);
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');
  const [nextNumber, setNextNumber] = useState('');
  const [restartYear, setRestartYear] = useState(false);
  const [prefixPattern, setPrefixPattern] = useState('');


  const { toast, setToast, showToast } = useToast();
 
  /* ---------------- TAX STATE ---------------- */
  const [tdsOptions, setTdsOptions] = useState<TdsOption[]>([]);
  const [tcsOptions, setTcsOptions] = useState<TcsOption[]>([]);
  const [loadingTax, setLoadingTax] = useState(false);

  const [submitType, setSubmitType] = useState<SubmitType>('draft');


  const buildPrefixFromPattern = (pattern: string) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    switch (pattern) {
      case 'YEAR':
        return `RINV-${year}-`;
      case 'YEAR_MONTH':
        return `RINV-${year}${month}-`;
      case 'DATE_DDMMYYYY':
        return `RINV-${day}${month}${year}-`;
      case 'YEAR_SLASH_MONTH':
        return `RINV-${year}/${month}-`;
      default:
        return 'RINV-';
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



  // ---------------- Modal + Small UI State ----------------

  // const [showSettings, setShowSettings] = useState(false);
  // const [prefix, setPrefix] = useState("");
  // const [nextNumber, setNextNumber] = useState("");
  // const [restartYear, setRestartYear] = useState(false);
  // const [closing, setClosing] = useState(false);

  // const closePopup = () => {
  //     setClosing(true);
  //     setTimeout(() => {
  //         setShowSettings(false);
  //         setClosing(false);
  //     }, 250);
  // };

  // useEffect(() => {
  //     document.body.style.overflow = showSettings ? "hidden" : "auto";
  //     return () => {
  //         document.body.style.overflow = "auto";
  //     };
  // }, [showSettings]);

  // ---------------- Form State ----------------
  const [formData, setFormData] = useState<RecurringInvoiceForm>({
    invoice: {
      customerId: '',
      invoiceNo: '',
      orderNumber: '',
      profileName: '',
      repeatEvery: '',
      startOn: '',
      endOn: '',
      paymentTerms: '',
      salesPerson: '',
      subject: '',
      customerNotes: '',
      termsAndConditions: '',
    },
    itemTable: [
      { itemDetails: '', quantity: '', rate: '', discount: '', amount: '' },
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
      rate = Number(taxInfo.selectedTax || 0);
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


  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];

    setFormData((prev) => ({
      ...prev,
      invoice: {
        ...prev.invoice,
        startOn: today,
      },
    }));
  }, []);



  // ---------------- Handlers ----------------
  const handleTaxChange = (field: any, value: any) => {
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
      invoice: { ...prev.invoice, [name]: value },
    }));
  };

  const handleAddRow = () => {
    setFormData((prev) => ({
      ...prev,
      itemTable: [
        ...prev.itemTable,
        {
          itemDetails: '',
          quantity: '',
          rate: '',
          discount: '',
          amount: '',
        },
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
    type Field = keyof ItemRow;
    const field = name as Field;

    setFormData((prev) => {
      const updated = [...prev.itemTable];
      const row = { ...updated[index] };
      row[field] = value;

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        customer: Number(formData.invoice.customerId),

        order_number: formData.invoice.orderNumber
          ? Number(formData.invoice.orderNumber)
          : null,

        recurring_invoice_number: formData.invoice.invoiceNo,
        profile_name: formData.invoice.profileName,
        repeat_every: formData.invoice.repeatEvery,
        start_on: formData.invoice.startOn,
        end_on: formData.invoice.endOn || null,
        payment_terms: formData.invoice.paymentTerms,

        sales_person: formData.invoice.salesPerson
          ? Number(formData.invoice.salesPerson)
          : null,

        subject: formData.invoice.subject,

        status: submitType,

        customer_notes: formData.invoice.customerNotes,
        terms_and_conditions: formData.invoice.termsAndConditions,

        subtotal: totals.subtotal,
        adjustment: taxInfo.adjustment,
        tax_amount: taxInfo.taxAmount,
        grand_total: totals.grandTotal,

        is_active: true,

        items: formData.itemTable.map((row) => ({
          item_details: row.itemDetails,
          quantity: Number(row.quantity),
          rate: Number(row.rate),
          discount: Number(row.discount || 0),
          amount: Number(row.amount),
        })),
      };


      await api.post('recurring-invoices/create/', payload);

      sessionStorage.setItem(
        'formSuccess',
        'Recurring invoice created successfully'
      );

      navigate('/sales/payment-invoices');
    } catch (error: any) {
      console.error('RECURRING INVOICE ERROR RESPONSE:', error.response?.data);

      setToast({
        stage: 'enter',
        type: 'error',
        message:
          error.response?.data?.detail ||
          JSON.stringify(error.response?.data) ||
          'Failed to create recurring invoice',
      });
    }
  };


  const applyAutoSO = () => {
    if (mode === 'auto') {
      const prefix = buildPrefixFromPattern(prefixPattern);
      const fullNumber = `${prefix}${nextNumber || '001'}`;

      setFormData((prev) => ({
        ...prev,
        invoice: {
          ...prev.invoice,
          invoiceNo: fullNumber,
        },
      }));
    }
    closePopup();
  };


  return (
    <>
      <Header />
      <Toast toast={toast} setToast={setToast} />

      <div className="sales-orders-page">
        <form onSubmit={handleSubmit} className="sales-order-form">
          {/* TOP DETAILS CARD */}
          <div className="so-details-card mx-5 mb-4">
            <h1 className="sales-order-title mb-4">New Recurring Invoice</h1>

            <div className="row g-3 three-column-form">
              {/* COLUMN 1: 3 fields */}
              <div className="col-lg-4">
                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">
                    Customer:
                  </label>
                  <CustomerSelect
                    name="customerId"
                    value={formData.invoice.customerId}
                    onChange={handleChange}
                  />

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

                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">
                    Order Number:
                  </label>
                  <input
                    type="number"
                    name="orderNumber"
                    className="form-control so-control"
                    value={formData.invoice.orderNumber}
                    onChange={handleChange}
                    placeholder="e.g. SO-16012026-xxxx"
                  />
                </div>

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
                    <option value="Net 45">Net 45</option>
                  </select>
                </div>


              </div>

              {/* COLUMN 2: 3 fields (Subject textarea + Profile Name + Start/End dates) */}
              <div className="col-lg-4">
                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">
                    Profile Name:
                  </label>
                  <input
                    type="text"
                    name="profileName"
                    className="form-control so-control"
                    value={formData.invoice.profileName}
                    onChange={handleChange}
                    placeholder="Enter profile name"
                  />
                </div>


                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">
                    Repeat Every:
                  </label>
                  <select
                    name="repeatEvery"
                    className="form-select so-control"
                    value={formData.invoice.repeatEvery}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="Week">Week</option>
                    <option value="2 Weeks">2 Weeks</option>
                    <option value="Month">Month</option>
                    <option value="2 Months">2 Months</option>
                    <option value="3 Months">3 Months</option>
                    <option value="6 Months">6 Months</option>
                    <option value="Year">Year</option>
                    <option value="2 Years">2 Years</option>
                    <option value="3 Years">3 Years</option>
                  </select>
                </div>

                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">Terms:</label>
                  <div className="row g-2">
                    <div className="col-6">
                      <input
                        type="date"
                        name="startOn"
                        className="form-control so-control"
                        value={formData.invoice.startOn}
                        onChange={handleChange}
                        placeholder="Start On"
                      />
                    </div>
                    <div className="col-6">
                      <input
                        type="date"
                        name="endOn"
                        className="form-control so-control"
                        value={formData.invoice.endOn}
                        onChange={handleChange}
                        placeholder="End On"
                      />
                    </div>
                  </div>
                </div>


              </div>

              {/* COLUMN 3: 2 fields */}
              <div className="col-lg-4">
                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">
                    Salesperson:
                  </label>
                  <SalesPersonSelect
                    name="salesPerson"
                    value={formData.invoice.salesPerson}
                    onChange={handleChange}
                  />

                </div>

                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">Subject:</label>
                  <textarea
                    className="form-control so-control subject-textarea"
                    style={{ height: '100px', resize: 'none' }}
                    name="subject"
                    value={formData.invoice.subject}
                    onChange={handleChange}
                    placeholder="Enter recurring invoice subject..."
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
                    name="customerNotes"
                    value={formData.invoice.customerNotes || ''}
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
                    name="termsAndConditions"
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

              <button
                type="submit"
                className="btn me-3 px-4"
                style={{ background: '#7991BB', color: '#FFF', fontSize: 14 }}
                onClick={() => setSubmitType('active')}
              >
                Save and send
              </button>
              <button
                type="submit"
                className="btn border me-3 px-4"
                style={{ fontSize: 14 }}
                onClick={() => setSubmitType('draft')}
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
              <h4 className="mb-0" style={{ fontSize: 17 }}>Configure Recurring Invoice Number Preferences</h4>
              <X
                size={20}
                style={{ cursor: 'pointer', color: '#fc0404ff' }}
                onClick={closePopup}
              />
            </div>

            <div className="modal-body mt-3">
              <p style={{ fontSize: 13, color: '#555' }}>
                Your Recurring Invoices are currently set to auto-generate numbers. Change settings if needed.
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
                <label className="form-check-label fw-normal">Continue auto-generating Recurring Invoice Numbers</label>
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
