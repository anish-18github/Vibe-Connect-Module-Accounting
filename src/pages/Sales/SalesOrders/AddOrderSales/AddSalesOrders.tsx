import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../../components/Header/Header';
import Toast, { useToast } from '../../../../components/Toast/Toast';
import { Info, Settings, X } from 'react-feather';

import './salesOrders.css';

import ItemTable, {
  SummaryBox,
  type ItemRow,
  type TcsOption,
  type TdsOption,
} from '../../../../components/Table/ItemTable/ItemTable';
import { FeatherUpload } from '../../Customers/AddCustomer/Add';
import api from '../../../../services/api/apiConfig';
import SalesPersonSelect from '../../../../components/Masters/SalesPersonsMaster/SalesPersonSelect';
import { createTCS, getTCS, getTDS } from '../../../../services/api/taxService';
import CustomerSelect from '../../../../components/Masters/CustomerMaster/CustomerSelector';

export interface Customer {
  customerId: number;
  name: string;
}

interface SalesOrdersForm {
  salesOrder: {
    customerId: string;
    salesOrderNo: string;
    referenceNumber: string;
    salesOrderDate: string;
    expectedShipmentDate: string;
    paymentTerms: string;
    salesPerson: string;
    deliveryMethod: string;
    customerNotes: string;
    termsAndConditions: string;
  };
  itemTable: ItemRow[];
}

type TaxType = 'TDS' | 'TCS' | '';

type SubmitType = 'draft' | 'sent';



