import { useNavigate } from 'react-router-dom';
import { Plus, X } from 'react-feather';
import Header from '../../../../components/Header/Header';
import Toast, { useToast } from '../../../../components/Toast/Toast';
import React, { useState } from 'react';
import './addJournal.css';
import { FeatherUpload } from '../../../Sales/Customers/AddCustomer/Add';
// Journal entry row interface
interface JournalRow {
  account: string; // 1️⃣ SELECT
  description: string; // 2️⃣ TEXT INPUT
  contact: string; // 3️⃣ SELECT
  debit: number | string; // 4️⃣ TEXT INPUT (no placeholder)
  credit: number | string; // 5️⃣ TEXT INPUT (no placeholder)
}

export default function AddJournal() {
  const navigate = useNavigate();
  const { toast, setToast, showToast } = useToast();

  // Main form state
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0], // Current date
    journal: '',
    reference: '',
    notes: '',
    isCashBased: false,
    currency: '',
  });

  // ✅ 2 DEFAULT ROWS for journal entries
  const [journalRows, setJournalRows] = useState<JournalRow[]>([
    { account: '', description: '', contact: '', debit: '', credit: '' }, // Row 1
    { account: '', description: '', contact: '', debit: '', credit: '' }, // Row 2
  ]);

  // Calculate totals from table
  const debitTotal = journalRows.reduce((sum, row) => {
    const num = Number(row.debit) || 0;
    return sum + num;
  }, 0);

  const creditTotal = journalRows.reduce((sum, row) => {
    const num = Number(row.credit) || 0;
    return sum + num;
  }, 0);

  const difference = debitTotal - creditTotal; // positive = more debit, negative = more credit

  const currencies = ['USD - US Dollar', 'EUR - Euro', 'INR - Indian Rupee'];

  // Account options for SELECT
  const accounts = [
    { value: '', label: 'Select Account' },
    { value: 'cash', label: 'Cash Account' },
    { value: 'bank', label: 'Bank Account' },
    { value: 'sales', label: 'Sales Account' },
    { value: 'purchase', label: 'Purchase Account' },
    { value: 'expense', label: 'Expense Account' },
  ];

  // Contact options for SELECT
  const contacts = [
    { value: '', label: 'Select Contact' },
    { value: 'customer1', label: 'Customer A' },
    { value: 'customer2', label: 'Customer B' },
    { value: 'vendor1', label: 'Vendor X' },
    { value: 'vendor2', label: 'Vendor Y' },
    { value: 'employee1', label: 'Employee Z' },
  ];

  // Handle main form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle checkbox
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, isCashBased: e.target.checked }));
  };

  // Handle table row changes
  const handleRowChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setJournalRows((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [name]: value };
      return updated;
    });
  };

  // Add new journal row
  const addJournalRow = () => {
    setJournalRows((prev) => [
      ...prev,
      { account: '', description: '', contact: '', debit: '', credit: '' },
    ]);
  };

  // Remove journal row (minimum 2 rows)
  const removeJournalRow = (index: number) => {
    if (journalRows.length > 2) {
      // ✅ Keep minimum 2 rows
      setJournalRows((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Journal Data:', { formData, journalRows });
    // Save to localStorage or API
    sessionStorage.setItem('formSuccess', 'Journal saved');
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
            <h1 className="sales-order-title mb-4">Manual Journal</h1>
            <div className="row g-3 three-column-form">
              {/* COLUMN 1: Date, Journal */}
              <div className="col-lg-4">
                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">Date:</label>
                  <input
                    type="date"
                    name="date"
                    className="form-control so-control"
                    value={formData.date}
                    onChange={handleChange}
                  />
                </div>
                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">Journal:</label>
                  <input
                    type="text"
                    name="journal"
                    className="form-control so-control"
                    value={formData.journal}
                    onChange={handleChange}
                    placeholder="Enter journal name"
                  />
                </div>
              </div>

              {/* COLUMN 2: Reference, Notes */}
              <div className="col-lg-4">
                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">
                    Reference:
                  </label>
                  <input
                    type="text"
                    name="reference"
                    className="form-control so-control"
                    value={formData.reference}
                    onChange={handleChange}
                    placeholder="Enter reference"
                  />
                </div>
                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">Notes:</label>
                  <input
                    type="text"
                    name="notes"
                    className="form-control so-control"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Enter notes"
                  />
                </div>
              </div>

              {/* COLUMN 3: Currency, Journal Type */}
              <div className="col-lg-4">
                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">
                    Currency:
                  </label>
                  <select
                    name="currency"
                    className="form-select so-control p-6 pt-1 flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
                    value={formData.currency}
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      -- Select Currency --
                    </option>
                    {currencies.map((c, i) => (
                      <option key={i} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="so-form-group mb-4">
                  <label className="so-label text-sm text-muted-foreground fw-bold">
                    Journal Type:
                  </label>
                  <label className="form-check-label d-flex align-items-center" style={{ fontSize: 13 }}>
                    <input
                      type="checkbox"
                      className="form-check-input me-2"
                      checked={formData.isCashBased}
                      onChange={handleCheckboxChange}
                    />
                    Cash Based Journal
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Everything else stays OUTSIDE any card, with consistent margins */}
          <div className="mx-5">
            {/* Journal Entries - EXACT ItemTable structure */}
            <div className="item-card mb-4">
              <div className="item-card-header">
                <span className="item-card-title">Journal Entries</span>
              </div>
              <div className="item-card-body">
                <div className="row">
                  <div className="col-md-12">
                    <table className="table table-sm align-middle item-table-inner">
                      <thead>
                        <tr>
                          <th className="fw-medium text-dark">Account</th>
                          <th className="fw-medium text-dark">Description</th>
                          <th className="fw-medium text-dark">Contact</th>
                          <th className="fw-medium text-dark">Debit</th>
                          <th className="fw-medium text-dark">Credit</th>
                          <th className="fw-medium text-center text-dark">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {journalRows.map((row, index) => (
                          <tr key={index}>
                            <td>
                              <select
                                name="account"
                                className="form-select form-control-sm border-0"
                                style={{ fontSize: 12 }}
                                value={row.account}
                                onChange={(e) => handleRowChange(index, e as any)}
                              >
                                {accounts.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td>
                              <input
                                type="text"
                                name="description"
                                className="form-control form-control-sm border-0"
                                value={row.description}
                                onChange={(e) => handleRowChange(index, e)}
                              />
                            </td>
                            <td>
                              <select
                                name="contact"
                                className="form-select form-control-sm border-0"
                                style={{ fontSize: 12 }}
                                value={row.contact}
                                onChange={(e) => handleRowChange(index, e as any)}
                              >
                                {contacts.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td>
                              <input
                                type="text"
                                name="debit"
                                className="form-control form-control-sm border-0"
                                value={row.debit}
                                onChange={(e) => handleRowChange(index, e)}
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                name="credit"
                                className="form-control form-control-sm border-0"
                                value={row.credit}
                                onChange={(e) => handleRowChange(index, e)}
                              />
                            </td>
                            <td className="text-center">
                              <button
                                className="border-0 bg-body text-danger"
                                type="button"
                                onClick={() => removeJournalRow(index)}
                              >
                                <X size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <button
                      type="button"
                      className="btn btn-sm fw-bold item-add-row-btn mt-2"
                      onClick={addJournalRow}
                    >
                      <Plus size={16} className="me-1" /> Add New Row
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Documents + Summary */}
            <div className="row mt-4">
              <div className="col-md-6 mb-3">
                <div className="row mb-0">
                  <label className="so-label text-sm text-muted-foreground fw-bold">
                    Documents:
                  </label>
                  <div className="col-sm-11">
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
              </div>
              <div className="col-md-6 mb-3 d-flex justify-content-end">
                <div
                  className="total-box p-3 w-100"
                  style={{
                    minWidth: '260px',
                    minHeight: 35,
                    backgroundColor: '#F8F8F8',
                    borderRadius: '12px',
                    fontSize: 13
                  }}
                >
                  <div className="d-flex justify-content-between mb-2">
                    <span>Sub Total</span>
                    <span>{debitTotal.toFixed(2)}</span>
                    <span>{creditTotal.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <strong>Total (₹)</strong>
                    <strong>{debitTotal.toFixed(2)}</strong>
                    <strong>{creditTotal.toFixed(2)}</strong>
                  </div>
                  <div className="d-flex justify-content-between mt-2">
                    <span style={{ color: '#d9534f' }}>Difference</span>
                    <span style={{ color: '#d9534f' }}>{difference.toFixed(2)}</span>
                  </div>
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
                Save Journal
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
