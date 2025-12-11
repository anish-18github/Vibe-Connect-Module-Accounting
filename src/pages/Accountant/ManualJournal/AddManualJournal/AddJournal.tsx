import { useNavigate } from "react-router-dom";
import { PlusCircle, X } from "react-feather";
import Header from "../../../../components/Header/Header";
import React, { useState } from "react";
import './addJournal.css'
import { FeatherUpload } from "../../../Sales/Customers/AddCustomer/Add";
// Journal entry row interface
interface JournalRow {
    account: string;        // 1️⃣ SELECT
    description: string;    // 2️⃣ TEXT INPUT
    contact: string;        // 3️⃣ SELECT
    debit: number | string; // 4️⃣ TEXT INPUT (no placeholder)
    credit: number | string;// 5️⃣ TEXT INPUT (no placeholder)
}

export default function AddJournal() {
    const navigate = useNavigate();

    // Main form state
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0], // Current date
        journal: "",
        reference: "",
        notes: "",
        isCashBased: false,
        currency: "",
    });

    // ✅ 2 DEFAULT ROWS for journal entries
    const [journalRows, setJournalRows] = useState<JournalRow[]>([
        { account: "", description: "", contact: "", debit: "", credit: "" }, // Row 1
        { account: "", description: "", contact: "", debit: "", credit: "" }  // Row 2
    ]);

    // Calculate totals from table
    const debitTotal = journalRows.reduce((sum, row) => {
        const num = Number(row.debit) || 0;
        return sum + num;
    }, 0);

    const creditTotal = journalRows.reduce((sum, row) => {
        const num = Number(row.credit) || 0;
        return sum + num;
    }, 0);

    const difference = debitTotal - creditTotal; // positive = more debit, negative = more credit


    const currencies = ['USD - US Dollar', 'EUR - Euro', 'INR - Indian Rupee'];

    // Account options for SELECT
    const accounts = [
        { value: "", label: "Select Account" },
        { value: "cash", label: "Cash Account" },
        { value: "bank", label: "Bank Account" },
        { value: "sales", label: "Sales Account" },
        { value: "purchase", label: "Purchase Account" },
        { value: "expense", label: "Expense Account" }
    ];

    // Contact options for SELECT
    const contacts = [
        { value: "", label: "Select Contact" },
        { value: "customer1", label: "Customer A" },
        { value: "customer2", label: "Customer B" },
        { value: "vendor1", label: "Vendor X" },
        { value: "vendor2", label: "Vendor Y" },
        { value: "employee1", label: "Employee Z" }
    ];

    // Handle main form changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle checkbox
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, isCashBased: e.target.checked }));
    };

    // Handle table row changes
    const handleRowChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setJournalRows(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [name]: value };
            return updated;
        });
    };

    // Add new journal row
    const addJournalRow = () => {
        setJournalRows(prev => [...prev, { account: "", description: "", contact: "", debit: "", credit: "" }]);
    };

    // Remove journal row (minimum 2 rows)
    const removeJournalRow = (index: number) => {
        if (journalRows.length > 2) { // ✅ Keep minimum 2 rows
            setJournalRows(prev => prev.filter((_, i) => i !== index));
        }
    };

    // Handle form submit
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Journal Data:", { formData, journalRows });
        // Save to localStorage or API
        navigate(-1);
    };

    return (
        <>
            <Header />

            <div style={{ padding: "69px 1.8rem 0 1.8rem" }}>
                <h1 className="h4 text-dark mb-4 pb-1">Manual Journal</h1>

                <form onSubmit={handleSubmit} className="mt-4" style={{ color: "#5E5E5E" }}>

                    {/* TWO COLUMN LAYOUT FOR FORM FIELDS */}
                    <div className="row mb-4">
                        {/* COLUMN 1: Date + Journal */}
                        <div className="col-lg-4">
                            {/* Date */}
                            <div className="row align-items-center mb-3">
                                <label className="col-sm-3 col-form-label">Date:</label>
                                <div className="col-sm-5">
                                    <input
                                        type="date"
                                        name="date"
                                        className="form-control form-control-sm border"
                                        value={formData.date}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Journal */}
                            <div className="row align-items-center mb-3">
                                <label className="col-sm-3 col-form-label">Journal:</label>
                                <div className="col-sm-7">
                                    <input
                                        type="text"
                                        name="journal"
                                        value={formData.journal}
                                        onChange={handleChange}
                                        className="form-control form-control-sm border"
                                        placeholder="Enter journal name"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* COLUMN 2: Reference + Notes */}
                        <div className="col-lg-4">
                            {/* Reference */}
                            <div className="row align-items-center mb-3">
                                <label className="col-sm-3 col-form-label">Reference:</label>
                                <div className="col-sm-8">
                                    <input
                                        type="text"
                                        name="reference"
                                        value={formData.reference}
                                        onChange={handleChange}
                                        className="form-control form-control-sm border"
                                        placeholder="Enter reference"
                                    />
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="row align-items-center mb-3">
                                <label className="col-sm-3 col-form-label">Notes:</label>
                                <div className="col-sm-8">
                                    <input
                                        type="text"
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleChange}
                                        className="form-control form-control-sm border"
                                        placeholder="Enter notes"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* COLUMN 3: Journal Type + Currency */}
                        <div className="col-lg-4">
                            {/* Cash Based Journal Checkbox */}
                            <div className="row align-items-center mb-3">
                                <label className="col-sm-4 col-form-label pt-1">Journal Type:</label>
                                <div className="col-sm-8">
                                    <label className="form-check-label d-flex align-items-center">
                                        <input
                                            type="checkbox"
                                            className="form-check-input me-2"
                                            checked={formData.isCashBased}
                                            onChange={handleCheckboxChange}
                                        />
                                        Cash Based Journal
                                    </label>
                                </div>
                            </div>

                            {/* Currency */}
                            <div className="row align-items-center mb-3">
                                <label className="col-sm-4 col-form-label">Currency:</label>
                                <div className="col-sm-6">
                                    <select
                                        name="currency"
                                        value={formData.currency}
                                        onChange={handleChange}
                                        className="form-select form-control-sm border"
                                    >
                                        <option value="" disabled>-- Select Currency --</option>
                                        {currencies.map((c, i) => (
                                            <option key={i} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* ✅ JOURNAL ENTRIES TABLE - 2 DEFAULT ROWS (unchanged) */}
                    <div className="mb-4">
                        <h5 className="mb-3">Journal Entries</h5>
                        <div className="row">
                            <div className="col-md-12">
                                <table className="table table-bordered table-sm align-middle table-rounded">
                                    <thead className="bg-light">
                                        <tr>
                                            <th className="fw-normal" style={{ width: "20%" }}>Account</th>
                                            <th className="fw-normal" style={{ width: "25%" }}>Description</th>
                                            <th className="fw-normal" style={{ width: "15%" }}>Contact</th>
                                            <th className="fw-normal" style={{ width: "20%" }}>Debit</th>
                                            <th className="fw-normal" style={{ width: "20%" }}>Credit</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {journalRows.map((row, index) => (
                                            <tr key={index} className="position-relative">
                                                <td>
                                                    <select
                                                        name="account"
                                                        className="form-select form-control-sm border-0"
                                                        value={row.account}
                                                        onChange={(e) => handleRowChange(index, e as any)}
                                                    >
                                                        {accounts.map((option) => (
                                                            <option key={option.value} value={option.value}>
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        name="description"
                                                        className="form-control form-control-sm border-0"
                                                        value={row.description}
                                                        onChange={(e) => handleRowChange(index, e)}
                                                    />
                                                </td>
                                                <td>
                                                    <select
                                                        name="contact"
                                                        className="form-select form-control-sm border-0"
                                                        value={row.contact}
                                                        onChange={(e) => handleRowChange(index, e as any)}
                                                    >
                                                        {contacts.map((option) => (
                                                            <option key={option.value} value={option.value}>
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        name="debit"
                                                        className="form-control form-control-sm border-0"
                                                        value={row.debit}
                                                        onChange={(e) => handleRowChange(index, e)}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        name="credit"
                                                        className="form-control form-control-sm border-0"
                                                        value={row.credit}
                                                        onChange={(e) => handleRowChange(index, e)}
                                                    />
                                                </td>
                                                <td className="text-center">
                                                    <button
                                                        className="border-0 bg-body text-danger"
                                                        type="button"
                                                        onClick={() => removeJournalRow(index)}
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <button
                                    type="button"
                                    className="btn btn-sm fw-normal mt-2"
                                    onClick={addJournalRow}
                                    style={{
                                        color: "#5E5E5E",
                                        border: "1px solid #D9D9D9"
                                    }}
                                >
                                    <PlusCircle size={18} style={{ color: "#878787" }} /> Add Entry
                                </button>

                                {/* Row: left = Upload, right = Summary (unchanged) */}
                                <div className="row mt-4">
                                    <div className="col-md-6 mb-3">
                                        <div className="row mb-0">
                                            <label className="col-sm-3 col-form-label d-flex align-items-center">
                                                Documents:
                                            </label>
                                            <div className="col-sm-9">
                                                <div
                                                    onClick={() => document.getElementById("fileUploadInput")?.click()}
                                                    className="d-flex flex-column align-items-center justify-content-center w-100 p-4 bg-light cursor-pointer"
                                                    style={{
                                                        minHeight: "100px",
                                                        border: "2px dotted #D9D9D9",
                                                        borderRadius: "8px",
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
                                    </div>
                                    <div className="col-md-6 mb-3 d-flex justify-content-end">
                                        <div
                                            className="total-box p-3 w-100"
                                            style={{
                                                minWidth: "260px",
                                                backgroundColor: "#F8F8F8",
                                                borderRadius: "12px",
                                            }}
                                        >
                                            <div className="d-flex justify-content-between mb-2">
                                                <span>Sub Total</span>
                                                <span>{debitTotal.toFixed(2)}</span>
                                                <span>{creditTotal.toFixed(2)}</span>
                                            </div>
                                            <div className="d-flex justify-content-between mb-2">
                                                <strong>Total (₹)</strong>
                                                <strong>{debitTotal.toFixed(2)}</strong>
                                                <strong>{creditTotal.toFixed(2)}</strong>
                                            </div>
                                            <div className="d-flex justify-content-between mt-2">
                                                <span style={{ color: "#d9534f" }}>Difference</span>
                                                <span style={{ color: "#d9534f" }}>{difference.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Buttons (unchanged) */}
                    <div className="d-flex justify-content-center mt-4 pt-4 border-top">
                        <button type="button" className="btn border me-3 px-4" onClick={() => navigate(-1)}>
                            Cancel
                        </button>
                        <button type="submit" className="btn px-4" style={{ background: "#7991BB", color: "#FFF" }}>
                            Save Journal
                        </button>
                    </div>
                </form>

            </div>
        </>
    );
}
