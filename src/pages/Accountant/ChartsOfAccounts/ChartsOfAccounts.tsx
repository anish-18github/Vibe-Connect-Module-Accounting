import { useNavigate } from 'react-router-dom';
import Header from '../../../components/Header/Header';
import Navbar from '../../../components/Navbar/NavBar';
import { dashboardTabs } from '../../Dashboard/dashboard';
import { accountantTabs } from '../ManualJournal/ManualJournal';
import { useState, useEffect } from 'react';
import DynamicTable from '../../../components/Table/DynamicTable';
import { X } from 'react-feather';

const ChartsOfAccounts = () => {
  const navigate = useNavigate();

  // form state
  const [form, setForm] = useState({
    accountType: '',
    accountName: '',
    description: '',
    accountCode: '',
    watchlist: false,
  });

  // table columns for chart of accounts
  const columns = [
    { key: 'accountType', label: 'Account Type' },
    { key: 'accountName', label: 'Account Name' },
    { key: 'accountCode', label: 'Account Code' },
    { key: 'description', label: 'Description' },
  ];

  const [chartOfAccounts, setChartOfAccount] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('Chart-Of-Account') || '[]');
    setChartOfAccount(stored);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleContinue = () => {
    const updated = [...chartOfAccounts, { ...form }];
    setChartOfAccount(updated);
    localStorage.setItem('Chart-Of-Account', JSON.stringify(updated));
    setShowModal(false);
    setForm({
      accountType: '',
      accountName: '',
      description: '',
      accountCode: '',
      watchlist: false,
    });
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <>
      <Header />

      <div style={{ padding: '56px 0px 0px' }}>
        <Navbar tabs={dashboardTabs} />
        <Navbar tabs={accountantTabs} />

        <div className="mt-3">
          <DynamicTable
            columns={columns}
            data={chartOfAccounts}
            actions={true}
            rowsPerPage={10}
            onAdd={() => setShowModal(true)}
            onView={(row) => navigate(`/sales/view-customer/${row.customerId}`)}
          />
        </div>
      </div>

      {showModal && (
        <div className="modal-backdrop-custom">
          <div className="modal-dialog-custom p-4">
            <div className="modal-header-custom">
              <h5 className="modal-title mb-0">Create Account</h5>
              <button
                type="button"
                className="close-btn border-0 text-danger"
                onClick={handleCancel}
              >
                <X />
              </button>
            </div>

            <div className="modal-body-custom">
              {/* Row 1: Account Type + Account Name */}
              <div className="row g-3 align-items-center mb-2">
                <div className="col-12 col-md-6">
                  <div className="form-inline-group">
                    <label className="so-label text-sm text-muted-foreground fw-bold">
                      Account Type
                    </label>
                    <select
                      name="accountType"
                      className="form-select so-control p-6 pt-1 flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
                      value={form.accountType}
                      onChange={handleChange}
                    >
                      <option value="" disabled>
                        Select account type
                      </option>
                      <option value="Bank">Bank</option>
                      <option value="Cash">Cash</option>
                      <option value="Fixed Asset">Fixed Asset</option>
                      <option value="Accounts Receivable">Accounts Receivable</option>
                    </select>
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <div className="form-inline-group">
                    <label className="so-label text-sm text-muted-foreground fw-bold">
                      Account Name
                    </label>
                    <input
                      type="text"
                      name="accountName"
                      className="form-control so-control border"
                      value={form.accountName}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Account Code + Description in one column (stacked) */}
              <div className="row g-3">
                <div className="col-12">
                  {/* Account Code */}
                  <div className="form-inline-group mb-2">
                    <label className="so-label text-sm text-muted-foreground fw-bold">
                      Account Code
                    </label>
                    <input
                      type="text"
                      name="accountCode"
                      className="form-control so-control border"
                      value={form.accountCode}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Description */}
                  <div className="form-inline-group align-items-start mb-2">
                    <label className="so-label text-sm text-muted-foreground fw-bold">
                      Description
                    </label>
                    <textarea
                      name="description"
                      className="form-control so-control subject-textarea border"
                      value={form.description}
                      onChange={handleChange}
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Bottom: Checkbox alone */}
              <div className="mt-2">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="watchlistCheckbox"
                    name="watchlist"
                    checked={form.watchlist}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="watchlistCheckbox">
                    Add to the watchlist on my dashboard
                  </label>
                </div>
              </div>
            </div>

            <div className="modal-footer-custom">
              <button type="button" className="btn btn-primary px-4" onClick={handleContinue}>
                Continue
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary px-4"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChartsOfAccounts;
