import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../../../components/Header/Header';
import { Toast } from '../../../../components/Toast/Toast';
import { useGlobalToast } from '../../../../components/Toast/ToastContext';
import { Info, Settings, X } from 'react-feather';
import './addInvoice.css';
import ItemTable, {
  SummaryBox,
  type TcsOption,
  type TdsOption,
} from '../../../../components/Table/ItemTable/ItemTable';
import { FeatherUpload } from '../../Customers/AddCustomer/Add';
import api from '../../../../services/api/apiConfig';
// import type { Customer } from '../../SalesOrders/AddOrderSales/AddSalesOrders';
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

interface InvoiceForm {
  invoice: {
    customerId: string;
    orderNumber: string;
    invoiceNo: string;
    invoiceDate: string;
    dueDate: string;
    paymentTerms: string;
    salesPerson: string;
    customerNotes: string;
    termsAndConditions: string;
  };
  itemTable: ItemRow[];
}


type SubmitType = 'draft' | 'sent';

type TaxType = 'TDS' | 'TCS' | '';

export default function AddInvoice() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast, setToast, showToast } = useGlobalToast();

  // ---------------- Modal + Settings ----------------
  const [showSettings, setShowSettings] = useState(false);
  const [closing, setClosing] = useState(false);
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');
  const [nextNumber, setNextNumber] = useState('');
  const [restartYear, setRestartYear] = useState(false);
  const [prefixPattern, setPrefixPattern] = useState('');


  /* ---------------- TAX STATE ---------------- */
  const [tdsOptions, setTdsOptions] = useState<TdsOption[]>([]);
  const [tcsOptions, setTcsOptions] = useState<TcsOption[]>([]);
  const [loadingTax, setLoadingTax] = useState(false);

  const [submitType, setSubmitType] = useState<SubmitType>('draft');


  // CALCULATE DUE DATE 
  const calculateDueDate = (invoiceDate: string, term: string): string => {
    if (!invoiceDate) return '';

    const base = new Date(invoiceDate);

    switch (term) {
      case 'Due on Receipt':
      case 'Advance':
        return invoiceDate;

      case 'Net 15':
        base.setDate(base.getDate() + 15);
        break;

      case 'Net 30':
        base.setDate(base.getDate() + 30);
        break;

      case 'Net 45':
        base.setDate(base.getDate() + 45);
        break;

      case 'Net 60':
        base.setDate(base.getDate() + 60);
        break;

      case 'Due end of the month':
        return new Date(
          base.getFullYear(),
          base.getMonth() + 1,
          0
        ).toISOString().split('T')[0];

      case 'Due end of next month':
        return new Date(
          base.getFullYear(),
          base.getMonth() + 2,
          0
        ).toISOString().split('T')[0];

      default:
        return '';
    }

    return base.toISOString().split('T')[0];
  };


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
  const [formData, setFormData] = useState<InvoiceForm>({
    invoice: {
      customerId: '',
      orderNumber: '',
      invoiceNo: '',
      invoiceDate: '',
      dueDate: '',
      paymentTerms: '',
      salesPerson: '',
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


  // FETCH DATA FRON SALESORDER PREFILL useEffect
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const soData = location.state?.salesOrderData;
    const soItems = location.state?.soItems;

    console.log('🎯 Invoice from SalesOrder:', location.state);



    if (soData && soData.customerId) {
      setFormData({
        invoice: {
          customerId: String(soData.customerId),
          orderNumber: soData.salesOrderNumber || '',
          salesPerson: String(soData.salesPerson || ''),
          invoiceDate: soData.invoiceDate || new Date().toISOString().split('T')[0] || today,
          dueDate: '',
          paymentTerms: soData.paymentTerms || 'Net 30',
          customerNotes: soData.customerNotes || '',
          termsAndConditions: soData.termsAndConditions || '',
          invoiceNo: '', // Auto-generate
        },
        itemTable: soItems?.map((item: any) => ({
          itemDetails: item.description || '',
          quantity: String(item.quantity || ''),
          rate: String(item.rate || ''),
          discount: '0',
          amount: String((item.quantity || 0) * (item.rate || 0)),
        })) || [{
          itemDetails: '', quantity: '', rate: '', discount: '', amount: ''
        }],
      });

      // ✅ Show success toast
      // showToast('SalesOrder data loaded successfully!', 'success');
    } else {
      setFormData(prev => ({
        ...prev,
        invoice: {
          ...prev.invoice,
          invoiceDate: today,
        }
      }))
    }
  }, [location.state]);


  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const dcData = location.state?.dcData;
    const dcItems = location.state?.dcItems;

    if (dcData && dcData.customerId) {
      setFormData({
        invoice: {
          customerId: String(dcData.customerId),
          invoiceNo: '',
          invoiceDate: today,
          dueDate: '',
          paymentTerms: '',
          salesPerson: '',
          orderNumber: dcData.referenceNumber,
          customerNotes: dcData.customerNotes || '',
          termsAndConditions: dcData.termsAndConditions || '',
        },
        itemTable: dcItems.map((item: any) => ({
          itemDetails: item.description,
          quantity: String(item.quantity),
          rate: String(item.rate),
          discount: String(item.discount || 0),
          amount: String(item.quantity * item.rate),
        })),
      });

      // ✅ TAX PREFILL (same logic as SO)
      if (dcData.tax) {
        const tax = dcData.tax;

        let selectedTax = '';

        if (tax.tax_type === 'tds') {
          selectedTax = String(tax.tax_rate); // TDS uses rate
        }

        if (tax.tax_type === 'tcs') {
          const match = tcsOptions.find(
            (o) => Number(o.rate) === Number(tax.tax_rate)
          );
          selectedTax = match ? match.id : '';
        }

        // setTaxInfo({
        //   type: tax.tax_type.toUpperCase(),
        //   selectedTax,
        //   adjustment: Number(dcData.adjustment || 0),
        //   taxRate: Number(tax.tax_rate),
        //   taxAmount: Number(tax.tax_amount),
        //   total: Number(dcData.grandTotal),
        // });


        setTaxInfo({
          type: tax.tax_type.toUpperCase() as TaxType,
          selectedTax,
          adjustment: Number(dcData.adjustment || 0),
          taxRate: Number(tax.tax_rate),
          taxAmount: Number(tax.tax_amount),
          total: Number(dcData.grandTotal),
        });

        setTotals({
          subtotal: Number(dcData.subtotal),
          tax: Number(tax.tax_amount),
          total: Number(dcData.grandTotal),
          grandTotal: Number(dcData.grandTotal),
        });
      }

    } else {
      setFormData(prev => ({
        ...prev,
        invoice: {
          ...prev.invoice,
          invoiceDate: today,
        },
      }));
    }
  }, [location.state, tcsOptions]);


  // DUE DATE 
  useEffect(() => {
    const terms = formData.invoice.paymentTerms;

    if (!terms || terms === 'Custom') return;

    const due = calculateDueDate(
      formData.invoice.invoiceDate,
      terms
    );

    setFormData(prev => ({
      ...prev,
      invoice: {
        ...prev.invoice,
        dueDate: due,
      },
    }));
  }, [
    formData.invoice.invoiceDate,
    formData.invoice.paymentTerms
  ]);

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


  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setFormData(prev => ({
      ...prev,
      invoice: {
        ...prev.invoice,
        dueDate: value,
        paymentTerms: 'Custom', // 👈 auto switch
      },
    }));
  };


  const validateForm = () => {
    if (!formData.invoice.customerId) return showToast('Select a customer', 'warning'), false;
    if (!formData.invoice.invoiceNo) return showToast('Invoice number required', 'warning'), false;
    if (!formData.invoice.invoiceDate) return showToast('Quote date required', 'warning'), false;
    if (!formData.itemTable.length) return showToast('Add items', 'warning'), false;
    return true;
  };

  const round2 = (value: number) =>
    Number(Number(value).toFixed(2));


  const buildTaxPayload = () => {
    if (!taxInfo.type || taxInfo.taxAmount === 0) return null;

    if (taxInfo.type === 'TDS') {
      return {
        tax_type: 'tds',
        tax_name: `TDS @${taxInfo.taxRate}%`,
        tax_rate: round2(taxInfo.taxRate),
        tax_amount: round2(taxInfo.taxAmount),
      };
    }

    if (taxInfo.type === 'TCS') {
      const opt = tcsOptions.find(
        (o) => String(o.id) === taxInfo.selectedTax
      );

      return {
        tax_type: 'tcs',
        tax_name: opt ? opt.name : `TCS @${taxInfo.taxRate}%`,
        tax_rate: round2(taxInfo.taxRate),
        tax_amount: round2(taxInfo.taxAmount),
      };
    }

    return null;
  };




  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const payload = {
      customer: Number(formData.invoice.customerId),

      order_number: formData.invoice.orderNumber || null, // ✅ FIX

      invoice_number: formData.invoice.invoiceNo,
      invoice_date: formData.invoice.invoiceDate,
      due_date: formData.invoice.dueDate || null,
      payment_terms: formData.invoice.paymentTerms,

      sales_person: formData.invoice.salesPerson
        ? Number(formData.invoice.salesPerson)
        : null,
      status: submitType,

      customer_notes: formData.invoice.customerNotes,
      terms_and_conditions: formData.invoice.termsAndConditions,

      subtotal: round2(totals.subtotal),
      tax: buildTaxPayload(),
      tax_total: round2(taxInfo.taxAmount),
      adjustment: round2(taxInfo.adjustment),
      grand_total: round2(totals.grandTotal),

      items: formData.itemTable.map((row) => ({
        item_details: row.itemDetails,
        quantity: Number(row.quantity),
        rate: round2(Number(row.rate)),
        discount: round2(Number(row.discount) || 0),
        amount: round2(Number(row.amount)),
      })),
    };


    try {
      console.log("FINAL INVOICE PAYLOAD", payload);

      await api.post("invoices/create/", payload);

      showToast("Invoice created successfully", "success");

      setTimeout(() => {
        navigate("/sales/invoices");
      }, 800);
    } catch (error: any) {
      // console.error(error);

      // const message =
      //   error.response?.data?.detail ||
      //   error.response?.data?.non_field_errors?.[0] ||
      //   "Failed to create invoice";

      // showToast(message, "error");

      console.error("INVOICE ERROR RESPONSE:", error.response?.data);

      showToast(
        JSON.stringify(error.response?.data),
        "error"
      );

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
                  <CustomerSelect
                    name="customerId"
                    value={formData.invoice.customerId}
                    onChange={handleChange}
                  />

                </div>

                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">
                    Order Number:
                  </label>
                  <input
                    type="text"
                    name="orderNumber"
                    className="form-control so-control"
                    value={formData.invoice.orderNumber}
                    onChange={handleChange}
                    placeholder="SO / DC / Reference No"
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
                    <option value="Due on Receipt">Due on Receipt</option>
                    <option value="Advance">Advance</option>
                    <option value="Net 15">Net 15</option>
                    <option value="Net 30">Net 30</option>
                    <option value="Net 45">Net 45</option>
                    <option value="Net 60">Net 60</option>
                    <option value="Due end of the month">Due end of the month</option>
                    <option value="Due end of next month">Due end of next month</option>
                    <option value="Custom">Custom</option>
                  </select>

                </div>

              </div>

              {/* COLUMN 2: Payment Terms + Invoice No */}
              <div className="col-lg-4">
                {/* Invoice date */}
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
                    // disabled={formData.invoice.paymentTerms !== 'Custom'}
                    value={formData.invoice.dueDate}
                    onChange={handleDueDateChange}
                  />
                </div>

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
                  tdsOptions={tdsOptions}
                  loadingTax={loadingTax}
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
        </form >
      </div >

      {/* ---------------- Settings Modal ---------------- */}
      {
        showSettings && (
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
        )
      }
    </>
  );
}
