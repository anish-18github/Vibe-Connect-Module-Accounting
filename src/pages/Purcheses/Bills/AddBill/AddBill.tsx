import React, { useEffect, useState } from 'react';
import Header from '../../../../components/Header/Header';
import { Toast } from '../../../../components/Toast/Toast';
import { useGlobalToast } from '../../../../components/Toast/ToastContext';
import ItemTable, {
  SummaryBox,
  type TcsOption,
} from '../../../../components/Table/ItemTable/ItemTable';
import { FeatherUpload } from '../../../Sales/Customers/AddCustomer/Add';
import { useNavigate } from 'react-router-dom';

interface BillHeader {
  vendorName: string;
  bill: string;
  orderNumber: string;
  billDate: string;
  dueDate: string;
  accountsPayable: string;
  subject: string;
  paymentTerm: string;
  customerNotes: string;
  termsAndConditions: string;
}

interface ItemRow {
  itemDetails: string;
  quantity: number | string;
  rate: number | string;
  discount: number | string;
  amount: number | string;
}

interface BillForm {
  billHeader: BillHeader;
  itemTable: ItemRow[];
}

type TaxType = 'TDS' | 'TCS' | '';

export default function AddBill() {
  const navigate = useNavigate();
const { toast, setToast, showToast } = useGlobalToast();

  const [formData, setFormData] = useState<BillForm>({
    billHeader: {
      vendorName: '',
      bill: '',
      orderNumber: '',
      billDate: '',
      dueDate: '',
      accountsPayable: '',
      subject: '',
      paymentTerm: '',
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
      billHeader: {
        ...prev.billHeader,
        [name]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: build payload, save to localStorage/API like Sales Orders
    sessionStorage.setItem('formSuccess', 'Bill saved');
    navigate(-1);
  };

  return (
    <>
      <Header />
      <Toast toast={toast} setToast={setToast} />

      <div className="sales-orders-page">
        <form onSubmit={handleSubmit} className="sales-order-form">
          {/* ONLY 3-column fields in their own card */}
          <div className="so-details-card mx-5 mb-4">
            <h1 className="sales-order-title mb-4">New Bill</h1>
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
                    value={formData.billHeader.vendorName}
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      Select a Vendor
                    </option>
                    <option value="Vendor A">Vendor A</option>
                    <option value="Vendor B">Vendor B</option>
                  </select>
                </div>

                {/* Bill# */}
                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">Bill#:</label>
                  <input
                    type="text"
                    name="bill"
                    className="form-control so-control"
                    value={formData.billHeader.bill}
                    onChange={handleChange}
                  />
                </div>

                {/* Due Date */}
                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">
                    Due Date:
                  </label>
                  <input
                    type="date"
                    className="form-control so-control"
                    name="dueDate"
                    value={formData.billHeader.dueDate}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* COLUMN 2 */}
              <div className="col-lg-4">
                {/* Bill Date */}
                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">
                    Bill Date:
                  </label>
                  <input
                    type="date"
                    className="form-control so-control"
                    name="billDate"
                    value={formData.billHeader.billDate}
                    onChange={handleChange}
                  />
                </div>

                {/* Order Number */}
                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">
                    Order Number:
                  </label>
                  <input
                    type="text"
                    className="form-control so-control"
                    name="orderNumber"
                    value={formData.billHeader.orderNumber}
                    onChange={handleChange}
                  />
                </div>

                {/* Accounts Payable */}
                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">
                    Accounts Payable:
                  </label>
                  <select
                    name="accountsPayable"
                    className="form-select so-control p-6 pt-1 flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
                    value={formData.billHeader.accountsPayable}
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      Select account
                    </option>
                    <option value="AP-1">Accounts Payable 1</option>
                    <option value="AP-2">Accounts Payable 2</option>
                  </select>
                </div>
              </div>

              {/* COLUMN 3 */}
              <div className="col-lg-4">
                {/* Payment Term */}
                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">
                    Payment Term:
                  </label>
                  <select
                    name="paymentTerm"
                    className="form-select so-control p-6 pt-1 flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
                    value={formData.billHeader.paymentTerm}
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

                {/* Subject */}
                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">Subject:</label>
                  <textarea
                    name="subject"
                    className="form-control so-control subject-textarea"
                    rows={2}
                    style={{ resize: 'none' }}
                    value={formData.billHeader.subject}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Everything else stays OUTSIDE any card, with consistent margins */}
          <div className="mx-5">
            {/* Item table */}
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
                    value={formData.billHeader.customerNotes}
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
                    value={formData.billHeader.termsAndConditions}
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
    </>
  );
}
