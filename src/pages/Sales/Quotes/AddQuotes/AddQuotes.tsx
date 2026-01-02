import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../../components/Header/Header';
import Toast, { useToast } from '../../../../components/Toast/Toast';
import { Info, Settings, X } from 'react-feather';
import './addQuote.css';
import ItemTable, {
  SummaryBox,
  type TcsOption,
  type TdsOption,
} from '../../../../components/Table/ItemTable/ItemTable';
import { FeatherUpload } from '../../Customers/AddCustomer/Add';
import api from '../../../../services/api/apiConfig';
import { createTCS, getTCS, getTDS } from '../../../../services/api/taxService';
import SalesPersonSelect from '../../../../components/SalesPersonSelect/SalesPersonSelect';

interface Customer {
  customerId: number;
  name: string;
}


interface ItemRow {
  itemDetails: string;
  quantity: number | string;
  rate: number | string;
  discount: number | string;
  amount: number | string;
}

interface QuotesForm {
  quote: {
    customerId: string;
    quote: string;
    referenceNumber: string;
    quoteDate: string;
    expiryDate: string;
    salesPerson: string;
    projectName: string;
    customerNotes: string;
    termsAndConditions: string;
  };
  itemTable: ItemRow[];
}

type TaxType = 'TDS' | 'TCS' | '';

type SubmitType = 'draft' | 'sent';

