import React, { useState } from "react";
import Header from "../../../../components/Header/Header";
import Tabs from "../../../../components/Tab/Tabs";
import { FeatherUpload } from "../../../Sales/Customers/AddCustomer/Add";
import { PlusCircle } from "react-feather";

interface BulkRow {
    date: string;
    account: string;
    amount: string;
    paidThrough: string;
    vendor: string;
    customer: string;
    project: string;
    billable: boolean;
}

const AddExpense: React.FC = () => {
    const [activeTab, setActiveKey] = useState("record-expense");

    const [bulkRows, setBulkRows] = useState([
        {
            date: "",
            account: "",
            amount: "",
            paidThrough: "",
            vendor: "",
            customer: "",
            project: "",
            billable: false,
        },
    ]);

    const onAddRow = () => {
        setBulkRows((prev) => [
            ...prev,
            {
                date: "",
                account: "",
                amount: "",
                paidThrough: "",
                vendor: "",
                customer: "",
                project: "",
                billable: false,
            },
        ]);
    };

    const handleRowChange = (
        index: number,
        field: keyof BulkRow,
        value: string | boolean
    ) => {
        setBulkRows((prev) =>
            prev.map((row, i) =>
                i === index ? { ...row, [field]: value } : row
            )
        );
    };

    // Record Expense Tab
    // inside AddExpense.tsx

    const renderRecordExpense = () => (
        <div style={{ padding: "0 1.8rem" }}>
            {/* <h1 className="h4 text-dark mb-4 pb-1">Record Expense</h1> */}

            <form
                // onSubmit={handleSubmit}  // hook up later if needed
                className="mt-3"
                style={{ color: "#5E5E5E" }}
            >
                {/* SECTION 1: Date / Expense Account / Amount (3 columns) */}
                <div className="row mb-4">
                    {/* Column 1: Date */}
                    <div className="col-lg-4">
                        <div className="row align-items-center mb-2">
                            <label className="col-sm-2 col-form-label">
                                Date:<span className="text-danger">*</span>
                            </label>
                            <div className="col-sm-8">
                                <input
                                    type="date"
                                    name="date"
                                    className="form-control form-control-sm border"
                                    defaultValue={new Date().toISOString().split("T")[0]}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Expense Account */}
                    <div className="col-lg-4">
                        <div className="row align-items-center mb-2">
                            <label className="col-sm-4 col-form-label">
                                Expense Account:<span className="text-danger">*</span>
                            </label>
                            <div className="col-sm-8">
                                <select name="expenseAccount" className="form-select form-select-sm border">
                                    <option value="">-- select Expense Account --</option>
                                    <option>IT and Internet Expenses</option>
                                    <option>Office Supplies</option>
                                    <option>Travel Expenses</option>
                                    <option>Meals & Entertainment</option>
                                </select>
                                <button
                                    type="button"
                                    className="btn btn-link p-0 mt-1"
                                    style={{ fontSize: "12px" }}
                                >
                                    Itemize
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Column 3: Amount + Currency */}
                    <div className="col-lg-4">
                        <div className="row align-items-center mb-2">
                            <label className="col-sm-3 col-form-label">
                                Amount:<span className="text-danger">*</span>
                            </label>
                            <div className="col-sm-8">
                                <div className="d-flex">
                                    <select name="currency" className="form-select form-select-sm" style={{ maxWidth: "90px" }}>
                                        <option>INR</option>
                                        <option>USD</option>
                                    </select>
                                    <input
                                        type="number"
                                        name="amount"
                                        className="form-control form-control-sm border ms-2"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <hr className="my-4" />

                {/* SECTION 2: Paid Through / Vendor / Invoice# / Notes (3 columns) */}
                <div className="row mb-4">
                    {/* Column 1: Paid Through */}
                    <div className="col-lg-4">
                        <div className="row align-items-center mb-2">
                            <label className="col-sm-4 col-form-label">
                                Paid Through:<span className="text-danger">*</span>
                            </label>
                            <div className="col-sm-8">
                                <select name="paidThrough" className="form-select form-select-sm border">
                                    <option value="">Select an account</option>
                                    <option>Cash</option>
                                    <option>Bank</option>
                                    <option>Credit Card</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Vendor */}
                    <div className="col-lg-4">
                        <div className="row align-items-center mb-2">
                            <label className="col-sm-3 col-form-label">Vendor:</label>
                            <div className="col-sm-8">
                                <select name="vendor" className="form-select form-select-sm border">
                                    <option value="">Select or add a vendor</option>
                                    <option value="vendor1">Vendor 1</option>
                                    <option value="vendor2">Vendor 2</option>
                                    <option value="vendor3">Vendor 3</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Column 3: Invoice# + Notes */}
                    <div className="col-lg-4">
                        <div className="row align-items-start mb-2">
                            <label className="col-sm-3 col-form-label">Invoice#:</label>
                            <div className="col-sm-8">
                                <input
                                    type="text"
                                    name="invoiceNo"
                                    className="form-control form-control-sm border"
                                />
                            </div>
                        </div>
                        <div className="row align-items-start">
                            <label className="col-sm-3 col-form-label">Notes:</label>
                            <div className="col-sm-8">
                                <textarea
                                    name="notes"
                                    className="form-control form-control-sm border"
                                    rows={3}
                                    placeholder="Max. 500 characters"
                                />
                            </div>
                        </div>
                    </div>
                </div>



                <hr className="my-4" />

                {/* Row 5: Customer Name */}
                <div className="row mb-3 align-items-center">
                    <label className="col-sm-2 col-form-label">Customer Name:</label>
                    <div className="col-sm-3">
                        <select
                            className="form-select form-select-sm"
                        // value={selectedCustomer}
                        // onChange={(e) => setSelectedCustomer(e.target.value)}
                        >
                            <option value="">Select or add a customer</option>
                            <option value="customer1">Customer 1</option>
                            <option value="customer2">Customer 2</option>
                            <option value="customer3">Customer 3</option>
                        </select>
                    </div>
                </div>



                <div className="row mb-4">
                    <label className="col-sm-2 col-form-label"> Receipts:</label>
                    <div className="col-sm-6">
                        <div
                            onClick={() => document.getElementById("fileUploadInput")?.click()}
                            className="d-flex flex-column align-items-center justify-content-center w-100 p-4 bg-light cursor-pointer"
                            style={{
                                minHeight: "120px",
                                border: "2px dotted #a0a0a0",
                                borderRadius: "8px"
                            }}
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
                                        console.log("Files uploaded:", files);
                                        alert(`${files.length} file(s) selected!`);
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Submit Buttons – reuse New Vendor theme */}
                <div className="d-flex justify-content-center mt-4 pt-4 border-top">
                    <button
                        type="button"
                        className="btn border me-3 px-4"
                    // onClick={() => navigate(-1)}
                    >
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
    );


    // Record Mileage Tab
    const renderRecordMileage = () => (
        <div style={{ padding: "0 1.8rem" }}>
            <h1 className="h4 text-dark mb-4 pb-1">Record Mileage</h1>

            <form className="mt-3" style={{ color: "#5E5E5E" }}>
                {/* SECTION 1: Date/Employee + Mileage + Distance/Amount (3 columns) */}
                <div className="row mb-4">
                    {/* Column 1: Date + Employee */}
                    <div className="col-lg-4">
                        {/* Date */}
                        <div className="row align-items-center mb-2">
                            <label className="col-sm-4 col-form-label">
                                Date<span className="text-danger">*</span>
                            </label>
                            <div className="col-sm-8">
                                <input
                                    type="date"
                                    name="date"
                                    className="form-control form-control-sm border"
                                    defaultValue={new Date().toISOString().split("T")[0]}
                                />
                            </div>
                        </div>

                        {/* Calculate mileage using */}
                        <div className="row align-items-center mb-2">
                            <label className="col-sm-4 col-form-label">
                                Calculate mileage using<span className="text-danger">*</span>
                            </label>
                            <div className="col-sm-8">
                                <div className="d-flex align-items-center flex-column">
                                    <div className="form-check me-2 mb-1 w-100">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="mileageType"
                                            id="distanceTravelled"
                                            defaultChecked
                                        />
                                        <label className="form-check-label small" htmlFor="distanceTravelled">
                                            Distance travelled
                                        </label>
                                    </div>
                                    <div className="form-check w-100">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="mileageType"
                                            id="odometerReading"
                                        />
                                        <label className="form-check-label small" htmlFor="odometerReading">
                                            Odometer reading
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>

                    {/* Column 2: Calculate Mileage + Distance Helper */}
                    <div className="col-lg-4">
                        {/* Employee */}
                        <div className="row align-items-center mb-2">
                            <label className="col-sm-4 col-form-label">Employee</label>
                            <div className="col-sm-8">
                                <select name="employee" className="form-select form-select-sm border">
                                    <option value="">Select employee</option>
                                    <option value="emp1">Employee 1</option>
                                    <option value="emp2">Employee 2</option>
                                </select>
                            </div>
                        </div>

                        {/* Amount */}
                        <div className="row align-items-center">
                            <label className="col-sm-4 col-form-label">
                                Amount<span className="text-danger">*</span>
                            </label>
                            <div className="col-sm-8">
                                <div className="d-flex">
                                    <select name="amountCurrency" className="form-select form-select-sm" style={{ maxWidth: "90px" }}>
                                        <option>INR</option>
                                        <option>USD</option>
                                    </select>
                                    <input
                                        type="number"
                                        name="amount"
                                        className="form-control form-control-sm border ms-2"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Column 3: Distance + Amount */}
                    <div className="col-lg-4">
                        {/* Distance */}
                        <div className="row align-items-center mb-2">
                            <label className="col-sm-3 col-form-label">
                                Distance<span className="text-danger">*</span>
                            </label>
                            <div className="col-sm-8">
                                <div className="d-flex">
                                    <input
                                        type="number"
                                        name="distance"
                                        className="form-control form-control-sm border"
                                        placeholder="0.00"
                                        step="0.1"
                                    />
                                    <select name="distanceUnit" className="form-select form-select-sm ms-2" style={{ maxWidth: "130px" }}>
                                        <option>Kilometer(s)</option>
                                        <option>Mile(s)</option>
                                    </select>
                                </div>
                                <small className="text-muted d-block mt-1">
                                    Rate per km = ₹12,000.00
                                    <button type="button" className="btn btn-link p-0 ms-1" style={{ fontSize: "12px" }}>
                                        Change
                                    </button>
                                </small>
                            </div>
                        </div>


                    </div>
                </div>

                <hr className="my-4" />

                {/* SECTION 2: Paid Through/Vendor + Invoice#/Notes + Customer (3 columns) */}
                <div className="row mb-4">
                    {/* Column 1: Paid Through */}
                    <div className="col-lg-4">
                        <div className="row align-items-center mb-2">
                            <label className="col-sm-4 col-form-label">
                                Paid Through<span className="text-danger">*</span>
                            </label>
                            <div className="col-sm-8">
                                <select name="paidThrough" className="form-select form-select-sm border">
                                    <option value="">Select an account</option>
                                    <option>Cash</option>
                                    <option>Bank</option>
                                    <option>Credit Card</option>
                                </select>
                            </div>
                        </div>

                        {/* Customer Name (standalone below) */}
                        <div className="row mb-3 align-items-center">
                            <label className="col-sm-4 col-form-label">Customer Name</label>
                            <div className="col-sm-5">
                                <select name="customerName" className="form-select form-select-sm border">
                                    <option value="">Select customer</option>
                                    <option value="customer1">Customer 1</option>
                                    <option value="customer2">Customer 2</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Vendor */}
                    <div className="col-lg-4">
                        <div className="row align-items-center mb-2">
                            <label className="col-sm-3 col-form-label">Vendor:</label>
                            <div className="col-sm-6">
                                <select name="vendor" className="form-select form-select-sm border">
                                    <option value="">Select a vendor</option>
                                    <option value="vendor1">Vendor 1</option>
                                    <option value="vendor2">Vendor 2</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Column 3: Invoice# + Notes + Customer */}
                    <div className="col-lg-4">
                        {/* Invoice# */}
                        <div className="row align-items-start mb-2">
                            <label className="col-sm-3 col-form-label">Invoice#:</label>
                            <div className="col-sm-8">
                                <input
                                    type="text"
                                    name="invoiceNo"
                                    className="form-control form-control-sm border"
                                />
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="row align-items-start mb-2">
                            <label className="col-sm-3 col-form-label">Notes:</label>
                            <div className="col-sm-8">
                                <textarea
                                    name="notes"
                                    className="form-control form-control-sm border"
                                    rows={2}
                                    placeholder="Max. 500 characters"
                                />
                            </div>
                        </div>
                    </div>
                </div>




                {/* Buttons – same theme as other forms */}
                <div className="d-flex justify-content-center mt-4 pt-4 border-top">
                    <button
                        type="button"
                        className="btn border me-3 px-4"
                    >
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
    );




    // Bulk Add Expenses Tab
    const renderBulkAddExpenses = () => (
        <div style={{ padding: "0 1.8rem" }}>
            <h1 className="h4 text-dark mb-4 pb-1">Bulk Add Expenses</h1>

            <form className="mt-3" style={{ color: "#5E5E5E" }}>
                <p className="text-muted mb-3" style={{ fontSize: "14px" }}>
                    Enter multiple expenses in the table below. Required fields are marked with *.
                </p>

                <div className="table-responsive">
                    <table className="table table-bordered align-middle">
                        <thead className="table-light">
                            <tr>
                                <th style={{ width: "11%" }}>
                                    Date<span className="text-danger">*</span>
                                </th>
                                <th style={{ width: "18%" }}>
                                    Expense Account<span className="text-danger">*</span>
                                </th>
                                <th style={{ width: "10%" }}>
                                    Amount<span className="text-danger">*</span>
                                </th>
                                <th style={{ width: "14%" }}>
                                    Paid Through<span className="text-danger">*</span>
                                </th>
                                <th style={{ width: "14%" }}>Vendor</th>
                                <th style={{ width: "14%" }}>Customer Name</th>
                                <th style={{ width: "11%" }}>Projects</th>
                                <th style={{ width: "8%" }}>Billable</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bulkRows.map((row: BulkRow, index: number) => (
                                <tr key={index}>
                                    {/* Date */}
                                    <td>
                                        <input
                                            type="date"
                                            className="form-control form-control-sm border-0"
                                            value={row.date}
                                            onChange={(e) =>
                                                handleRowChange(index, "date", e.target.value)
                                            }
                                        />
                                    </td>

                                    {/* Expense Account */}
                                    <td>
                                        <select
                                            className="form-select form-select-sm border"
                                            value={row.account}
                                            onChange={(e) =>
                                                handleRowChange(index, "account", e.target.value)
                                            }
                                        >
                                            <option value="">Select account</option>
                                            <option>IT and Internet Expenses</option>
                                            <option>Office Supplies</option>
                                            <option>Travel Expenses</option>
                                        </select>
                                    </td>

                                    {/* Amount */}
                                    <td>
                                        <input
                                            type="number"
                                            className="form-control form-control-sm border-0"
                                            placeholder="0.00"
                                            value={row.amount}
                                            onChange={(e) =>
                                                handleRowChange(index, "amount", e.target.value)
                                            }
                                        />
                                    </td>

                                    {/* Paid Through */}
                                    <td>
                                        <select
                                            className="form-select form-select-sm"
                                            value={row.paidThrough}
                                            onChange={(e) =>
                                                handleRowChange(index, "paidThrough", e.target.value)
                                            }
                                        >
                                            <option value="">Select account</option>
                                            <option>Cash</option>
                                            <option>Bank</option>
                                            <option>Credit Card</option>
                                        </select>
                                    </td>

                                    {/* Vendor */}
                                    <td>
                                        <select
                                            className="form-select form-select-sm"
                                            value={row.vendor}
                                            onChange={(e) =>
                                                handleRowChange(index, "vendor", e.target.value)
                                            }
                                        >
                                            <option value="">Select vendor</option>
                                            <option value="vendor1">Vendor 1</option>
                                            <option value="vendor2">Vendor 2</option>
                                        </select>
                                    </td>

                                    {/* Customer Name */}
                                    <td>
                                        <select
                                            className="form-select form-select-sm"
                                            value={row.customer}
                                            onChange={(e) =>
                                                handleRowChange(index, "customer", e.target.value)
                                            }
                                        >
                                            <option value="">Select customer</option>
                                            <option value="customer1">Customer 1</option>
                                            <option value="customer2">Customer 2</option>
                                        </select>
                                    </td>

                                    {/* Projects */}
                                    <td>
                                        <select
                                            className="form-select form-select-sm"
                                            value={row.project}
                                            onChange={(e) =>
                                                handleRowChange(index, "project", e.target.value)
                                            }
                                        >
                                            <option value="">None</option>
                                            <option value="project1">Project Alpha</option>
                                            <option value="project2">Project Beta</option>
                                        </select>
                                    </td>

                                    {/* Billable */}
                                    <td className="text-center">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            checked={row.billable}
                                            onChange={(e) =>
                                                handleRowChange(index, "billable", e.target.checked)
                                            }
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Add row button – your style */}
                    <button
                        type="button"
                        className="btn btn-sm fw-normal mt-2 d-flex align-items-center"
                        onClick={onAddRow}
                        style={{
                            color: "#5E5E5E",
                            border: "1px solid #D9D9D9",
                        }}
                    >
                        <PlusCircle
                            size={18}
                            style={{ color: "#878787", marginRight: "4px" }}
                        />
                        Add New Row
                    </button>
                </div>

                {/* Bottom actions */}
                <div className="d-flex justify-content-center mt-4 pt-4 border-top">
                    <button type="button" className="btn border me-3 px-4">
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn px-4"
                        style={{ background: "#7991BB", color: "#FFFFFF" }}
                    >
                        Save Expenses
                    </button>
                </div>
            </form>
        </div>

    );


    const tabs = [
        {
            key: "record-expense",
            label: "Record Expense",
            content: renderRecordExpense()
        },
        {
            key: "record-mileage",
            label: "Record Mileage",
            content: renderRecordMileage()
        },
        {
            key: "bulk-add",
            label: "Bulk Add Expenses",
            content: renderBulkAddExpenses()
        },
    ];

    return (
        <>
            <Header />
            <div style={{ padding: "56px 0px 0px" }}>

                <div className="ps-4">
                    <Tabs
                        tabs={tabs}
                        defaultActiveKey="record-expense"
                        onChange={setActiveKey}
                    />
                </div>

                <div className="mt-3">
                    {tabs.find((t) => t.key === activeTab)?.content}
                </div>
            </div>

        </>
    );
};

export default AddExpense;
