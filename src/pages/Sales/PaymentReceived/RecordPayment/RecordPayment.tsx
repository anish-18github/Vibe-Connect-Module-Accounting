import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../../components/Header/Header";
import "./recordPayment.css";
import { Info, Settings, X } from "react-feather";

// ------------------- Interfaces -------------------

export interface PaymentFormData {
    customerName: string;
    amountReceived: string;
    paymentDate: string;
    paymentId: string;
    paymentMode: string;
    reference: string;
    taxDeducted: "no" | "yes";
    tdsRate: string;
    customerNotes: string;
}

export interface PaymentSummary {
    amountReceived: number;
    amountUsed: number;
    amountRefunded: number;
    amountExcess: number;
}

export interface PaymentUsageRow {
    date: string;
    invoiceNumber: string;
    invoiceAmount: number;
    amountDue: number;
    paymentReceivedOn: string;
    paymentUsed: number;
}

// ------------------- Component -------------------

export default function AddPayment() {
    const navigate = useNavigate();

    const [showSettings, setShowSettings] = useState(false);
    const [mode, setMode] = useState<"auto" | "manual">("auto");
    const [prefix, setPrefix] = useState("");
    const [nextNumber, setNextNumber] = useState("");
    const [restartYear, setRestartYear] = useState(false);
    const [closing, setClosing] = useState(false);

    const closePopup = () => {
        setClosing(true);
        setTimeout(() => {
            setShowSettings(false);
            setClosing(false);
        }, 250);
    };

    useEffect(() => {
        document.body.style.overflow = showSettings ? "hidden" : "auto";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [showSettings]);

    // ---------------- Form State ----------------
    const [formData, setFormData] = useState<PaymentFormData>({
        customerName: "",
        amountReceived: "",
        paymentDate: "",
        paymentId: "",
        paymentMode: "",
        reference: "",
        taxDeducted: "no",
        tdsRate: "",
        customerNotes: "",
    });

    const [usageRows, setUsageRows] = useState<PaymentUsageRow[]>([
        {
            date: "2025-01-01",
            invoiceNumber: "INV-001",
            invoiceAmount: 5000,
            amountDue: 2000,
            paymentReceivedOn: "",
            paymentUsed: 0,
        }
    ]);

    // ---------------- Auto fill today's date ----------------
    useEffect(() => {
        const today = new Date().toISOString().split("T")[0];
        setFormData(prev => ({ ...prev, paymentDate: today }));
    }, []);

    useEffect(() => {
        setUsageRows(prev =>
            prev.map(row => ({
                ...row,
                paymentReceivedOn: formData.paymentDate
            }))
        );
    }, [formData.paymentDate]);

    // ---------------- Handle Input Change ----------------
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {

        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // ---------------- Summary Logic ----------------
    const [summary, setSummary] = useState<PaymentSummary>({
        amountReceived: 0,
        amountUsed: 0,
        amountRefunded: 0,
        amountExcess: 0,
    });

    useEffect(() => {
        const rcv = Number(formData.amountReceived || 0);
        const used = summary.amountUsed;
        const refund = summary.amountRefunded;

        setSummary(prev => ({
            ...prev,
            amountReceived: rcv,
            amountExcess: rcv - used - refund,
        }));
    }, [formData.amountReceived, summary.amountUsed, summary.amountRefunded]);

    // ---------------- Submit ----------------
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        console.log("Payment Saved:", formData, usageRows, summary);

        alert("Payment Saved Successfully!");
        navigate("/payments");
    };

    // ---------------- Apply Auto Payment ID ----------------
    const applyAutoSO = () => {
        if (mode === "auto") {
            setFormData(prev => ({
                ...prev,
                paymentId: prefix + nextNumber,
            }));
        }
        closePopup();
    };

    // ---------------- REMOVE SPINNERS FOR NUMBER INPUT ----------------
    const noSpinnerStyle = {
        MozAppearance: "textfield" as const,
    };

    return (
        <>
            <Header />

            <div className="sales-orders-page">
                <form onSubmit={handleSubmit} className="sales-order-form">
                    {/* TOP DETAILS CARD - 6 fields + radios in 3 columns */}
                    <div className="so-details-card mx-5 mb-4">
                        <h1 className="sales-order-title mb-4">Record Payment</h1>

                        <div className="row g-3 three-column-form">
                            {/* COLUMN 1: Customer + Payment Mode */}
                            <div className="col-lg-4">
                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Customer:
                                    </label>
                                    <select
                                        name="customerName"
                                        className="form-select so-control"
                                        value={formData.customerName}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select Customer</option>
                                        <option value="Customer A">Customer A</option>
                                        <option value="Customer B">Customer B</option>
                                    </select>
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Payment Mode:
                                    </label>
                                    <select
                                        name="paymentMode"
                                        className="form-select so-control"
                                        value={formData.paymentMode}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select Mode</option>
                                        <option value="Cash">Cash</option>
                                        <option value="Bank Transfer">Bank Transfer</option>
                                        <option value="UPI">UPI</option>
                                        <option value="Cheque">Cheque</option>
                                    </select>
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Amount Received:
                                    </label>
                                    <input
                                        type="number"
                                        name="amountReceived"
                                        className="form-control so-control mb-2"
                                        style={noSpinnerStyle}
                                        value={formData.amountReceived}
                                        onChange={handleChange}
                                    />
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            className="me-2 border"
                                            id="fullAmount"
                                        />
                                        <label htmlFor="fullAmount" className="form-check-label small">
                                            Received full amount
                                        </label>
                                    </div>
                                </div>

                            </div>

                            {/* COLUMN 2: Amount Received + Tax Deducted Radios */}
                            <div className="col-lg-4">


                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Tax Deducted:
                                    </label>
                                    <div className="d-flex flex-column gap-2 mt-1">
                                        <div className="form-check form-check-inline">
                                            <input
                                                type="radio"
                                                id="taxNo"
                                                className="form-check-input me-2"
                                                name="taxDeducted"
                                                value="no"
                                                checked={formData.taxDeducted === "no"}
                                                onChange={handleChange}
                                            />
                                            <label htmlFor="taxNo" className="form-check-label small">
                                                No tax deducted
                                            </label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input
                                                type="radio"
                                                id="taxYes"
                                                className="form-check-input me-2"
                                                name="taxDeducted"
                                                value="yes"
                                                checked={formData.taxDeducted === "yes"}
                                                onChange={handleChange}
                                            />
                                            <label htmlFor="taxYes" className="form-check-label small">
                                                Yes, TDS (Income Tax)
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {formData.taxDeducted === "yes" && (
                                    <div className="so-form-group mb-4">
                                        <label className="so-label text-sm text-muted-foreground fw-bold">
                                            TDS Amount (%):
                                        </label>
                                        <select
                                            name="tdsRate"
                                            className="form-select so-control"
                                            value={formData.tdsRate}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select TDS Rate</option>
                                            <option value="1">1%</option>
                                            <option value="5">5%</option>
                                            <option value="10">10%</option>
                                        </select>
                                    </div>
                                )}
                            </div>

                            {/* COLUMN 3: TDS Rate (conditional) + Payment Date + Payment ID + Reference */}
                            <div className="col-lg-4">
                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Payment Date:
                                    </label>
                                    <input
                                        type="date"
                                        name="paymentDate"
                                        className="form-control so-control"
                                        value={formData.paymentDate}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="so-form-group mb-4 position-relative">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Payment ID:
                                    </label>
                                    <input
                                        type="text"
                                        name="paymentId"
                                        className="form-control so-control"
                                        value={formData.paymentId}
                                        onChange={handleChange}
                                        style={{ paddingRight: "35px" }}
                                    />
                                    <span
                                        className="so-settings-icon"
                                        onClick={() => setShowSettings(true)}
                                    >
                                        <Settings size={16} />
                                    </span>
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Reference:
                                    </label>
                                    <input
                                        type="text"
                                        name="reference"
                                        className="form-control so-control"
                                        value={formData.reference}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* OUTSIDE CARD - Custom Payment Usage Table + Summary */}
                    <div className="mx-5">
                        {/* Payment Usage Table */}
                        <div className="item-card mb-4">
                            <div className="item-card-header">
                                <span className="item-card-title">Payment Usage Table</span>
                            </div>
                            <div className="item-card-body">
                                <table className="table table-sm align-middle item-table-inner">
                                    <thead>
                                        <tr>
                                            <th className="fw-medium text-dark">Date</th>
                                            <th className="fw-medium text-dark">Invoice No.</th>
                                            <th className="fw-medium text-dark">Invoice Amount</th>
                                            <th className="fw-medium text-dark">Amount Due</th>
                                            <th className="fw-medium text-dark">Payment Received On</th>
                                            <th className="fw-medium text-dark">Amount Used</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {usageRows.map((row, index) => (
                                            <tr key={index}>
                                                <td>{row.date}</td>
                                                <td>{row.invoiceNumber}</td>
                                                <td>₹ {row.invoiceAmount}</td>
                                                <td>₹ {row.amountDue}</td>
                                                <td>{row.paymentReceivedOn}</td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        style={noSpinnerStyle}
                                                        className="form-control form-control-sm border-0 item-input"
                                                        value={row.paymentUsed}
                                                        onChange={(e) => {
                                                            const updated = [...usageRows];
                                                            updated[index].paymentUsed = Number(e.target.value);
                                                            setUsageRows(updated);
                                                            const totalUsed = updated.reduce(
                                                                (sum, r) => sum + r.paymentUsed,
                                                                0
                                                            );
                                                            setSummary(prev => ({
                                                                ...prev,
                                                                amountUsed: totalUsed
                                                            }));
                                                        }}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Summary + Notes */}
                        <div className="notes-summary-row">
                            <div className="notes-column">
                                <div className="so-form-group">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Customer Notes:
                                    </label>
                                    <textarea
                                        className="form-control so-control textarea"
                                        name="customerNotes"
                                        value={formData.customerNotes}
                                        onChange={handleChange}
                                        placeholder="Add note for customer..."
                                    />
                                </div>
                            </div>

                            <div className="summary-column">
                                <div className="border rounded p-3" style={{ minHeight: "200px" }}>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span>Amount Received:</span>
                                        <strong>₹ {summary.amountReceived}</strong>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span>Amount Used:</span>
                                        <strong>₹ {summary.amountUsed}</strong>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span>Amount Refunded:</span>
                                        <strong>₹ {summary.amountRefunded}</strong>
                                    </div>
                                    <div className="d-flex justify-content-between mt-2 pt-2 border-top">
                                        <span>Amount in Excess:</span>
                                        <strong>₹ {summary.amountExcess}</strong>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="form-actions">
                            <button
                                type="button"
                                className="btn btn-outline-secondary me-3 px-4"
                                onClick={() => navigate(-1)}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn px-4"
                                style={{ background: "#7991BB", color: "#FFF" }}
                            >
                                Save Payment
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* ---------------- Settings Modal ---------------- */}
            {showSettings && (
                <div className="settings-overlay" onClick={closePopup}>
                    <div
                        className={`settings-modal ${closing ? "closing" : "opening"}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header custom-header">
                            <h4 className="mb-0 p-4">Configure Sales Order Number Preferences</h4>
                            <X
                                size={20}
                                style={{ cursor: "pointer", marginRight: "15px" }}
                                onClick={closePopup}
                            />
                        </div>

                        <div className="modal-body mt-3">
                            <p style={{ fontSize: "14px", color: "#555" }}>
                                Your Sales Orders are currently set to auto-generate
                                numbers. Change settings if needed.
                            </p>

                            {/* Auto Mode */}
                            <div className="form-check mb-3">
                                <input
                                    type="radio"
                                    name="mode"
                                    className="form-check-input"
                                    checked={mode === "auto"}
                                    onChange={() => setMode("auto")}
                                />
                                <label className="form-check-label" style={{ fontWeight: 500 }}>
                                    Continue auto-generating Sales Order Numbers
                                </label>
                                <span style={{ marginLeft: "6px", cursor: "pointer" }}>
                                    <Info size={18} />
                                </span>
                            </div>

                            {mode === "auto" && (
                                <div style={{ marginLeft: 25 }}>
                                    <div style={{ display: "flex", gap: 20 }}>
                                        <div style={{ flex: 1 }}>
                                            <label className="form-label">Prefix</label>
                                            <input
                                                value={prefix}
                                                onChange={(e) => setPrefix(e.target.value)}
                                                className="form-control"
                                                placeholder="SO-"
                                            />
                                        </div>

                                        <div style={{ flex: 1 }}>
                                            <label className="form-label">Next Number</label>
                                            <input
                                                value={nextNumber}
                                                onChange={(e) => setNextNumber(e.target.value)}
                                                className="form-control"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-3">
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={restartYear}
                                                onChange={(e) => setRestartYear(e.target.checked)}
                                                className="me-2"
                                            />
                                            Restart numbering every fiscal year.
                                        </label>
                                    </div>
                                </div>
                            )}

                            {/* Manual Mode */}
                            <div className="form-check mt-4">
                                <input
                                    type="radio"
                                    name="mode"
                                    className="form-check-input"
                                    checked={mode === "manual"}
                                    onChange={() => setMode("manual")}
                                />
                                <label className="form-check-label" style={{ fontWeight: 500 }}>
                                    Enter Sales Order Numbers manually
                                </label>
                            </div>

                            <div
                                className="d-flex justify-content-end mt-4"
                                style={{ gap: 10 }}
                            >
                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={closePopup}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-primary px-4"
                                    onClick={applyAutoSO}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </>
    );
}