export default function AddSalesOrder() {
  const navigate = useNavigate();
  const { toast, setToast, showToast } = useToast();

  const [showSettings, setShowSettings] = useState(false);
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');
  const [nextNumber, setNextNumber] = useState('');
  const [restartYear, setRestartYear] = useState(false);
  const [closing, setClosing] = useState(false);
  const [prefixPattern, setPrefixPattern] = useState('');


  /* ---------------- TAX STATE ---------------- */
  const [tdsOptions, setTdsOptions] = useState<TdsOption[]>([]);
  const [tcsOptions, setTcsOptions] = useState<TcsOption[]>([]);
  const [loadingTax, setLoadingTax] = useState(false);

  /* ---------------- SUBMIT WITH STATUS ---------------- */
  const [submitType, setSubmitType] = useState<SubmitType>('draft');

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


  // helper: build prefix string from pattern
  const buildPrefixFromPattern = (pattern: string) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    switch (pattern) {
      case 'YEAR':
        return `SO-${year}-`;
      case 'YEAR_MONTH':
        return `SO-${year}${month}-`;
      case 'DATE_DDMMYYYY':
        return `SO-${day}${month}${year}-`;
      case 'YEAR_SLASH_MONTH':
        return `SO-${year}/${month}-`;
      default:
        return 'SO-';
    }
  };



  const applyAutoSO = () => {
    if (mode === 'auto') {
      const prefix = buildPrefixFromPattern(prefixPattern);
      const fullNumber = `${prefix}${nextNumber || '001'}`;

      setFormData((prev) => ({
        ...prev,
        salesOrder: {
          ...prev.salesOrder,
          salesOrderNo: fullNumber, // ✅ matches the input binding
        },
      }));
    }
    closePopup();
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





  // FORM STATE

  const [formData, setFormData] = useState<SalesOrdersForm>({
    salesOrder: {
      customerId: '',
      salesOrderNo: '',
      referenceNumber: '',
      salesOrderDate: '',
      expectedShipmentDate: '',
      paymentTerms: '',
      salesPerson: '',
      deliveryMethod: '',
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

  // const [tcsOptions, setTcsOptions] = useState<TcsOption[]>([
  //   { id: 'tcs_5', name: 'TCS Standard', rate: 5 },
  //   { id: 'tcs_12', name: 'TCS Standard', rate: 12 },
  //   { id: 'tcs_18', name: 'TCS Standard', rate: 18 },
  // ]);

  // TAX STATE

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

  /* ---------------- TAX CALCULATION ---------------- */


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


  // CURRENT DATE
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFormData((prev) => ({
      ...prev,
      salesOrder: {
        ...prev.salesOrder,
        salesOrderDate: today,
      },
    }));
  }, []);


  /* ---------------- HANDLERS ---------------- */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      salesOrder: { ...prev.salesOrder, [name]: value },
    }));
  };

  const handleTaxChange = (field: any, value: any) => {
    setTaxInfo((prev) => ({ ...prev, [field]: value }));
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
    if (!formData.salesOrder.customerId)
      return showToast('Select a customer', 'warning'), false;

    if (!formData.salesOrder.salesOrderNo)
      return showToast('Sales Order number required', 'warning'), false;

    if (!formData.salesOrder.salesOrderDate)
      return showToast('Sales Order date required', 'warning'), false;

    if (!formData.itemTable.length)
      return showToast('Add at least one item', 'warning'), false;

    return true;
  };

  const round2 = (value: number) =>
    Number(Number(value).toFixed(2));




  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const payload = {
      customer: Number(formData.salesOrder.customerId),

      sales_order_number: formData.salesOrder.salesOrderNo,
      sales_order_date: formData.salesOrder.salesOrderDate,
      expected_shipment_date: formData.salesOrder.expectedShipmentDate,

      payment_terms: formData.salesOrder.paymentTerms,
      delivery_method: formData.salesOrder.deliveryMethod,
      sales_person: Number(formData.salesOrder.salesPerson),
      reference_number: formData.salesOrder.referenceNumber || "",

      customer_notes: formData.salesOrder.customerNotes,
      terms_and_conditions: formData.salesOrder.termsAndConditions,

      status: submitType,

      // 🔥 totals
      subtotal: round2(totals.subtotal),
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
      console.log('FINAL SALES ORDER PAYLOAD', payload);

      await api.post('sales-orders/create/', payload);

      showToast('Sales Order created successfully', 'success');

      setTimeout(() => {
        navigate('/sales/sales-orders');
      }, 800);

    } catch (error: any) {
      console.error(error);
      // console.error('FULL ERROR RESPONSE:', error.response?.data);
      // showToast(JSON.stringify(error.response?.data), 'error');

      const message =
        error.response?.data?.detail ||
        error.response?.data?.non_field_errors?.[0] ||
        'Failed to create sales order';

      showToast(message, 'error');
    }
  };



  return (
    <>
      <Header />
      <Toast toast={toast} setToast={setToast} />

      <div className="sales-orders-page">
        {/* Page title outside any card */}

        <form onSubmit={handleSubmit} className="sales-order-form">
          {/* ONLY 3-column fields in their own card */}
          <div className="so-details-card mx-5 mb-4">
            <h1 className="sales-order-title mb-4">Sales Order</h1>
            <div className="row g-3 three-column-form">
              {/* COLUMN 1 */}
              <div className="col-lg-4">
                {/* Customer Name */}
                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">
                    Customer Name:
                  </label>
                  <CustomerSelect
                    name="customerId"
                    value={formData.salesOrder.customerId}
                    onChange={handleChange}
                  />
                </div>

                {/* Sales Order Date */}
                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">
                    Sales Order Date:
                  </label>
                  <input
                    type="date"
                    className="form-control so-control"
                    name="salesOrderDate"
                    value={formData.salesOrder.salesOrderDate}
                    onChange={handleChange}
                  />
                </div>

                {/* Payment Terms */}
                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">
                    Payment Terms:
                  </label>
                  <select
                    name="paymentTerms"
                    className="form-select so-control"
                    value={formData.salesOrder.paymentTerms}
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      Select
                    </option>
                    <option value="Advance">Advance</option>
                    <option value="Net 15">Net 15</option>
                    <option value="Net 30">Net 30</option>
                    <option value="Net 45">Net 45</option>
                  </select>
                </div>
              </div>

              {/* COLUMN 2 */}
              <div className="col-lg-4">
                {/* Delivery Method */}
                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">
                    Delivery Method:
                  </label>
                  <select
                    name="deliveryMethod"
                    className="form-select so-control p-6 pt-1 flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
                    value={formData.salesOrder.deliveryMethod}
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      Select Delivery Method
                    </option>
                    <option value="Courier">Courier</option>
                    <option value="Transport">Transport</option>
                    <option value="Pickup">Pickup</option>
                  </select>
                </div>

                {/* Sales Order No */}
                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">
                    Sales Order No:
                  </label>

                  <div style={{ position: 'relative', width: '100%' }}>

                    <input
                      type="text"
                      name="salesOrderNo"
                      className="form-control so-control"
                      value={formData.salesOrder.salesOrderNo}
                      onChange={handleChange}
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


                {/* Reference Number */}
                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">
                    Reference Number:
                  </label>
                  <input
                    type="text"
                    name="referenceNumber"
                    value={formData.salesOrder.referenceNumber}
                    onChange={handleChange}
                    className="form-control so-control"
                    placeholder='Enter reference number'
                  />
                </div>
              </div>

              {/* COLUMN 3 */}
              <div className="col-lg-4">
                {/* Expected Shipment Date */}
                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">
                    Expected Shipment:
                  </label>
                  <input
                    type="date"
                    className="form-control so-control"
                    name="expectedShipmentDate"
                    value={formData.salesOrder.expectedShipmentDate}
                    onChange={handleChange}
                  />
                </div>

                {/* Salesperson */}
                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">
                    Salesperson:
                  </label>
                  <SalesPersonSelect
                    name="salesPerson"
                    value={formData.salesOrder.salesPerson}
                    onChange={handleChange}
                  />


                </div>
              </div>
            </div>
          </div>

          {/* Everything else stays OUTSIDE any card, with consistent margins */}
          <div className="mx-5">
            {/* Item table header */}
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
                    value={formData.salesOrder.customerNotes}
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
                    value={formData.salesOrder.termsAndConditions}
                    onChange={handleChange}
                    placeholder="Enter terms and conditins..."
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

            {/* Documents */}
            <div className="row mb-4 mt-4 align-items-start">
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
              <h4 className="mb-0" style={{ fontSize: 17 }}>Configure Sales Order Number Preferences</h4>
              <X
                size={20}
                style={{ cursor: 'pointer', color: '#fc0404ff' }}
                onClick={closePopup}
              />
            </div>

            <div className="modal-body mt-3">
              <p style={{ fontSize: 13, color: '#555' }}>
                Your Sales Orders are currently set to auto-generate numbers. Change settings if
                needed.
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
                  Continue auto-generating Sales Order Numbers
                </label>
                <span className='i-btn' >
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

              <div className="d-flex justify-content-center mt-4 gap-0" style={{ gap: 10 }}>
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
