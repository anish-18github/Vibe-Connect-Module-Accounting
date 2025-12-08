import React, { useState } from "react";
import Header from "../../../../components/Header/Header";

const AddRecurringExpense: React.FC = () => {
    const [formData, setFormData] = useState({
        profileName: "",
        repeatEvery: "",
        startDate: "",
        endsOn: "",
        neverExpires: false,
        expenseAccount: "",
        currency: "INR",
        amount: "",
        paidThrough: "",
        vendor: "",
        notes: "",
        customerName: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const target = e.target as HTMLInputElement;
        const { name, type, value, checked } = target;

        const finalValue =
            type === "checkbox" || type === "radio"
                ? checked
                    ? value
                    : ""
                : value;

        setFormData((prev) => {
            const keys = name.split(".");    // "customer.firstName"
            const lastKey = keys.pop()!;
            let temp: any = prev;

            keys.forEach((key) => {
                temp = temp[key];
            });

            temp[lastKey] = finalValue;
            return { ...prev };
        });
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(formData);
    };

    return (

        
        <>

            <Header />

            <div style={{ padding: "0 1.8rem" }}>
                <h1 className="h4 text-dark mb-4 pb-1">Create Recurring Expense</h1>

                <form onSubmit={handleSubmit} className="mt-4" style={{ color: "#5E5E5E" }}>

                    {/* Profile Name */}
                    <div className="row mb-3 align-items-center">
                        <label className="col-sm-2 col-form-label fw-normal">
                            Profile Name<span className="text-danger">*</span>
                        </label>
                        <div className="col-sm-6">
                            <input
                                type="text"
                                name="profileName"
                                className="form-control form-control-sm border"
                                value={formData.profileName}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Repeat Every */}
                    <div className="row mb-3 align-items-center">
                        <label className="col-sm-2 col-form-label fw-normal">
                            Repeat Every<span className="text-danger">*</span>
                        </label>
                        <div className="col-sm-6">
                            <select
                                name="repeatEvery"
                                className="form-select form-select-sm"
                                value={formData.repeatEvery}
                                onChange={handleChange}
                            >
                                <option value="" disabled hidden>Select frequency</option>
                                <option value="Week">Every Week</option>
                                <option value="Month">Every Month</option>
                                <option value="Year">Every Year</option>
                            </select>
                        </div>
                    </div>

                    {/* Start Date */}
                    <div className="row mb-1 align-items-center">
                        <label className="col-sm-2 col-form-label fw-normal">Start Date</label>
                        <div className="col-sm-2">
                            <input
                                type="date"
                                name="startDate"
                                className="form-control form-control-sm border"
                                value={formData.startDate}
                                onChange={handleChange}
                            />
                            <small className="text-muted">
                                The recurring expense will be created on {formData.startDate || "--/--/----"}
                            </small>
                        </div>
                    </div>

                    {/* Ends On + Never Expires */}
                    <div className="row mb-3 align-items-center">
                        <label className="col-sm-2 col-form-label fw-normal">Ends On</label>
                        <div className="col-sm-2">
                            <input
                                type="date"
                                name="endsOn"
                                className="form-control form-control-sm border"
                                disabled={formData.neverExpires}
                                value={formData.endsOn}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-sm-3 d-flex align-items-center">
                            <input
                                type="checkbox"
                                className="form-check-input me-2"
                                name="neverExpires"
                                checked={formData.neverExpires}
                                onChange={handleChange}
                            />
                            <label className="form-check-label">Never Expires</label>
                        </div>
                    </div>

                    {/* Expense Account */}
                    <div className="row mb-3 align-items-center">
                        <label className="col-sm-2 col-form-label fw-normal">
                            Expense Account<span className="text-danger">*</span>
                        </label>
                        <div className="col-sm-6">
                            <select
                                name="expenseAccount"
                                className="form-select form-select-sm"
                                value={formData.expenseAccount}
                                onChange={handleChange}
                            >
                                <option value="" disabled hidden>Select an account</option>
                                <option value="Travel">Travel Expenses</option>
                                <option value="Office">Office Expense</option>
                                <option value="Supplies">Supplies</option>
                            </select>
                        </div>
                    </div>

                    {/* Amount + Currency */}
                    <div className="row mb-3 align-items-center">
                        <label className="col-sm-2 col-form-label fw-normal">
                            Amount<span className="text-danger">*</span>
                        </label>

                        <div className="col-sm-1">
                            <select
                                name="currency"
                                className="form-select form-select-sm"
                                value={formData.currency}
                                onChange={handleChange}
                            >
                                <option value="INR">INR</option>
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                            </select>
                        </div>

                        <div className="col-sm-5">
                            <input
                                type="number"
                                name="amount"
                                className="form-control form-control-sm border"
                                value={formData.amount}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Paid Through */}
                    <div className="row mb-3 align-items-center">
                        <label className="col-sm-2 col-form-label fw-normal">
                            Paid Through<span className="text-danger">*</span>
                        </label>
                        <div className="col-sm-6">
                            <select
                                name="paidThrough"
                                className="form-select form-select-sm"
                                value={formData.paidThrough}
                                onChange={handleChange}
                            >
                                <option value="" disabled hidden>Select an account</option>
                                <option value="Cash">Cash</option>
                                <option value="Bank">Bank Account</option>
                                <option value="Wallet">Wallet</option>
                            </select>
                        </div>
                    </div>

                    {/* Vendor */}
                    <div className="row mb-3 align-items-center">
                        <label className="col-sm-2 col-form-label fw-normal">Vendor</label>
                        <div className="col-sm-5">
                            <select
                                name="vendor"
                                className="form-select form-select-sm"
                                value={formData.vendor}
                                onChange={handleChange}
                            >
                                <option value="" disabled hidden>Select Vendor</option>
                                <option value="Vendor A">Vendor A</option>
                                <option value="Vendor B">Vendor B</option>
                            </select>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="row mb-3 align-items-center">
                        <label className="col-sm-2 col-form-label fw-normal">Notes</label>
                        <div className="col-sm-6">
                            <textarea
                                name="notes"
                                className="form-control form-control-sm border"
                                maxLength={500}
                                placeholder="Max. 500 characters"
                                value={formData.notes}
                                onChange={handleChange}
                                rows={3}
                            />
                        </div>
                    </div>

                    {/* Customer Name */}
                    <div className="row mb-3 align-items-center">
                        <label className="col-sm-2 col-form-label fw-normal">Customer Name</label>
                        <div className="col-sm-6">
                            <select
                                name="customerName"
                                className="form-select form-select-sm"
                                value={formData.customerName}
                                onChange={handleChange}
                            >
                                <option value="" disabled hidden>Select Customer</option>
                                <option value="Customer A">Customer A</option>
                                <option value="Customer B">Customer B</option>
                            </select>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="d-flex justify-content-center mt-4 pt-4 border-top">
                        <button type="button" className="btn border me-3 px-4">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn px-4"
                            style={{ background: "#7991BB", color: "#FFFFFF" }}
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </>


    );
};

export default AddRecurringExpense;
