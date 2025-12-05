import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header/Header";
import Navbar from "../../../components/Navbar/NavBar";
import DynamicTable from "../../../components/Table/DynamicTable";
import { dashboardTabs } from "../../Dashboard/dashboard";
import { accountantTabs } from "../ManualJournal/ManualJournal";
import { useEffect, useState } from "react";
import { X } from "react-feather";
import './bulkUpdate.css'

const BulkUpdate = () => {
    const navigate = useNavigate();

    // form state: from/to ranges are split
    const [form, setForm] = useState({
        account: "",
        contact: "",
        dateFrom: "",
        dateTo: "",
        amountFrom: "",
        amountTo: "",
    });

    const columns = [
        { key: "date", label: "Date" },
        { key: "journalNumber", label: "Journal Number" },
        { key: "referenceNo", label: "Reference No" },
        { key: "amount", label: "Amount" },
        { key: "status", label: "Status" },
    ];

    const [bulkUpdate, setBulkUpdate] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("bulk-update") || "[]");
        setBulkUpdate(stored);
    }, []);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleContinue = () => {
        // here you probably want to filter existing transactions,
        // but for now we just persist the last used filter values:
        const updated = [...bulkUpdate, { ...form }];
        setBulkUpdate(updated);
        localStorage.setItem("bulk-update", JSON.stringify(updated)); // fixed key
        setShowModal(false);
        setForm({
            account: "",
            contact: "",
            dateFrom: "",
            dateTo: "",
            amountFrom: "",
            amountTo: "",
        });
    };

    const handleCancel = () => {
        setShowModal(false);
    };

    return (
        <>
            <Header />
            <Navbar tabs={dashboardTabs} />
            <Navbar tabs={accountantTabs} />

            <div className="mt-3">
                <DynamicTable
                    columns={columns}
                    data={bulkUpdate}
                    actions={false}
                    rowsPerPage={10}
                    onAdd={() => setShowModal(true)}
                    onView={(row) => navigate(`/sales/view-customer/${row.customerId}`)}
                />
            </div>

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

                                    <div className="mb-2">
                                        <span className="bulkupdate-helper-text">
                                            Select an account and enter your ranges to filter your transaction
                                        </span>
                                    </div>

                                    <div className="d-flex align-items-center mb-2">
                                        <label className="form-label-inline me-2 mb-0">Account*</label>
                                        <select
                                            name="account"
                                            className="form-select"
                                            value={form.account}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select account</option>
                                            <option value="Bank">Bank</option>
                                            <option value="Cash">Cash</option>
                                            <option value="Fixed Asset">Fixed Asset</option>
                                            <option value="Accounts Receivable">Accounts Receivable</option>
                                        </select>
                                    </div>

                                    <div className="d-flex align-items-center mb-2">
                                        <label className="form-label-inline me-2 mb-0">Contact:</label>
                                        <select
                                            name="contact"
                                            className="form-select"
                                            value={form.contact}
                                            onChange={handleChange}
                                        >

                                            <option value="">Select contact</option>
                                            <option value="ContactA">Contact A</option>
                                            <option value="ContactB">Contact B</option>
                                            <option value="ContactC">COntact C</option>
                                            <option value="ContactD">Contact D</option>
                                        </select>
                                    </div>

                                    <div className="d-flex align-items-center mb-2">
                                        <label className="form-label-inline me-2 mb-0">Date Range:</label>
                                        <input
                                            type="date"
                                            name="dateFrom"
                                            className="form-control border me-1"
                                            value={form.dateFrom}
                                            onChange={handleChange}
                                        />
                                        <span className="mx-1">–</span>
                                        <input
                                            type="date"
                                            name="dateTo"
                                            className="form-control border ms-1"
                                            value={form.dateTo}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="d-flex align-items-center mb-2">
                                        <label className="form-label-inline me-2 mb-0">
                                            Total Amount Range:
                                        </label>
                                        <input
                                            type="number"
                                            name="amountFrom"
                                            className="form-control border me-1"
                                            value={form.amountFrom}
                                            onChange={handleChange}
                                        />
                                        <span className="mx-1">–</span>
                                        <input
                                            type="number"
                                            name="amountTo"
                                            className="form-control border ms-1"
                                            value={form.amountTo}
                                            onChange={handleChange}
                                        />
                                    </div>

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

export default BulkUpdate;
