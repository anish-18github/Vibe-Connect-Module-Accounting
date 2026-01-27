import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
// import { Info, Settings, X } from 'react-feather';
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
    // invoiceNo: string;
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
  const location = useLocation();

  const { toast, setToast, showToast } = useGlobalToast();

  const [invoiceId, setInvoiceId] = useState<number | null>(null);
  const [invoiceNumber, setInvoiceNumber] = useState<string | null>(null);

  /* ---------------- TAX STATE ---------------- */
  const [tdsOptions, setTdsOptions] = useState<TdsOption[]>([]);
  const [tcsOptions, setTcsOptions] = useState<TcsOption[]>([]);
  const [loadingTax, setLoadingTax] = useState(false);

  const [submitType, setSubmitType] = useState<SubmitType>('draft');



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
  const [formData, setFormData] = useState<RecurringInvoiceForm>({
    invoice: {
      customerId: '',
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


  // PRE-FILLED FROM INVOICE 
  // In RecurringInvoice form (useEffect)
  useEffect(() => {
    const invoiceData = location.state?.invoiceData;
    const invoiceItems = location.state?.invoiceItems || location.state?.itemTable;
    const invoiceNumber = location.state?.invoiceNumber;
    const invoiceId = location.state?.invoiceId;

    if (invoiceData && invoiceData.customerId) {
      setFormData({
        invoice: {
          customerId: String(invoiceData.customerId),
          orderNumber: invoiceData.orderNumber || '',
          paymentTerms: invoiceData.paymentTerms || '',
          profileName: invoiceData.profileName || '',
          repeatEvery: invoiceData.repeatEvery || '',
          startOn: invoiceData.startOn || '',
          endOn: invoiceData.endOn || '',
          salesPerson: String(invoiceData.salesPerson || ''),
          subject: invoiceData.subject || '',
          customerNotes: invoiceData.customerNotes || '',
          termsAndConditions: invoiceData.termsAndConditions || '',
        },
        itemTable: invoiceItems || [/* empty row */],
      });
      setInvoiceId(invoiceId)
      setInvoiceNumber(invoiceNumber);
      showToast('Invoice data loaded for recurring setup!', 'success');
    }
  }, [location.state]);




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

  const validateForm = () => {
    if (!formData.invoice.customerId) return showToast('Select a customer', 'warning'), false;
    if (!formData.invoice.profileName) return showToast('Enter a suitable profile name.', 'warning'), false;
    if (!formData.invoice.repeatEvery) return showToast('Frequency is required', 'warning'), false;
    if (!formData.itemTable.length) return showToast('Add items', 'warning'), false;
    return true;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if(!validateForm()) return;

    try {
      const payload = {
        customer: Number(formData.invoice.customerId),
        order_number: formData.invoice.orderNumber
          ? Number(formData.invoice.orderNumber)
          : null,
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

      console.log("FINAL RECURRING INVOICE PAYLOAD", payload);

      // ✅ API CALL
      await api.post('recurring-invoices/create/', payload);

      // ✅ SUCCESS TOAST (like invoice ✅)
      const today = new Date().toISOString().split('T')[0];
      const message = formData.invoice.startOn === today
        ? 'Recurring invoice created + First invoice generated today!'
        : `Recurring invoice created! First invoice scheduled for ${formData.invoice.startOn}`;

      showToast(message, 'success');  // ✅ SHOW SUCCESS

      // ✅ NAVIGATE with delay (like invoice ✅)
      setTimeout(() => {
        navigate('/sales/payment-invoices');
      }, 800);

    } catch (error: any) {
      console.error('RECURRING INVOICE ERROR RESPONSE:', error.response?.data);

      // ✅ ERROR TOAST (like invoice ✅)
      setToast({
        stage: 'enter',
        type: 'error',
        message: error.response?.data?.detail ||
          JSON.stringify(error.response?.data) ||
          'Failed to create recurring invoice',
      });
    }
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
                    Customer <span className='text-danger'>*</span> :
                  </label>
                  <CustomerSelect
                    name="customerId"
                    value={formData.invoice.customerId}
                    onChange={handleChange}
                  />

                </div>

                {/* <div className="so-form-group mb-4">
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
                </div> */}

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
                    <option value="Due on Receipt">Due on Receipt</option>
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
                    Profile Name <span className='text-danger'>*</span> :
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
                    Repeat Every <span className='text-danger'>*</span> :
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
    </>
  );
}
