import React, { useState } from "react";
import Header from "../../../../components/Header/Header";
import Tabs from "../../../../components/Tab/Tabs";
import { FeatherUpload } from "../../../Sales/Customers/AddCustomer/Add";
import { Plus, Trash2 } from "react-feather";
import { useNavigate } from "react-router-dom";

// 1. Define the form interface
interface ExpenseFormData {
    date: string;
    expenseAccount: string;
    currency: string;
    amount: string;
    paidThrough: string;
    vendor: string;
    invoiceNo: string;
    notes: string;
    customerName: string;
}



// Add this state (component level)
interface MileageFormData {
    date: string;
    mileageType: 'distanceTravelled' | 'odometerReading';
    employee: string;
    amountCurrency: string;
    amount: string;
    distance: string;
    distanceUnit: string;
    paidThrough: string;
    vendor: string;
    invoiceNo: string;
    notes: string;
    customerName: string;
}

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

    const navigate = useNavigate();



    const [expenseData, setExpenseData] = useState<ExpenseFormData>({
        date: new Date().toISOString().split("T")[0],
        expenseAccount: "",
        currency: "INR",
        amount: "",
        paidThrough: "",
        vendor: "",
        invoiceNo: "",
        notes: "",
        customerName: "",
    });

    const handleExpenseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setExpenseData(prev => ({ ...prev, [name]: value }));
    };


    const [showRateModal, setShowRateModal] = useState(false);
    const [mileageRate, setMileageRate] = useState<number>(12000);

    const [mileageData, setMileageData] = useState<MileageFormData>({
        date: new Date().toISOString().split("T")[0],
        mileageType: 'distanceTravelled',
        employee: '',
        amountCurrency: 'INR',
        amount: '',
        distance: '',
        distanceUnit: 'Kilometer(s)',
        paidThrough: '',
        vendor: '',
        invoiceNo: '',
        notes: '',
        customerName: ''
    });

    const handleMileageChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setMileageData(prev => ({ ...prev, [name]: value }));
    };


    const handleMileageRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMileageData(prev => ({ ...prev, mileageType: e.target.value as 'distanceTravelled' | 'odometerReading' }));
    };

    const handleMileageSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Mileage Data:', mileageData);
        alert('Mileage recorded successfully!');
    };


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



    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Expense:", expenseData);
        alert("Saved!");
    };

    const handleBulkSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Bulk Expenses:", bulkRows);
        alert(`${bulkRows.length} expenses saved successfully!`);
    };

    const handleRemoveRow = (index: number) => {
        setBulkRows(prev => prev.filter((_, i) => i !== index));
    };



    // Record Expense Tab
    // inside AddExpense.tsx

    const renderRecordExpense = () => (
        <>
            <div className="sales-orders-page">
                <form onSubmit={handleSubmit} className="sales-order-form">
                    {/* SINGLE BIG CARD - ALL 3 SECTIONS */}
                    <div className="so-details-card mx-5 mb-5">
                        <h1 className="sales-order-title mb-4">Record Expense</h1>

                        {/* SECTION 1: Date / Expense Account / Amount */}
                        <div className="row g-3 three-column-form mb-4">
                            {/* Col 1: Date */}
                            <div className="col-lg-4">
                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Date <span className="text-danger">*</span>:
                                    </label>
                                    <input
                                        type="date"
                                        name="date"
                                        className="form-control so-control"
                                        value={expenseData.date}
                                        onChange={handleExpenseChange}
                                    />
                                </div>
                            </div>

                            {/* Col 2: Expense Account */}
                            <div className="col-lg-4">
                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Expense Account <span className="text-danger">*</span>:
                                    </label>
                                    <div className="d-flex flex-column gap-1">
                                        <select
                                            name="expenseAccount"
                                            className="form-select so-control"
                                            value={expenseData.expenseAccount}
                                            onChange={handleExpenseChange}
                                        >
                                            <option value="">Select Expense Account</option>
                                            <option>IT and Internet Expenses</option>
                                            <option>Office Supplies</option>
                                            <option>Travel Expenses</option>
                                            <option>Meals & Entertainment</option>
                                        </select>
                                        {/* <button type="button" className="btn btn-link p-0 text-sm" style={{ fontSize: "12px" }}>
                                            Itemize
                                        </button> */}
                                    </div>
                                </div>
                            </div>

                            {/* Col 3: Amount + Currency */}
                            <div className="col-lg-4">
                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Amount <span className="text-danger">*</span>:
                                    </label>
                                    <div className="d-flex gap-2">
                                        <select
                                            name="currency"
                                            className="form-select so-control"
                                            style={{ width: "70px" }}
                                            value={expenseData.currency}
                                            onChange={handleExpenseChange}
                                        >
                                            <option>INR</option>
                                            <option>USD</option>
                                        </select>
                                        <input
                                            type="number"
                                            name="amount"
                                            className="form-control so-control no-spinner"
                                            value={expenseData.amount}
                                            onChange={handleExpenseChange}
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <hr className="so-divider my-4" />

                        {/* SECTION 2: Paid Through / Vendor / Invoice# + Notes */}
                        <div className="row g-3 three-column-form mb-4">
                            {/* Col 1: Paid Through */}
                            <div className="col-lg-4">
                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Paid Through <span className="text-danger">*</span>:
                                    </label>
                                    <select
                                        name="paidThrough"
                                        className="form-select so-control"
                                        value={expenseData.paidThrough}
                                        onChange={handleExpenseChange}
                                    >
                                        <option value="">Select an account</option>
                                        <option>Cash</option>
                                        <option>Bank</option>
                                        <option>Credit Card</option>
                                    </select>
                                </div>
                            </div>

                            {/* Col 2: Vendor */}
                            <div className="col-lg-4">
                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Vendor:
                                    </label>
                                    <select
                                        name="vendor"
                                        className="form-select so-control"
                                        value={expenseData.vendor}
                                        onChange={handleExpenseChange}
                                    >
                                        <option value="">Select or add a vendor</option>
                                        <option value="vendor1">Vendor 1</option>
                                        <option value="vendor2">Vendor 2</option>
                                        <option value="vendor3">Vendor 3</option>
                                    </select>
                                </div>
                            </div>

                            {/* Col 3: Invoice# + Notes */}
                            <div className="col-lg-4">
                                <div className="so-form-group mb-3">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Invoice #:
                                    </label>
                                    <input
                                        type="text"
                                        name="invoiceNo"
                                        className="form-control so-control"
                                        value={expenseData.invoiceNo}
                                        onChange={handleExpenseChange}
                                    />
                                </div>
                                <div className="so-form-group">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Notes:
                                    </label>
                                    <textarea
                                        name="notes"
                                        className="form-control so-control textarea"
                                        rows={3}
                                        value={expenseData.notes}
                                        onChange={handleExpenseChange}
                                        placeholder="Max. 500 characters"
                                    />
                                </div>
                            </div>
                        </div>

                        <hr className="so-divider my-4" />

                        {/* SECTION 3: Customer Name + Receipts (2 columns) */}
                        <div className="row g-4">
                            {/* Col 1: Customer Name */}
                            <div className="col-lg-4">
                                <div className="so-form-group">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Customer Name:
                                    </label>
                                    <select
                                        name="customerName"
                                        className="form-select so-control"
                                        value={expenseData.customerName || ""}
                                        onChange={handleExpenseChange}
                                    >
                                        <option value="">Select or add a customer</option>
                                        <option value="customer1">Customer 1</option>
                                        <option value="customer2">Customer 2</option>
                                        <option value="customer3">Customer 3</option>
                                    </select>
                                </div>
                            </div>

                            {/* Col 2: Receipts Upload */}
                            <div className="col-lg-8">
                                <div className="so-form-group">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Receipts:
                                    </label>
                                    <div className="doc-upload-box" onClick={() => document.getElementById("fileUploadInput")?.click()}>
                                        <FeatherUpload size={28} className="text-muted mb-2" />
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
                        </div>
                    </div>

                    {/* Buttons - OUTSIDE card */}
                    <div className="mx-5 mb-5">
                        <div className="form-actions">
                            <button
                                type="button"
                                className="btn border me-3 px-4"
                                onClick={() => navigate(-1)}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn px-4"
                                style={{ background: "#7991BB", color: "#FFF" }}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );

    const renderRecordMileage = () => (
        <div className="sales-orders-page">
            <form onSubmit={handleMileageSubmit} className="sales-order-form">
                {/* SINGLE BIG CARD - ALL SECTIONS */}
                <div className="so-details-card mx-5 mb-5">
                    <h1 className="sales-order-title mb-4">Record Mileage</h1>

                    {/* SECTION 1: Date/Radio + Employee/Amount + Distance (3 columns) */}
                    <div className="row g-3 three-column-form mb-4">
                        {/* Col 1: Date + Mileage Type Radio */}
                        <div className="col-lg-4">
                            <div className="so-form-group mb-4">
                                <label className="so-label text-sm text-muted-foreground fw-bold">
                                    Date <span className="text-danger">*</span>:
                                </label>
                                <input
                                    type="date"
                                    name="date"
                                    className="form-control so-control"
                                    value={mileageData.date}
                                    onChange={handleMileageChange}
                                />
                            </div>
                            <div className="so-form-group">
                                <label className="so-label text-sm text-muted-foreground fw-bold">
                                    Calculate mileage using <span className="text-danger">*</span>:
                                </label>
                                <div className="radio-row">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="mileageType"
                                            id="distanceTravelled"
                                            checked={mileageData.mileageType === 'distanceTravelled'}
                                            onChange={handleMileageRadioChange}
                                            value="distanceTravelled"
                                        />
                                        <label className="form-check-label small" htmlFor="distanceTravelled">
                                            Distance travelled
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="mileageType"
                                            id="odometerReading"
                                            checked={mileageData.mileageType === 'odometerReading'}
                                            onChange={handleMileageRadioChange}
                                            value="odometerReading"
                                        />
                                        <label className="form-check-label small" htmlFor="odometerReading">
                                            Odometer reading
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Col 2: Employee + Amount */}
                        <div className="col-lg-4">
                            <div className="so-form-group mb-4">
                                <label className="so-label text-sm text-muted-foreground fw-bold">Employee:</label>
                                <select name="employee" className="form-select so-control" value={mileageData.employee} onChange={handleMileageChange}>
                                    <option value="">Select employee</option>
                                    <option value="emp1">Employee 1</option>
                                    <option value="emp2">Employee 2</option>
                                </select>
                            </div>
                            <div className="so-form-group">
                                <label className="so-label text-sm text-muted-foreground fw-bold">
                                    Amount <span className="text-danger">*</span>:
                                </label>
                                <div className="d-flex gap-2">
                                    <select name="amountCurrency" className="form-select so-control" style={{ width: "70px" }} value={mileageData.amountCurrency} onChange={handleMileageChange}>
                                        <option>INR</option>
                                        <option>USD</option>
                                    </select>
                                    <input
                                        type="number"
                                        name="amount"
                                        className="form-control so-control no-spinner"
                                        value={mileageData.amount}
                                        onChange={handleMileageChange}
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Col 3: Distance (2 fields as one unit) */}
                        <div className="col-lg-4">
                            <div className="so-form-group">
                                <label className="so-label text-sm text-muted-foreground fw-bold">
                                    Distance <span className="text-danger">*</span>:
                                </label>
                                <div className="d-flex gap-1 mb-2">
                                    <input
                                        type="number"
                                        name="distance"
                                        className="form-control so-control"
                                        value={mileageData.distance}
                                        onChange={handleMileageChange}
                                        placeholder="0.00"
                                        step="0.1"
                                    />
                                    <select
                                        name="distanceUnit"
                                        className="form-select so-control"
                                        style={{ width: "130px" }}
                                        value={mileageData.distanceUnit}
                                        onChange={handleMileageChange}
                                    >
                                        <option>Kilometer(s)</option>
                                        <option>Mile(s)</option>
                                    </select>
                                </div>
                                <small className="text-muted d-block">
                                    Rate per km = ₹{mileageRate.toLocaleString()}
                                    <button
                                        type="button"
                                        className="btn btn-link p-0 ms-1 text-sm"
                                        onClick={() => setShowRateModal(true)}
                                    >
                                        Change
                                    </button>
                                </small>
                            </div>
                        </div>
                    </div>

                    <hr className="so-divider my-4" />

                    {/* SECTION 2: Paid Through / Vendor / Invoice# + Notes (3 columns) */}
                    <div className="row g-3 three-column-form mb-4">
                        {/* Col 1: Paid Through + Customer Name */}
                        <div className="col-lg-4">
                            <div className="so-form-group mb-4">
                                <label className="so-label text-sm text-muted-foreground fw-bold">
                                    Paid Through <span className="text-danger">*</span>:
                                </label>
                                <select name="paidThrough" className="form-select so-control" value={mileageData.paidThrough} onChange={handleMileageChange}>
                                    <option value="">Select an account</option>
                                    <option>Cash</option>
                                    <option>Bank</option>
                                    <option>Credit Card</option>
                                </select>
                            </div>
                            <div className="so-form-group">
                                <label className="so-label text-sm text-muted-foreground fw-bold">Customer Name:</label>
                                <select name="customerName" className="form-select so-control" value={mileageData.customerName} onChange={handleMileageChange}>
                                    <option value="">Select customer</option>
                                    <option value="customer1">Customer 1</option>
                                    <option value="customer2">Customer 2</option>
                                </select>
                            </div>
                        </div>

                        {/* Col 2: Vendor */}
                        <div className="col-lg-4">
                            <div className="so-form-group mb-4">
                                <label className="so-label text-sm text-muted-foreground fw-bold">Vendor:</label>
                                <select name="vendor" className="form-select so-control" value={mileageData.vendor} onChange={handleMileageChange}>
                                    <option value="">Select a vendor</option>
                                    <option value="vendor1">Vendor 1</option>
                                    <option value="vendor2">Vendor 2</option>
                                </select>
                            </div>

                            <div className="so-form-group mb-3">
                                <label className="so-label text-sm text-muted-foreground fw-bold">Invoice #:</label>
                                <input
                                    type="text"
                                    name="invoiceNo"
                                    className="form-control so-control"
                                    value={mileageData.invoiceNo}
                                    onChange={handleMileageChange}
                                />
                            </div>
                        </div>

                        {/* Col 3: Invoice# + Notes */}
                        <div className="col-lg-4">

                            <div className="so-form-group">
                                <label className="so-label text-sm text-muted-foreground fw-bold">Notes:</label>
                                <textarea
                                    name="notes"
                                    className="form-control so-control subject-textarea"
                                    rows={3}
                                    value={mileageData.notes}
                                    onChange={handleMileageChange}
                                    placeholder="Max. 500 characters"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="mx-5 mb-5">
                    <div className="form-actions">
                        <button type="button" className="btn border me-3 px-4" onClick={() => navigate(-1)}>
                            Cancel
                        </button>
                        <button type="submit" className="btn px-4" style={{ background: "#7991BB", color: "#FFF" }}>
                            Save
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );

    // const renderBulkAddExpenses = () => (
    //     <div className="item-card">
    //         <div className="item-card-header">
    //             <span className="item-card-title">Bulk Add Expenses</span>
    //         </div>

    //         <div className="item-card-body">
    //             <p className="text-muted mb-3 small">
    //                 Enter multiple expenses in the table below. Required fields are marked with *.
    //             </p>

    //             <div className="row">
    //                 <div className="col-md-12">
    //                     <table className="table table-sm align-middle item-table-inner">
    //                         <thead>
    //                             <tr>
    //                                 <th className="fw-medium text-dark" style={{ width: "11%" }}>
    //                                     Date<span className="text-danger">*</span>
    //                                 </th>
    //                                 <th className="fw-medium text-dark" style={{ width: "18%" }}>
    //                                     Expense Account<span className="text-danger">*</span>
    //                                 </th>
    //                                 <th className="fw-medium text-dark" style={{ width: "10%" }}>
    //                                     Amount<span className="text-danger">*</span>
    //                                 </th>
    //                                 <th className="fw-medium text-dark" style={{ width: "14%" }}>
    //                                     Paid Through<span className="text-danger">*</span>
    //                                 </th>
    //                                 <th className="fw-medium text-dark" style={{ width: "14%" }}>Vendor</th>
    //                                 <th className="fw-medium text-dark" style={{ width: "14%" }}>Customer</th>
    //                                 <th className="fw-medium text-dark" style={{ width: "11%" }}>Projects</th>
    //                                 <th className="fw-medium text-dark text-center" style={{ width: "8%" }}>Billable</th>
    //                             </tr>
    //                         </thead>
    //                         <tbody>
    //                             {bulkRows.map((row: BulkRow, index: number) => (
    //                                 <tr key={index}>
    //                                     <td>
    //                                         <input
    //                                             type="date"
    //                                             className="form-control form-control-sm border-0 item-input"
    //                                             value={row.date || ""}
    //                                             onChange={(e) => handleRowChange(index, "date", e.target.value)}
    //                                         />
    //                                     </td>
    //                                     <td>
    //                                         <select
    //                                             className="form-select form-control-sm border-0 item-input"
    //                                             value={row.account || ""}
    //                                             onChange={(e) => handleRowChange(index, "account", e.target.value)}
    //                                         >
    //                                             <option value="">Select account</option>
    //                                             <option>IT and Internet Expenses</option>
    //                                             <option>Office Supplies</option>
    //                                             <option>Travel Expenses</option>
    //                                         </select>
    //                                     </td>
    //                                     <td>
    //                                         <input
    //                                             type="number"
    //                                             className="form-control form-control-sm border-0 item-input text-end"
    //                                             placeholder="0.00"
    //                                             value={row.amount || ""}
    //                                             onChange={(e) => handleRowChange(index, "amount", e.target.value)}
    //                                         />
    //                                     </td>
    //                                     <td>
    //                                         <select
    //                                             className="form-select form-control-sm border-0 item-input"
    //                                             value={row.paidThrough || ""}
    //                                             onChange={(e) => handleRowChange(index, "paidThrough", e.target.value)}
    //                                         >
    //                                             <option value="">Select account</option>
    //                                             <option>Cash</option>
    //                                             <option>Bank</option>
    //                                             <option>Credit Card</option>
    //                                         </select>
    //                                     </td>
    //                                     <td>
    //                                         <select
    //                                             className="form-select form-control-sm border-0 item-input"
    //                                             value={row.vendor || ""}
    //                                             onChange={(e) => handleRowChange(index, "vendor", e.target.value)}
    //                                         >
    //                                             <option value="">Select vendor</option>
    //                                             <option value="vendor1">Vendor 1</option>
    //                                             <option value="vendor2">Vendor 2</option>
    //                                         </select>
    //                                     </td>
    //                                     <td>
    //                                         <select
    //                                             className="form-select form-control-sm border-0 item-input"
    //                                             value={row.customer || ""}
    //                                             onChange={(e) => handleRowChange(index, "customer", e.target.value)}
    //                                         >
    //                                             <option value="">Select customer</option>
    //                                             <option value="customer1">Customer 1</option>
    //                                             <option value="customer2">Customer 2</option>
    //                                         </select>
    //                                     </td>
    //                                     <td>
    //                                         <select
    //                                             className="form-select form-control-sm border-0 item-input"
    //                                             value={row.project || ""}
    //                                             onChange={(e) => handleRowChange(index, "project", e.target.value)}
    //                                         >
    //                                             <option value="">None</option>
    //                                             <option value="project1">Project Alpha</option>
    //                                             <option value="project2">Project Beta</option>
    //                                         </select>
    //                                     </td>
    //                                     <td className="text-center">
    //                                         <input
    //                                             type="checkbox"
    //                                             className="form-check-input m-1"
    //                                             checked={row.billable || false}
    //                                             onChange={(e) => handleRowChange(index, "billable", e.target.checked)}
    //                                         />
    //                                     </td>
    //                                 </tr>
    //                             ))}
    //                         </tbody>
    //                     </table>

    //                     <button
    //                         type="button"
    //                         className="btn btn-sm fw-bold item-add-row-btn"
    //                         onClick={onAddRow}
    //                     >
    //                         <PlusCircle size={16} className="me-1" /> Add New Row
    //                     </button>
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
    // );

    const renderBulkAddExpenses = () => (
        <div className="sales-orders-page">
            <form onSubmit={handleBulkSubmit} className="sales-order-form">
                <div className="so-details-card mx-5 mb-5">
                    <h1 className="sales-order-title mb-2">Bulk Add Expenses</h1>

                    <p className="text-muted mb-4" style={{ fontSize: "14px" }}>
                        Enter multiple expenses below. Required fields are marked with <span className="text-danger">*</span>.
                    </p>

                    {/* ONE CARD PER EXPENSE ROW */}
                    {bulkRows.map((row: BulkRow, index: number) => (
                        <div
                            key={index}
                            className="mb-3 border rounded-3 px-4 py-3 position-relative"
                            style={{ backgroundColor: "#fdf7fbff" }}
                        >
                            {/* Header: label + delete button */}
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <span className="fw-semibold small text-muted">
                                    Expense #{index + 1}
                                </span>

                                {bulkRows.length > 1 && (
                                    <button
                                        type="button"
                                        className="btn btn-link text-danger text-decoration-none p-0 d-inline-flex align-items-center"
                                        onClick={() => handleRemoveRow(index)}
                                        aria-label="Delete expense row"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>


                            {/* Row 1: Date / Expense Account / Amount */}
                            <div className="row g-3 mb-2">
                                <div className="col-md-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Date<span className="text-danger">*</span>:
                                    </label>
                                    <input
                                        type="date"
                                        className="form-control so-control"
                                        value={row.date || ""}
                                        onChange={(e) => handleRowChange(index, "date", e.target.value)}
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Expense Account<span className="text-danger">*</span>:
                                    </label>
                                    <select
                                        className="form-select so-control"
                                        value={row.account || ""}
                                        onChange={(e) => handleRowChange(index, "account", e.target.value)}
                                    >
                                        <option value="">Select account</option>
                                        <option>IT and Internet Expenses</option>
                                        <option>Office Supplies</option>
                                        <option>Travel Expenses</option>
                                    </select>
                                </div>

                                <div className="col-md-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Amount<span className="text-danger">*</span>:
                                    </label>
                                    <input
                                        type="number"
                                        className="form-control so-control text-end"
                                        placeholder="0.00"
                                        value={row.amount || ""}
                                        onChange={(e) => handleRowChange(index, "amount", e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Row 2: Paid Through / Vendor / Customer Name */}
                            <div className="row g-3 mb-2">
                                <div className="col-md-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Paid Through<span className="text-danger">*</span>:
                                    </label>
                                    <select
                                        className="form-select so-control"
                                        value={row.paidThrough || ""}
                                        onChange={(e) => handleRowChange(index, "paidThrough", e.target.value)}
                                    >
                                        <option value="">Select account</option>
                                        <option>Cash</option>
                                        <option>Bank</option>
                                        <option>Credit Card</option>
                                    </select>
                                </div>

                                <div className="col-md-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Vendor:
                                    </label>
                                    <select
                                        className="form-select so-control"
                                        value={row.vendor || ""}
                                        onChange={(e) => handleRowChange(index, "vendor", e.target.value)}
                                    >
                                        <option value="">Select vendor</option>
                                        <option value="vendor1">Vendor 1</option>
                                        <option value="vendor2">Vendor 2</option>
                                    </select>
                                </div>

                                <div className="col-md-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Customer Name:
                                    </label>
                                    <select
                                        className="form-select so-control"
                                        value={row.customer || ""}
                                        onChange={(e) => handleRowChange(index, "customer", e.target.value)}
                                    >
                                        <option value="">Select customer</option>
                                        <option value="customer1">Customer 1</option>
                                        <option value="customer2">Customer 2</option>
                                    </select>
                                </div>
                            </div>

                            {/* Row 3: Projects + Billable */}
                            <div className="row g-3 align-items-center">
                                <div className="col-md-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Projects:
                                    </label>
                                    <select
                                        className="form-select so-control"
                                        value={row.project || ""}
                                        onChange={(e) => handleRowChange(index, "project", e.target.value)}
                                    >
                                        <option value="">None</option>
                                        <option value="project1">Project Alpha</option>
                                        <option value="project2">Project Beta</option>
                                    </select>
                                </div>

                                <div className="col-md-4 d-flex align-items-center mt-3 mt-md-4 radio-row">
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id={`billable-${index}`}
                                            checked={row.billable || false}
                                            onChange={(e) =>
                                                handleRowChange(index, "billable", e.target.checked)
                                            }
                                        />
                                        <label
                                            className="form-check-label ms-2 text-sm text-muted-foreground"
                                            htmlFor={`billable-${index}`}
                                        >
                                            Billable
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Add new expense row */}
                    <div
                        className="rounded-3 py-2 px-4 mt-3 d-flex justify-content-center"
                        onClick={(e) => {
                            e.stopPropagation();      // just in case wrapper ever gets an onClick again
                            onAddRow();               // ✅ single call
                        }}
                        style={{
                            border: "1px dashed #D0D5DD",
                            backgroundColor: "#FBFBFD",
                            cursor: "pointer",
                        }}
                        // ❌ remove onClick={onAddRow}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.border = "1px dashed #3B82F6"; // blue-500
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.border = "1px dashed #D0D5DD";
                        }}
                    >
                        <button
                            type="button"
                            className="btn btn-link text-decoration-none d-inline-flex align-items-center m-0 p-0 small"

                        >
                            <Plus size={15} className="me-2" />
                            <span>Add New Expense Row</span>
                        </button>
                    </div>

                </div>

                {/* Bottom buttons – reuse sales order actions */}
                <div className="mx-5 mb-5">
                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn border me-3 px-4"
                            onClick={() => navigate(-1)}
                        >
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
        }
    ];


    return (
        <>
            <Header />
            <div className="sales-orders-page" style={{ paddingTop: "56px" }}>
                <div className="ps-4">
                    <Tabs
                        tabs={tabs}
                        defaultActiveKey="record-expense"
                        onChange={setActiveKey}
                    />
                </div>

                <div className="">
                    {tabs.find((t) => t.key === activeTab)?.content}
                </div>
            </div>

            {showRateModal && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100"
                    style={{
                        backgroundColor: "rgba(0,0,0,0.25)",
                        zIndex: 1050
                    }}
                    onClick={() => setShowRateModal(false)}
                >
                    <div
                        className="bg-white shadow rounded"
                        style={{
                            width: 320,
                            padding: "16px 16px 20px",
                            position: "absolute",
                            top: "20%",
                            left: "50%",
                            transform: "translateX(-50%)"
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="mb-0">Edit Mileage Rate</h6>
                            <button
                                type="button"
                                className="btn-close"
                                aria-label="Close"
                                onClick={() => setShowRateModal(false)}
                            />
                        </div>

                        <label className="so-label text-sm text-muted-foreground fw-bold mb-1">
                            Mileage rate (in INR)<span className="text-danger">*</span>
                        </label>
                        <input
                            type="number"
                            className="form-control so-control mb-3"
                            value={mileageRate}
                            onChange={e => setMileageRate(Number(e.target.value) || 0)}
                        />

                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => setShowRateModal(false)}
                        >
                            Save
                        </button>
                    </div>
                </div>
            )}

        </>

    );
};

export default AddExpense;
