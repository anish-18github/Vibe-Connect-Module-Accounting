import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/NavBar";
import DynamicTable from "../../components/Table/DynamicTable";
import { dashboardTabs } from "../Dashboard/dashboard";
import { X } from "react-feather";

const columns = [
    { key: ' reportName', label: ' Report Name' },
    { key: 'type', label: 'Type' },
    { key: 'createdBy', label: 'Created By' },
    { key: 'lastVisited', label: 'Last Visited' },
];

const Reporting = () => {
    const navigate = useNavigate();
    const [masterSetup, setMasterSetup] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [accountType, setAccountType] = useState('');
    const [error, setError] = useState('');


    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('masterSetup') || '[]');
        setMasterSetup(stored);
    }, []);

    const handleCancel = () => {
        setShowModal(false);
        setAccountType('');
        setError('');
    };

    const handleProceed = (e: React.FormEvent) => {
        e.preventDefault();

        if (!accountType) {
            setError('Please select an account type.');
            return;
        }

        // clear error
        setError('');

        // redirect based on selected account type
        // adjust routes as needed
        if (accountType === 'Profit and Loss') {
            navigate('/reporting/create-custom-report/profitloss', {
                state: { reportType: accountType }
            });
        } else if (accountType === 'Expense Report') {
            navigate('/reporting/custom/expense');
        } else if (accountType === 'Balance Sheet') {
            navigate('/reporting/custom/balance-sheet');
        } else if (accountType === 'Profit & Loss') {
            navigate('/reporting/custom/profit-loss');
        }

        setShowModal(false);
    };


    return (
        <>
            <Header />

            <div style={{ padding: '56px 0px 0px' }}>
                <Navbar tabs={dashboardTabs} />

                <div className="mt-3">
                    <DynamicTable
                        columns={columns}
                        data={masterSetup}
                        actions={false}
                        rowsPerPage={10}
                        onAdd={() => setShowModal(true)}
                        onView={(row) => navigate(`/accountant/view-journal/${row.customerId}`)}
                    />

                </div>
            </div>

            {showModal && (
                <div className="modal-backdrop-custom">
                    <div className="modal-dialog-custom p-4">
                        <div className="modal-header-custom">
                            <h5 className="modal-title mb-0">New Custom Report</h5>
                            <button
                                type="button"
                                className="close-btn border-0 text-danger"
                                onClick={handleCancel}
                            >
                                <X />
                            </button>
                        </div>

                        <form onSubmit={handleProceed}>
                            <div className="modal-body-custom">
                                <p className="text-muted small mb-3">
                                    Select the report that you want to customize and create a new custom report.
                                </p>

                                <div className="row g-3 align-items-center mb-2">
                                    <div className="col-12 col-md-6">
                                        <div className="so-form-group form-inline-group">
                                            <label className="so-label text-sm text-muted-foreground fw-bold">
                                                Account Type
                                            </label>
                                            <select
                                                name="accountType"
                                                className="form-select so-control"
                                                style={{ fontSize: 12 }}
                                                value={accountType}
                                                onChange={(e) => setAccountType(e.target.value)}
                                            >
                                                <option value="" disabled>Select account type</option>

                                                <optgroup label="Business Overview">
                                                    <option value="Profit and Loss">Profit and Loss</option>
                                                    <option value="Cash Flow Statement">Cash Flow Statement</option>
                                                    <option value="Balance Sheet">Balance Sheet</option>
                                                    <option value="Movement of Equity">Movement of Equity</option>
                                                </optgroup>

                                                <optgroup label="Sales">
                                                    <option value="Sales by Customer">Sales by Customer</option>
                                                    <option value="Sales by Item">Sales by Item</option>
                                                    <option value="Sales by Sales Person">Sales by Sales Person</option>
                                                    <option value="Sales Summary">Sales Summary</option>
                                                </optgroup>
                                            </select>

                                            {error && (
                                                <span className="text-danger small mt-1 d-block">{error}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                            </div>

                            {/* Footer */}
                            <div className="modal-footer-custom">
                                <button
                                    type="submit"
                                    className="btn px-4"
                                    style={{ background: '#7991BB', color: '#FFF' }}
                                >
                                    Proceed
                                </button>
                                <button
                                    type="button"
                                    className="btn border me-3 px-4"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}


        </>
    );
}

export default Reporting;