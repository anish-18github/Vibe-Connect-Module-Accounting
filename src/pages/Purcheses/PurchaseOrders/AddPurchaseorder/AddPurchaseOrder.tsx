// PurchaseOrder.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../../components/Header/Header';
import { Toast } from '../../../../components/Toast/Toast';
import { useGlobalToast } from '../../../../components/Toast/ToastContext';
import ItemTable, {
  SummaryBox,
  type ItemRow,
  type TcsOption,
} from '../../../../components/Table/ItemTable/ItemTable';
import { FeatherUpload } from '../../../Sales/Customers/AddCustomer/Add';
import './addPurchaseOrder.css';
import { Info, Settings, X } from 'react-feather';

interface PurchaseOrderHeader {
  vendorName: string;
  deliveryType: 'organization' | 'customer';
  purchaseOrderNo: string;
  referenceNo: string;
  orderDate: string;
  deliveryDate: string;
  shipmentPreference: string;
  paymentTerms: string;
  customerNotes: string;
  termsAndConditions: string;
}

interface PurchaseOrderForm {
  purchaseOrder: PurchaseOrderHeader;
  itemTable: ItemRow[];
}

type TaxType = 'TDS' | 'TCS' | '';

export default function AddPurchaseOrder() {
  const navigate = useNavigate();
const { toast, setToast, showToast } = useGlobalToast();

  const [formData, setFormData] = useState<PurchaseOrderForm>({
    purchaseOrder: {
      vendorName: '',
      deliveryType: 'organization',
      purchaseOrderNo: '',
      referenceNo: '',
      orderDate: '',
      deliveryDate: '',
      shipmentPreference: '',
      paymentTerms: '',
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

  const [showSettings, setShowSettings] = useState(false);
  const [closing, setClosing] = useState(false);

  const [tcsOptions, setTcsOptions] = useState<TcsOption[]>([
    { id: 'tcs_5', name: 'TCS Standard', rate: 5 },
    { id: 'tcs_12', name: 'TCS Standard', rate: 12 },
    { id: 'tcs_18', name: 'TCS Standard', rate: 18 },
  ]);

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

  const [showAddressModal, setShowAddressModal] = useState(false);

  const handleOpenAddress = () => setShowAddressModal(true);
  const handleCloseAddress = () => setShowAddressModal(false);
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');
  const [nextNumber, setNextNumber] = useState('');
  const [restartYear, setRestartYear] = useState(false);
  const [prefixPattern, setPrefixPattern] = useState<string>('CUSTOM');


  useEffect(() => {
    document.body.style.overflow = showSettings ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showSettings]);

  useEffect(() => {
    document.body.style.overflow = showAddressModal ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showAddressModal]);

  // ---------------- Handlers ----------------

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

  const closePopup = () => {
    setClosing(true);
    setTimeout(() => {
      setShowSettings(false);
      setClosing(false);
    }, 250);
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

  const handleTaxChange = (field: any, value: any) => {
    setTaxInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddTcs = (opt: TcsOption) => {
    setTcsOptions((prev) => [...prev, opt]);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      purchaseOrder: {
        ...prev.purchaseOrder,
        [name]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: build payload, save to localStorage/API like Sales Orders
    const existing = JSON.parse(localStorage.getItem('purchaseOrders') || '[]');
    existing.push(finalPayload);
    localStorage.setItem('purchaseOrders', JSON.stringify(existing));
    sessionStorage.setItem('formSuccess', 'Purchase order created');
    navigate('/purchases/purchase-orders');
  };

  const applyAutoSO = () => {
    if (mode === 'auto') {

      const prefix = buildPrefixFromPattern(prefixPattern);
      const fullNumber = `${prefix}${nextNumber || '001'}`;

      setFormData((prev) => ({
        ...prev,
        purchaseOrder: {
          ...prev.purchaseOrder,
          purchaseOrderNo: fullNumber,
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
          {/* ONLY 3-column fields in their own card */}
          <div className="so-details-card mx-5 mb-4">
            <h1 className="sales-order-title mb-4">Purchase Order</h1>
            <div className="row g-3 three-column-form">
              {/* COLUMN 1 */}
              <div className="col-lg-4">
                {/* Vendor Name */}
                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">
                    Vendor Name<span className="text-danger">*</span>:
                  </label>
                  <select
                    name="vendorName"
                    className="form-select so-control p-6 pt-1 flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
                    value={formData.purchaseOrder.vendorName}
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      Select a Vendor
                    </option>
                    <option value="Vendor A">Vendor A</option>
                    <option value="Vendor B">Vendor B</option>
                  </select>
                </div>

                {/* Purchase Order# */}
                {/* Purchase Order No (same as Sales Order No) */}
                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">
                    Purchase Order No:
                  </label>

                  <div style={{ position: 'relative', width: '100%' }}>


                    <input
                      type="text"
                      name="purchaseOrderNo"
                      className="form-control so-control"
                      value={formData.purchaseOrder.purchaseOrderNo}
                      onChange={handleChange}
                      placeholder="Auto-generated"
                    />

                    {/* Settings icon INSIDE the input field on the right */}
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

                {/* Delivery Address */}
                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">
                    Delivery Address<span className="text-danger">*</span>:
                  </label>
                  <div className="radio-row" style={{ fontSize: 13 }}>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        id="orgRadio"
                        name="deliveryType"
                        checked={formData.purchaseOrder.deliveryType === 'organization'}
                        onChange={() =>
                          setFormData((prev) => ({
                            ...prev,
                            purchaseOrder: {
                              ...prev.purchaseOrder,
                              deliveryType: 'organization',
                            },
                          }))
                        }
                      />
                      <label className="form-check-label small" htmlFor="orgRadio">
                        Organization
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        id="custRadio"
                        name="deliveryType"
                        checked={formData.purchaseOrder.deliveryType === 'customer'}
                        onChange={() =>
                          setFormData((prev) => ({
                            ...prev,
                            purchaseOrder: {
                              ...prev.purchaseOrder,
                              deliveryType: 'customer',
                            },
                          }))
                        }
                      />
                      <label className="form-check-label small" htmlFor="custRadio">
                        Customer
                      </label>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-link p-0 text-sm align-self-start"
                    style={{ fontSize: 12, textDecoration: "none" }}
                    onClick={handleOpenAddress}
                  >
                    Change destination to deliver
                  </button>
                </div>
              </div>

              {/* COLUMN 2 */}
              <div className="col-lg-4">
                {/* Reference# */}
                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">
                    Reference#:
                  </label>
                  <input
                    type="text"
                    name="referenceNo"
                    className="form-control so-control"
                    value={formData.purchaseOrder.referenceNo}
                    onChange={handleChange}
                  />
                </div>

                {/* Date */}
                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">
                    Sales Order Date:
                  </label>
                  <input
                    type="date"
                    name="orderDate"
                    className="form-control so-control"
                    value={formData.purchaseOrder.orderDate}
                    onChange={handleChange}
                  />
                </div>

                {/* Delivery Date */}
                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">
                    Expected Shipment:
                  </label>
                  <input
                    type="date"
                    name="deliveryDate"
                    className="form-control so-control"
                    value={formData.purchaseOrder.deliveryDate}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* COLUMN 3 */}
              <div className="col-lg-4">
                {/* Shipment Preference */}
                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">
                    Delivery Method:
                  </label>
                  <select
                    name="shipmentPreference"
                    className="form-select so-control p-6 pt-1 flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
                    value={formData.purchaseOrder.shipmentPreference}
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      Select Delivery Method
                    </option>
                    <option value="By Air">By Air</option>
                    <option value="By Road">By Road</option>
                    <option value="By Sea">By Sea</option>
                  </select>
                </div>

                {/* Payment Terms */}
                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">
                    Payment Terms:
                  </label>
                  <select
                    name="paymentTerms"
                    className="form-select so-control p-6 pt-1 flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
                    value={formData.purchaseOrder.paymentTerms}
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      Select
                    </option>
                    <option value="Due on Receipt">Due on Receipt</option>
                    <option value="Net 15">Net 15</option>
                    <option value="Net 30">Net 30</option>
                    <option value="Net 45">Net 45</option>
                  </select>
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
                    value={formData.purchaseOrder.customerNotes}
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
                    value={formData.purchaseOrder.termsAndConditions}
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

      {showAddressModal && (
        <div className="settings-overlay" onClick={handleCloseAddress}>
          <div
            className="settings-modal opening "
            style={{ maxWidth: 520 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div
              className="modal-header custom-header"
              style={{ background: '#f4f4f4', color: '#0a0000ff' }}
            >
              <h4 style={{ fontSize: 17 }} className="mb-0">Delivery Address</h4>
              <X
                size={20}
                style={{ cursor: 'pointer', color: '#fc0404ff' }}
                onClick={handleCloseAddress}
              />
            </div>

            {/* BODY */}
            <div className="modal-body mt-3">
              {/* Country */}
              <div className="so-form-group mb-3">
                <label className="so-label fw-bold">Country / Region</label>
                <select className="form-select so-control">
                  <option value="">Select Country</option>
                  <option value="India">India</option>
                  <option value="USA">USA</option>
                </select>
              </div>

              {/* State */}
              <div className="so-form-group mb-3">
                <label className="so-label fw-bold">State / Province</label>
                <input
                  type="text"
                  className="form-control so-control border"
                  placeholder="Enter state"
                />
              </div>

              {/* City */}
              <div className="so-form-group mb-3">
                <label className="so-label fw-bold">City</label>
                <input
                  type="text"
                  className="form-control so-control border"
                  placeholder="Enter city"
                />
              </div>

              {/* Address Line 1 */}
              <div className="so-form-group mb-3">
                <label className="so-label fw-bold">Street Address</label>
                <textarea
                  className="form-control so-control textarea border"
                  rows={2}
                  placeholder="Street, building, area"
                />
              </div>

              {/* ZIP + Phone */}
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="so-form-group">
                    <label className="so-label fw-bold">ZIP / Postal Code</label>
                    <input className="form-control so-control border" />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="so-form-group">
                    <label className="so-label fw-bold">Phone</label>
                    <input className="form-control so-control border" />
                  </div>
                </div>
              </div>
              {/* FOOTER */}
              <div className="d-flex justify-content-center mt-2 gap-0">
                <button className="btn border me-3 px-4" onClick={handleCloseAddress}>
                  Cancel
                </button>
                <button className="btn me-2 px-4"
                  style={{ background: '#7991BB', color: '#FFF' }}>
                  Save Address
                </button>
              </div>
            </div>


          </div>
        </div>
      )}



      {showSettings && (
        <div className="settings-overlay" onClick={closePopup}>
          <div
            className={`settings-modal ${closing ? 'closing' : 'opening'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header custom-header">
              <h4 className="mb-0" style={{ fontSize: 17 }}>Configure Delivery Challan Number</h4>
              <X
                size={20}
                style={{ cursor: 'pointer', color: '#fc0404ff' }}
                onClick={closePopup}
              />
            </div>

            <div className="modal-body mt-3">
              <p style={{ fontSize: 13, color: '#555' }}>
                Your Delivery Challans are currently set to auto-generate numbers. Change settings
                if needed.
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
                  Continue auto-generating Challan Numbers
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
                  Enter Challan Numbers manually
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
}
