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

            <div style={{ padding: "69px 1.8rem 0 1.8rem" }}>

                <h1 className="h4 text-dark mb-4 pb-1">Create Recurring Expense</h1>

                <form onSubmit={handleSubmit} className="mt-4" style={{ color: "#5E5E5E" }}>
                    <div className="row">
                        {/* COLUMN 1: Profile / Repeat / Dates (Start+End together) */}
                        <div className="col-lg-4">
                            {/* Profile Name */}
                            <div className="row mb-3 align-items-center">
                                <label className="col-sm-4 col-form-label fw-normal">
                                    Profile Name<span className="text-danger">*</span>
                                </label>
                                <div className="col-sm-8">
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
                                <label className="col-sm-4 col-form-label fw-normal">
                                    Repeat Every<span className="text-danger">*</span>
                                </label>
                                <div className="col-sm-8">
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

                            {/* Start / End Dates (together as one field block) */}
                            <div className="row mb-3 align-items-center">
                                <label className="col-sm-4 col-form-label fw-normal">Start / End</label>
                                <div className="col-sm-8">
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <input
                                                type="date"
                                                name="startDate"
                                                className="form-control form-control-sm border mb-1"
                                                value={formData.startDate}
                                                onChange={handleChange}
                                            />
                                            <small className="text-muted d-block" style={{ fontSize: "11px" }}>
                                                Starts on {formData.startDate || "--/--/----"}
                                            </small>
                                        </div>
                                        <div className="col-sm-6">
                                            <input
                                                type="date"
                                                name="endsOn"
                                                className="form-control form-control-sm border"
                                                disabled={formData.neverExpires}
                                                value={formData.endsOn}
                                                onChange={handleChange}
                                            />
                                            <div className="form-check mt-1">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input me-1"
                                                    name="neverExpires"
                                                    checked={formData.neverExpires}
                                                    onChange={handleChange}
                                                />
                                                <label className="form-check-label" style={{ fontSize: "11px" }}>
                                                    Never
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* COLUMN 2: Expense / Vendor / Amount */}
                        <div className="col-lg-4">
                            {/* Expense Account */}
                            <div className="row mb-3 align-items-center">
                                <label className="col-sm-5 col-form-label fw-normal">
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

                            {/* Vendor */}
                            <div className="row mb-3 align-items-center">
                                <label className="col-sm-5 col-form-label fw-normal">Vendor</label>
                                <div className="col-sm-6">
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

                            {/* Amount + Currency */}
                            <div className="row mb-3 align-items-center">
                                <label className="col-sm-4 col-form-label fw-normal">
                                    Amount<span className="text-danger">*</span>
                                </label>
                                <div className="col-sm-8">
                                    <div className="row">
                                        <div className="col-sm-4">
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
                                        <div className="col-sm-7">
                                            <input
                                                type="number"
                                                name="amount"
                                                className="form-control form-control-sm border"
                                                value={formData.amount}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* COLUMN 3: Paid Through / Customer / Notes */}
                        <div className="col-lg-4">
                            {/* Paid Through */}
                            <div className="row mb-3 align-items-center">
                                <label className="col-sm-4 col-form-label fw-normal">
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

                            {/* Customer Name */}
                            <div className="row mb-3 align-items-center">
                                <label className="col-sm-4 col-form-label fw-normal">Customer</label>
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

                            {/* Notes */}
                            <div className="row mb-3 align-items-start">
                                <label className="col-sm-4 col-form-label fw-normal">Notes</label>
                                <div className="col-sm-8">
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
                        </div>
                    </div>


                    {/* Buttons (unchanged) */}
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