export default function AddQuotes() {
  const navigate = useNavigate();
  const { toast, setToast, showToast } = useToast();

  // ------------- modal + small UI state -------------
  const [showSettings, setShowSettings] = useState(false);
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');
  const [prefixPattern, setPrefixPattern] = useState('');
  const [nextNumber, setNextNumber] = useState('001');
  const [restartYear, setRestartYear] = useState(false);
  const [closing, setClosing] = useState(false);

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);

  const [submitType, setSubmitType] = useState<SubmitType>('draft');


  const [tdsOptions, setTdsOptions] = useState<TdsOption[]>([]);
  const [tcsOptions, setTcsOptions] = useState<TcsOption[]>([]);
  const [loadingTax, setLoadingTax] = useState(false);




  const buildPrefixFromPattern = (pattern: string) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    switch (pattern) {
      case 'YEAR':
        return `QT-${year}-`;
      case 'YEAR_MONTH':
        return `QT-${year}${month}-`;
      case 'DATE_DDMMYYYY':
        return `QT-${day}${month}${year}-`;
      case 'YEAR_SLASH_MONTH':
        return `QT-${year}/${month}-`;
      default:
        return 'QT-';
    }
  };


  const closePopup = () => {
    setClosing(true);
    setTimeout(() => {
      setShowSettings(false);
      setClosing(false);
    }, 200);
  };

  useEffect(() => {
    document.body.style.overflow = showSettings ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showSettings]);

  useEffect(() => {
    const loadTaxes = async () => {
      try {
        setLoadingTax(true);
        const [tds, tcs] = await Promise.all([getTDS(), getTCS()]);
        setTdsOptions(tds);
        setTcsOptions(tcs);
      } catch {
        showToast('Failed to load tax options', 'error');
      } finally {
        setLoadingTax(false);
      }
    };

    loadTaxes();
  }, []);


  // ------------- form state -------------
  const [formData, setFormData] = useState<QuotesForm>({
    quote: {
      customerId: '',
      quote: '',
      referenceNumber: '',
      quoteDate: '',
      expiryDate: '',
      salesPerson: '',
      projectName: '',
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



  // ---------- taxInfo & totals ----------
  const [taxInfo, setTaxInfo] = useState({
    type: '' as TaxType,
    selectedTax: '', // for TDS -> "0.1" | "1" etc ; for TCS -> option id
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

  // ---------- helpers ----------
  const computeSubtotal = (items: ItemRow[]) =>
    items.reduce((acc, r) => acc + Number(r.amount || 0), 0);

  useEffect(() => {
    const subtotal = computeSubtotal(formData.itemTable);

    let rate = 0;
    if (taxInfo.type === 'TDS') {
      rate = Number(taxInfo.selectedTax || 0);
    } else if (taxInfo.type === 'TCS') {
      const opt = tcsOptions.find(
        (o) => String(o.id) === taxInfo.selectedTax,
      );
      rate = opt ? opt.rate : 0;
    }

    const taxAmount = subtotal * (rate / 100);
    const grand =
      taxInfo.type === 'TDS'
        ? subtotal - taxAmount + taxInfo.adjustment
        : subtotal + taxAmount + taxInfo.adjustment;

    setTaxInfo((p) => ({
      ...p,
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
  }, [
    formData.itemTable,
    taxInfo.type,
    taxInfo.selectedTax,
    taxInfo.adjustment,
    tcsOptions,
  ]);

  // ---------------- Load customers ----------------
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await api.get<Customer[]>('sales/customers/');
        setCustomers(res.data);
      } catch {
        showToast('Failed to load customers', 'error');
      } finally {
        setLoadingCustomers(false);
      }
    };
    fetchCustomers();
  }, [showToast]);


  // CURRENT DATE
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFormData((prev) => ({
      ...prev,
      quote: {
        ...prev.quote,
        quoteDate: today,
      },
    }));
  }, []);


  // ---------- handlers ----------
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

  // Quote fields
  const handleQuoteChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      quote: {
        ...prev.quote,
        [name]: value,
      },
    }));
  };

  // Item table handlers
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
      row[field] = value === '' ? '' : value;

      const qty = parseFloat(String(row.quantity || '0')) || 0;
      const rate = parseFloat(String(row.rate || '0')) || 0;
      const discount = parseFloat(String(row.discount || '0')) || 0;
      const beforeDiscount = qty * rate;
      const finalAmount = beforeDiscount - (beforeDiscount * discount) / 100;
      row.amount = finalAmount ? finalAmount.toFixed(2) : '';

      updated[index] = row;
      return { ...prev, itemTable: updated };
    });
  };

  
  const validateForm = () => {
    if (!formData.quote.customerId) return showToast('Select a customer', 'warning'), false;
    if (!formData.quote.quote) return showToast('Quote number required', 'warning'), false;
    if (!formData.quote.quoteDate) return showToast('Quote date required', 'warning'), false;
    if (!formData.itemTable.length) return showToast('Add items', 'warning'), false;
    return true;
  };

  const round2 = (value: number) =>
    Number(Number(value).toFixed(2));




  // submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const payload = {
      customer: Number(formData.quote.customerId),

      quote_number: formData.quote.quote,
      reference_number: formData.quote.referenceNumber,
      quote_date: formData.quote.quoteDate,
      expiry_date: formData.quote.expiryDate,

      sales_person: Number(formData.quote.salesPerson),
      project_name: formData.quote.projectName,
      customer_notes: formData.quote.customerNotes,
      terms_and_conditions: formData.quote.termsAndConditions,

      status: submitType,

      //  ROUND EVERYTHING
      subtotal: round2(totals.subtotal),
      tax_type: taxInfo.type,
      tax_rate: round2(taxInfo.taxRate),
      tax_amount: round2(taxInfo.taxAmount),

      adjustment: round2(taxInfo.adjustment),
      grand_total: round2(totals.grandTotal),

      items: formData.itemTable.map((row) => ({
        item_details: row.itemDetails,
        quantity: Number(row.quantity),
        rate: round2(Number(row.rate)),
        discount: round2(Number(row.discount) || 0),
        amount: round2(Number(row.amount)),
        // line_order: index,
      })),
    };


    try {
      console.log('FINAL PAYLOAD', payload);
      await api.post('sales/quotes/create/', payload);

      showToast('Quote created successfully', 'success');

      setTimeout(() => {
        navigate('/sales/quotes');
      }, 800);
    } catch (error: any) {
      console.error(error);

      const message =
        error.response?.data?.detail ||
        error.response?.data?.non_field_errors?.[0] ||
        'Failed to create quote';

      showToast(message, 'error');
    }
  };


  // small utility used by Settings modal
  const applyAutoQuote = () => {
    if (mode === 'auto') {
      const prefix = buildPrefixFromPattern(prefixPattern);
      const generatedQuote = `${prefix}${nextNumber || '001'}`;

      setFormData((prev) => ({
        ...prev,
        quote: {
          ...prev.quote,
          quote: generatedQuote,
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
          {/* TOP DETAILS CARD - 6 fields in 3 columns (2 each) */}
          <div className="so-details-card mx-5 mb-4">
            <h1 className="sales-order-title mb-4">New Quote</h1>

            <div className="row g-3 three-column-form">
              {/* COLUMN 1 */}
              <div className="col-lg-4">
                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">
                    Customer name:
                  </label>
                  <select
                    name="customerId"
                    className="form-select so-control"
                    value={formData.quote.customerId}
                    onChange={handleQuoteChange}
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
                  <label
                    className="so-label text-sm text-muted-foreground fw-bold mb-1">
                    Quote #:
                  </label>

                  <div style={{ position: 'relative', width: '100%', marginBottom: 25 }}>
                    <input
                      type="text"
                      name="quote"
                      className="form-control so-control"
                      value={formData.quote.quote}
                      onChange={handleQuoteChange}
                      placeholder="Auto-generated"
                      style={{ paddingRight: '32px' }}
                    />

                    <span
                      onClick={() => setShowSettings(true)}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '45%',
                        transform: 'translateY(-50%)',
                        cursor: 'pointer',
                        color: '#6c757d',
                      }}
                    >
                      <Settings size={16} />
                    </span>
                  </div>

                  <div className="so-form-group mb-4">
                    <label className="so-label text-sm text-muted-foreground fw-bold">
                      Reference Number:
                    </label>
                    <input
                      type="text"
                      name="referenceNumber"
                      className="form-control so-control"
                      value={formData.quote.referenceNumber}
                      onChange={handleQuoteChange}
                      placeholder="Enter reference number"
                    />
                  </div>
                </div>

              </div>

              {/* COLUMN 2 */}
              <div className="col-lg-4">
                {/* Sales Person */}
                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">
                    Sales Person:
                  </label>
                  <SalesPersonSelect
                    name="salesPerson"
                    value={formData.quote.salesPerson}
                    onChange={handleQuoteChange}
                  />


                </div>


                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">Project:</label>
                  <input
                    type="text"
                    name="projectName"
                    className="form-control so-control"
                    value={formData.quote.projectName}
                    onChange={handleQuoteChange}
                    placeholder="Enter project name"
                  />
                </div>
              </div>

              {/* COLUMN 3 */}
              <div className="col-lg-4">
                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">
                    Quote Date:
                  </label>
                  <input
                    type="date"
                    name="quoteDate"
                    className="form-control so-control"
                    value={formData.quote.quoteDate}
                    onChange={handleQuoteChange}
                  />
                </div>

                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">
                    Expiry Date:
                  </label>
                  <input
                    type="date"
                    name="expiryDate"
                    className="form-control so-control"
                    value={formData.quote.expiryDate}
                    onChange={handleQuoteChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* OUTSIDE CARD - Same as Sales Order */}
          <div className="mx-5">
            {/* Item Table */}
            <ItemTable
              rows={formData.itemTable}
              onRowChange={handleRowChange}
              onAddRow={handleAddRow}
              onRemoveRow={handleRemoveRow}
            />

            {/* Notes + Summary */}
            <div className="notes-summary-row">
              <div className="notes-column">
                <div className="so-form-group">
                  <label className="so-label text-sm text-muted-foreground fw-bold">
                    Customer Notes:
                  </label>
                  <textarea
                    className="form-control so-control textarea"
                    name="customerNotes"
                    value={formData.quote.customerNotes}
                    onChange={handleQuoteChange}
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
                    value={formData.quote.termsAndConditions}
                    onChange={handleQuoteChange}
                    placeholder="Enter terms and conditions..."
                  />
                </div>
              </div>

              <div className="summary-column">
                <SummaryBox
                  totals={totals}
                  taxInfo={taxInfo}
                  onTaxChange={handleTaxChange}
                  tdsOptions={tdsOptions}
                  tcsOptions={tcsOptions}
                  loadingTax={loadingTax}
                  onAddTcs={handleAddTcs}
                />

              </div>
            </div>

            {/* Documents */}
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
                className="btn border me-3 px-3"
                style={{ fontSize: 14 }}
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn me-3 px-4"
                style={{ background: '#7991BB', color: '#FFF', fontSize: 14 }}
                onClick={() => setSubmitType('sent')}
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

      {/* Settings modal */}
      {showSettings && (
        <div className="settings-overlay" onClick={closePopup}>
          <div
            className={`settings-modal ${closing ? 'closing' : 'opening'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header custom-header">
              <h4 className="mb-0" style={{ fontSize: 17 }}>Configure Quote Number Preferences</h4>
              <X
                size={20}
                style={{ cursor: 'pointer', color: '#fc0404ff' }}
                onClick={closePopup}
              />
            </div>

            <div className="modal-body mt-3">
              <p style={{ fontSize: 13, color: '#555' }}>
                Your quote numbers are set on auto-generate mode to save your time. Are you sure
                about changing this setting?
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
                  Continue auto-generating quote numbers
                </label>
                <span className='i-btn'>
                  <Info size={13} />
                </span>
              </div>

              {mode === 'auto' && (
                <div className="auto-settings">
                  <div className="auto-settings-row">
                    {/* PREFIX PATTERN */}
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
                        type='text'
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


              <div className="form-check mt-4">
                <input
                  type="radio"
                  name="mode"
                  className="form-check-input"
                  checked={mode === 'manual'}
                  onChange={() => setMode('manual')}
                />
                <label className="form-check-label" style={{ fontWeight: 500 }}>
                  Enter quote numbers manually
                </label>
              </div>

              <div className="d-flex justify-content-center mt-4 gap-0" style={{ gap: 10 }}>
                <button className="btn border me-3 px-4" onClick={closePopup}>
                  Cancel
                </button>
                <button
                  className="btn me-2 px-4"
                  style={{ background: '#7991BB', color: '#FFF' }}
                  onClick={() => {
                    applyAutoQuote();
                  }}
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
