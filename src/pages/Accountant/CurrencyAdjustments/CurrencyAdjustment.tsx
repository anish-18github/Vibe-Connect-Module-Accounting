import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header/Header";
import { useState, useEffect } from "react";
import Navbar from "../../../components/Navbar/NavBar";
import DynamicTable from "../../../components/Table/DynamicTable";
import { dashboardTabs } from "../../Dashboard/dashboard";
import { accountantTabs } from "../ManualJournal/ManualJournal";

import './currencyAdjustments.css'
import { X } from "react-feather";

const CurrencyAdjustments = () => {
    const navigate = useNavigate();

    const columns = [
        { key: "currency", label: "Currency" },
        { key: "exchangeRate", label: "Exchange Rate" },
        { key: "gainOrLoss", label: "Gain or Loss" },
        { key: "notes", label: "Notes" },
    ];

    const [currencyAdjustments, setCurrencyAdjustments] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const todayISO = new Date().toISOString().slice(0, 10);

    // form state for popup
    const [form, setForm] = useState({
        currency: "",
        dateOfAdjustment: todayISO,
        notes: "",
        exchangeRate: "",
    });

    useEffect(() => {
        const stored = JSON.parse(
            localStorage.getItem("Currency-Adjustments") || "[]"
        );
        setCurrencyAdjustments(stored);
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleContinue = () => {
        const updated = [...currencyAdjustments, form];
        setCurrencyAdjustments(updated);
        localStorage.setItem("Currency-Adjustments", JSON.stringify(updated));
        setShowModal(false);
        setForm({
            currency: "",
            dateOfAdjustment: todayISO,
            notes: "",
            exchangeRate: "",
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
                        data={currencyAdjustments}
                        actions={true}
                        rowsPerPage={10}
                        onAdd={() => setShowModal(true)}  // open popup instead of navigate
                        onView={(row) => navigate(`/sales/view-customer/${row.customerId}`)}
                    />
                </div>
            </div>

            {showModal && (
                <div className="modal-backdrop-custom">
                    <div className="modal-dialog-custom p-4">
                        <div className="modal-header-custom">
                            <h5 className="modal-title">Base Currency Adjustment</h5>
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
                                <div className="col-6">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">Currency:</label>
                                    <select
                                        name="currency"
                                        className=" form-select so-control p-6 pt-1 flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
                                        value={form.currency}
                                        onChange={handleChange}
                                    >
                                        <option value="" disabled>Select currency</option>
                                        <option value="USD">USD</option>
                                        <option value="EUR">EUR</option>
                                        {/* add more */}
                                    </select>
                                </div>
                                <div className="col-6">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">Date of Adjustment:</label>
                                    <input
                                        type="date"
                                        name="dateOfAdjustment"
                                        className="form-control so-control border"
                                        value={form.dateOfAdjustment}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="row mt-3">
                                <div className="col-6">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">Notes:</label>
                                    <input
                                        type="text"
                                        name="notes"
                                        className="form-control so-control border"
                                        value={form.notes}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col-6">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">Exchange Rate:</label>
                                    <input
                                        type="number"
                                        step="0.0001"
                                        name="exchangeRate"
                                        className="form-control so-control border"
                                        value={form.exchangeRate}
                                        onChange={handleChange}
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

export default CurrencyAdjustments;
