import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header/Header";
import Navbar from "../../../components/Navbar/NavBar";
import { dashboardTabs } from "../../Dashboard/dashboard";
import { accountantTabs } from "../ManualJournal/ManualJournal";
import { useState, useEffect } from "react";
import DynamicTable from "../../../components/Table/DynamicTable";
import { X } from "react-feather";

const ChartsOfAccounts = () => {
    const navigate = useNavigate();

    // form state
    const [form, setForm] = useState({
        accountType: "",
        accountName: "",
        description: "",
        accountCode: "",
        watchlist: false,
    });

    // table columns for chart of accounts
    const columns = [
        { key: "accountType", label: "Account Type" },
        { key: "accountName", label: "Account Name" },
        { key: "accountCode", label: "Account Code" },
        { key: "description", label: "Description" },
    ];

    const [chartOfAccounts, setChartOfAccount] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("Chart-Of-Account") || "[]");
        setChartOfAccount(stored);
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleContinue = () => {
        const updated = [...chartOfAccounts, { ...form }];
        setChartOfAccount(updated);
        localStorage.setItem("Chart-Of-Account", JSON.stringify(updated));
        setShowModal(false);
        setForm({
            accountType: "",
            accountName: "",
            description: "",
            accountCode: "",
            watchlist: false,
        });
    };

    const handleCancel = () => {
        setShowModal(false);
    };

    return (
        <>
            <Header />

            <div style={{ padding: "56px 0px 0px" }}>



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
                    <div className="modal-dialog-custom">
                        <div className="modal-header-custom">
                            <h5 className="modal-title">Create Account</h5>
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
                                <div className="col-6 d-flex align-items-center mb-2">
                                    <label className="form-label-inline me-2 mb-0">Account Type:</label>
                                    <select
                                        name="accountType"
                                        className="form-select"
                                        value={form.accountType}
                                        onChange={handleChange}
                                    >
                                        <option value="" disabled>Select account type</option>
                                        <option value="Bank">Bank</option>
                                        <option value="Cash">Cash</option>
                                        <option value="Fixed Asset">Fixed Asset</option>
                                        <option value="Accounts Receivable">Accounts Receivable</option>
                                    </select>
                                </div>

                                <div className="col-6 d-flex align-items-center mb-2">
                                    <label className="form-label-inline me-2 mb-0">Account Name:</label>
                                    <input
                                        type="text"
                                        name="accountName"
                                        className="form-control border"
                                        value={form.accountName}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="row mt-3">
                                <div className="col-6">
                                    <div className="d-flex align-items-center mb-2">
                                        <label className="form-label-inline me-2 mb-0">Account Code:</label>
                                        <input
                                            type="text"
                                            name="accountCode"
                                            className="form-control border"
                                            value={form.accountCode}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="form-check mt-1">
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

                                <div className="col-6 d-flex align-items-start mb-2">
                                    <label className="form-label-inline me-2 mb-0">Description:</label>
                                    <textarea
                                        name="description"
                                        className="form-control border"
                                        value={form.description}
                                        onChange={handleChange}
                                        rows={3}
                                    />
                                </div>
                            </div>

                        </div>

                        <div className="modal-footer-custom">
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleContinue}
                            >
                                Continue
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
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
