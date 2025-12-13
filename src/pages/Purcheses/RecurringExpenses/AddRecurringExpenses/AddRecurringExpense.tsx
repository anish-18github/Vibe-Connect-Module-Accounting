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
            <div className="sales-orders-page">
                <form onSubmit={handleSubmit} className="sales-order-form">
                    <div className="so-details-card mx-5 mb-5">
                        <h1 className="sales-order-title mb-3">Create Recurring Expense</h1>

                        <p className="text-muted mb-4" style={{ fontSize: "14px" }}>
                            Enter details for the recurring expense. Required fields are marked with
                            <span className="text-danger ms-1">*</span>.
                        </p>

                        <div className="row g-4">
                            {/* COLUMN 1 */}
                            <div className="col-lg-4">
                                {/* Profile Name */}
                                <div className="mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Profile Name<span className="text-danger">*</span>:
                                    </label>
                                    <input
                                        type="text"
                                        name="profileName"
                                        className="form-control so-control"
                                        value={formData.profileName}
                                        onChange={handleChange}
                                    />
                                </div>

                                {/* Repeat Every */}
                                <div className="mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Repeat Every<span className="text-danger">*</span>:
                                    </label>
                                    <select
                                        name="repeatEvery"
                                        className="form-select so-control"
                                        value={formData.repeatEvery}
                                        onChange={handleChange}
                                    >
                                        <option value="" disabled hidden>
                                            Select frequency
                                        </option>
                                        <option value="Week">Every Week</option>
                                        <option value="Month">Every Month</option>
                                        <option value="Year">Every Year</option>
                                    </select>
                                </div>

                                {/* Start / End */}
                                <div className="mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Start / End:
                                    </label>
                                    <div className="row g-2">
                                        <div className="col-6">
                                            <input
                                                type="date"
                                                name="startDate"
                                                className="form-control so-control mb-1"
                                                value={formData.startDate}
                                                onChange={handleChange}
                                            />
                                            <small className="text-muted d-block" style={{ fontSize: "11px" }}>
                                                Starts on {formData.startDate || "--/--/----"}
                                            </small>
                                        </div>
                                        <div className="col-6">
                                            <input
                                                type="date"
                                                name="endsOn"
                                                className="form-control so-control"
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
                                                <label className="form-check-label radio-row" style={{ fontSize: "11px" }}>
                                                    Never
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* COLUMN 2 */}
                            <div className="col-lg-4">
                                {/* Expense Account */}
                                <div className="mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Expense Account<span className="text-danger">*</span>:
                                    </label>
                                    <select
                                        name="expenseAccount"
                                        className="form-select so-control"
                                        value={formData.expenseAccount}
                                        onChange={handleChange}
                                    >
                                        <option value="" disabled hidden>
                                            Select an account
                                        </option>
                                        <option value="Travel">Travel Expenses</option>
                                        <option value="Office">Office Expense</option>
                                        <option value="Supplies">Supplies</option>
                                    </select>
                                </div>

                                {/* Vendor */}
                                <div className="mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Vendor:
                                    </label>
                                    <select
                                        name="vendor"
                                        className="form-select so-control"
                                        value={formData.vendor}
                                        onChange={handleChange}
                                    >
                                        <option value="" disabled hidden>
                                            Select Vendor
                                        </option>
                                        <option value="Vendor A">Vendor A</option>
                                        <option value="Vendor B">Vendor B</option>
                                    </select>
                                </div>

                                {/* Amount + Currency */}
                                <div className="mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Amount<span className="text-danger">*</span>:
                                    </label>
                                    <div className="d-flex gap-2">
                                        <select
                                            name="currency"
                                            className="form-select so-control"
                                            style={{ maxWidth: "70px" }}
                                            value={formData.currency}
                                            onChange={handleChange}
                                        >
                                            <option value="INR">INR</option>
                                            <option value="USD">USD</option>
                                            <option value="EUR">EUR</option>
                                        </select>
                                        <input
                                            type="number"
                                            name="amount"
                                            className="form-control so-control text-end"
                                            value={formData.amount}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* COLUMN 3 */}
                            <div className="col-lg-4">
                                {/* Paid Through */}
                                <div className="mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Paid Through<span className="text-danger">*</span>:
                                    </label>
                                    <select
                                        name="paidThrough"
                                        className="form-select so-control"
                                        value={formData.paidThrough}
                                        onChange={handleChange}
                                    >
                                        <option value="" disabled hidden>
                                            Select an account
                                        </option>
                                        <option value="Cash">Cash</option>
                                        <option value="Bank">Bank Account</option>
                                        <option value="Wallet">Wallet</option>
                                    </select>
                                </div>

                                {/* Customer Name */}
                                <div className="mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Customer:
                                    </label>
                                    <select
                                        name="customerName"
                                        className="form-select so-control"
                                        value={formData.customerName}
                                        onChange={handleChange}
                                    >
                                        <option value="" disabled hidden>
                                            Select Customer
                                        </option>
                                        <option value="Customer A">Customer A</option>
                                        <option value="Customer B">Customer B</option>
                                    </select>
                                </div>

                                {/* Notes */}
                                <div className="mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Notes:
                                    </label>
                                    <textarea
                                        name="notes"
                                        className="form-control so-control"
                                        maxLength={500}
                                        placeholder="Max. 500 characters"
                                        value={formData.notes}
                                        onChange={handleChange}
                                        rows={3}
                                    />
                                </div>
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
                    </div>
                </form>
            </div>
        </>


    );
};

export default AddRecurringExpense;
