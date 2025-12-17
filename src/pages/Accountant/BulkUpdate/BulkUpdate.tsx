import { useNavigate } from 'react-router-dom';
import Header from '../../../components/Header/Header';
import Navbar from '../../../components/Navbar/NavBar';
import DynamicTable from '../../../components/Table/DynamicTable';
import { dashboardTabs } from '../../Dashboard/dashboard';
import { accountantTabs } from '../ManualJournal/ManualJournal';
import { useEffect, useState, useCallback } from 'react';
import { X } from 'react-feather';
import './bulkUpdate.css';

// ✅ TYPE DEFINITIONS
interface FormDataType {
  account: string;
  contact: string;
  dateFrom: string;
  dateTo: string;
  amountFrom: string;
  amountTo: string;
}

interface TableRow {
  date?: string;
  journalNumber?: string;
  referenceNo?: string;
  amount?: number;
  status?: string;
  [key: string]: any;
}

const BulkUpdate = () => {
  const navigate = useNavigate();

  // ✅ STATE
  const [form, setForm] = useState<FormDataType>({
    account: '',
    contact: '',
    dateFrom: '',
    dateTo: '',
    amountFrom: '',
    amountTo: '',
  });

  // This holds ONLY filtered transactions, not the filter itself
  const [bulkUpdate, setBulkUpdate] = useState<TableRow[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [allSelected, setAllSelected] = useState<boolean>(false);
  const [hasFiltered, setHasFiltered] = useState<boolean>(false);

  const columns = [
    { key: 'select', label: '' },
    { key: 'date', label: 'Date' },
    { key: 'journalNumber', label: 'Journal Number' },
    { key: 'referenceNo', label: 'Reference No' },
    { key: 'amount', label: 'Amount' },
    { key: 'status', label: 'Status' },
  ];

  // Restore last filtered result if you want
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('bulk-update') || '[]') as TableRow[];
    setBulkUpdate(stored);
  }, []);

  // ✅ HANDLERS
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRowSelect = useCallback((rowKey: string, checked: boolean) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(rowKey);
      } else {
        next.delete(rowKey);
      }
      return next;
    });
  }, []);

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      setAllSelected(checked);
      if (checked) {
        const allKeys = new Set(bulkUpdate.map((_, index) => `row-${index}`));
        setSelectedRows(allKeys);
      } else {
        setSelectedRows(new Set());
      }
    },
    [bulkUpdate.length],
  );

  const handleContinue = () => {
    // 👉 IMPORTANT: DO NOT PUSH `form` INTO `bulkUpdate`
    // Here you should filter your full transaction list.
    // Example with TODO:

    // const filtered = allTransactions.filter((tx) => {
    //   // apply account/contact/date/amount filters based on `form`
    //   return true or false;
    // });

    const filtered: TableRow[] = [];

    setBulkUpdate(filtered);
    localStorage.setItem('bulk-update', JSON.stringify(filtered));
    setSelectedRows(new Set());
    setAllSelected(false);
    setHasFiltered(true);
    setShowModal(false);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  // ✅ TABLE DATA WITH CHECKBOX COLUMN
  const tableData = bulkUpdate.map((row, index) => ({
    ...row,
    select: (
      <div className="form-check" key={`select-${index}`}>
        <input
          className="form-check-input"
          type="checkbox"
          id={`row-${index}`}
          checked={selectedRows.has(`row-${index}`)}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleRowSelect(`row-${index}`, e.target.checked)
          }
        />
      </div>
    ),
    originalIndex: index,
  }));

  const getSelectedData = (): TableRow[] => {
    return bulkUpdate.filter((_, index) => selectedRows.has(`row-${index}`));
  };

  return (
    <>
      <Header />

      <div style={{ padding: '56px 0px 0px' }}>
        <Navbar tabs={dashboardTabs} />
        <Navbar tabs={accountantTabs} />

        <div className="container-fluid mt-3">
          {/* Filter summary block (top green area like screenshot) */}
          {hasFiltered && (
            <div className="p-3 mb-3" style={{ backgroundColor: '#f4fff4', borderRadius: 4 }}>
              <div className="small text-muted mb-1">Filtered based on</div>
              <ul className="mb-1 small">
                <li>
                  Account Name: <strong>{form.account || '—'}</strong>
                </li>
                <li>
                  Contact: <strong>{form.contact || '—'}</strong>
                </li>
                <li>
                  Start Date: <strong>{form.dateFrom || '—'}</strong>
                </li>
                <li>
                  End Date: <strong>{form.dateTo || '—'}</strong>
                </li>
                <li>
                  Total Amount Range:{' '}
                  <strong>
                    {form.amountFrom || '0'} - {form.amountTo || '0'}
                  </strong>
                </li>
              </ul>
              <button
                type="button"
                className="btn btn-link p-0 small"
                onClick={() => setShowModal(true)}
              >
                Change Filter Criteria »
              </button>
            </div>
          )}

          {/* Selection summary only when rows exist & selected */}
          {bulkUpdate.length > 0 && selectedRows.size > 0 && (
            <div className="alert alert-info d-flex justify-content-between align-items-center mb-3">
              <div>
                <strong>
                  {selectedRows.size} row
                  {selectedRows.size > 1 ? 's' : ''} selected
                </strong>
                <small className="text-muted ms-2">({bulkUpdate.length} total)</small>
              </div>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  console.log('Bulk updating:', getSelectedData());
                  alert(`Bulk updating ${selectedRows.size} rows!`);
                }}
              >
                Bulk Update ({selectedRows.size})
              </button>
            </div>
          )}

          {/* Select-all only when there is data */}
          {bulkUpdate.length > 0 && (
            <div className="mb-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="select-all"
                  checked={allSelected}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleSelectAll(e.target.checked)
                  }
                />
                <label className="form-check-label" htmlFor="select-all">
                  Select all {bulkUpdate.length} transactions
                </label>
              </div>
            </div>
          )}

          {/* When no filtered transactions, show message instead of rows */}
          {hasFiltered && bulkUpdate.length === 0 ? (
            <div className="text-center text-muted mt-4">
              No transactions (Invoices, Credit Notes, Purchase Orders, Expenses, Bills, Vendor
              Credits) available. Please change the filter criteria and try again.
            </div>
          ) : (
            <DynamicTable
              columns={columns}
              data={tableData}
              actions={false}
              rowsPerPage={10}
              onAdd={() => setShowModal(true)}
              onView={(row: any) => navigate(`/sales/view-customer/${row.customerId}`)}
            />
          )}
        </div>
      </div>

      {/* Filter modal */}
      {showModal && (
        <div className="modal-backdrop-custom">
          <div className="modal-dialog-custom bulk-modal">
            <div className="modal-header-custom">
              <h5 className="modal-title">Filter Transactions</h5>
              <button
                type="button"
                className="close-btn border-0 text-danger"
                onClick={handleCancel}
              >
                <X />
              </button>
            </div>

            <div className="modal-body-custom">
              <div className="row">
                <div className="col-12">
                  <div className="mb-3">
                    <small className="text-muted">
                      Select account and ranges to filter transactions
                    </small>
                  </div>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="so-label text-sm text-muted-foreground fw-bold">
                        Account <span className="text-danger">*</span>
                      </label>
                      <select
                        name="account"
                        className="form-control so-control border"
                        value={form.account}
                        style={{ fontSize: 12 }}
                        onChange={handleChange}
                      >
                        <option value="">Select account</option>
                        <option value="Bank">Bank</option>
                        <option value="Cash">Cash</option>
                        <option value="Fixed Asset">Fixed Asset</option>
                        <option value="Accounts Receivable">Accounts Receivable</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="so-label text-sm text-muted-foreground fw-bold">
                        Contact
                      </label>
                      <select
                        name="contact"
                        className="form-control so-control border"
                        style={{ fontSize: 12 }}
                        value={form.contact}
                        onChange={handleChange}
                      >
                        <option value="">Select contact</option>
                        <option value="ContactA">Contact A</option>
                        <option value="ContactB">Contact B</option>
                        <option value="ContactC">Contact C</option>
                        <option value="ContactD">Contact D</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label className="so-label text-sm text-muted-foreground fw-bold">
                        Date Range
                      </label>
                      <div className="d-flex gap-2">
                        <input
                          type="date"
                          name="dateFrom"
                          className="form-control so-control border"
                          style={{ fontSize: 12 }}
                          value={form.dateFrom}
                          onChange={handleChange}
                        />
                        <span className="align-self-center">–</span>
                        <input
                          type="date"
                          name="dateTo"
                          className="form-control so-control border"
                          style={{ fontSize: 12 }}
                          value={form.dateTo}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="col-12">
                      <label className="so-label text-sm text-muted-foreground fw-bold">
                        Amount Range
                      </label>
                      <div className="d-flex gap-2">
                        <input
                          type="number"
                          name="amountFrom"
                          className="form-control so-control border"
                          style={{ fontSize: 12 }}
                          placeholder="From"
                          value={form.amountFrom}
                          onChange={handleChange}
                        />
                        <span className="align-self-center">–</span>
                        <input
                          type="number"
                          name="amountTo"
                          className="form-control so-control border"
                          style={{ fontSize: 12 }}
                          placeholder="To"
                          value={form.amountTo}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer-custom">
              <button type="button" className="btn border me-3 px-4" onClick={handleCancel}>
                Cancel
              </button>
              <button type="button" className="btn px-4" style={{ background: '#7991BB', color: '#FFF' }}
                onClick={handleContinue}>
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BulkUpdate;
