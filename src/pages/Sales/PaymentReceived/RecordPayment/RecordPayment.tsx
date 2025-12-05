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

            <div className="sales-orders-page" style={{ padding: "0 1.8rem" }}>
                <h1 className="h4 text-dark mb-4 pb-1">Record Payment</h1>

                <form onSubmit={handleSubmit} className="mt-4" style={{ color: "#5E5E5E" }}>

                    <div className="two-column-form">

                        {/* ---------------- LEFT COLUMN ---------------- */}
                        <div className="left-column">

                            {/* Customer Name */}
                            <div className="form-row">
                                <label>Customer Name:</label>
                                <select
                                    name="customerName"
                                    value={formData.customerName}
                                    onChange={handleChange}
                                    className="form-select form-control-sm"
                                >
                                    <option value="" disabled>Select Customer</option>
                                    <option value="Customer A">Customer A</option>
                                    <option value="Customer B">Customer B</option>
                                </select>
                            </div>

                            {/* Payment Mode */}
                            <div className="form-row">
                                <label>Payment Mode:</label>
                                <select
                                    name="paymentMode"
                                    value={formData.paymentMode}
                                    onChange={handleChange}
                                    className="form-select form-control-sm"
                                >
                                    <option value="" disabled>Select Mode</option>
                                    <option value="Cash">Cash</option>
                                    <option value="Bank Transfer">Bank Transfer</option>
                                    <option value="UPI">UPI</option>
                                    <option value="Cheque">Cheque</option>
                                </select>
                            </div>

                            {/* Tax Deducted */}
                            <div className="form-row mt-3">
                                <label style={{ fontWeight: 500 }}>Tax Deducted:</label>

                                <div className="d-flex flex-column mt-2">
                                    <label style={{ fontSize: "14px" }}>
                                        <input
                                            type="radio"
                                            name="taxDeducted"
                                            value="no"
                                            checked={formData.taxDeducted === "no"}
                                            onChange={handleChange}
                                            className="me-2"
                                        />
                                        No tax deducted
                                    </label>

                                    <label style={{ fontSize: "14px" }} className="mt-2">
                                        <input
                                            type="radio"
                                            name="taxDeducted"
                                            value="yes"
                                            checked={formData.taxDeducted === "yes"}
                                            onChange={handleChange}
                                            className="me-2"
                                        />
                                        Yes, TDS (Income Tax)
                                    </label>
                                </div>
                            </div>

                            {/* TDS Dropdown */}
                            {formData.taxDeducted === "yes" && (
                                <div className="form-row mt-2">
                                    <label>TDS Tax Amount (%):</label>
                                    <select
                                        name="tdsRate"
                                        value={formData.tdsRate}
                                        onChange={handleChange}
                                        className="form-control"
                                    >
                                        <option value="">Select TDS Rate</option>
                                        <option value="1">1%</option>
                                        <option value="5">5%</option>
                                        <option value="10">10%</option>
                                    </select>
                                </div>
                            )}
                        </div>

                        {/* ---------------- RIGHT COLUMN ---------------- */}
                        <div className="right-column">

                            {/* Amount Received */}
                            <div className="form-row">
                                <label>Amount Received:</label>

                                <div className="amount-input-wrapper">
                                    <input
                                        type="number"
                                        name="amountReceived"
                                        className="form-control"
                                        style={noSpinnerStyle}
                                        value={formData.amountReceived}
                                        onChange={handleChange}
                                    />

                                    <label className="full-received-checkbox">
                                        <input type="checkbox" className="me-2" />
                                        Received full amount
                                    </label>
                                </div>
                            </div>

                            {/* Payment Date */}
                            <div className="form-row">
                                <label>Payment Date:</label>
                                <input
                                    type="date"
                                    name="paymentDate"
                                    className="form-control"
                                    value={formData.paymentDate}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Payment ID */}
                            <div className="form-row" style={{ position: "relative" }}>
                                <label>Sales Order No:</label>
                                <input
                                    type="text"
                                    name="paymentId"
                                    className="form-control"
                                    value={formData.paymentId}
                                    onChange={handleChange}
                                />

                                <div
                                    style={{
                                        position: "absolute",
                                        right: "12px",
                                        top: "65%",
                                        transform: "translateY(-85%)",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => setShowSettings(true)}
                                >
                                    <Settings size={16} style={{ color: "#555" }} />
                                </div>
                            </div>

                            {/* Reference */}
                            <div className="form-row">
                                <label>Reference:</label>
                                <input
                                    type="text"
                                    name="reference"
                                    className="form-control"
                                    value={formData.reference}
                                    onChange={handleChange}
                                />
                            </div>

                        </div>
                    </div>

                    {/* ---------------- PAYMENT USAGE TABLE ---------------- */}

                    <h5
                        className="mt-4 fw-normal"
                        style={{
                            backgroundColor: "#EEEEEE",
                            padding: "6px",
                            borderRadius: "5px",
                            border: "1px solid #D9D9D9",
                            color: "#5E5E5E",
                        }}
                    >
                        Payment Usage Table
                    </h5>

                    <table className="payment-table table table-bordered mt-2">
                        <thead className="table-light">
                            <tr>
                                <th>Date</th>
                                <th>Invoice No.</th>
                                <th>Invoice Amount</th>
                                <th>Amount Due</th>
                                <th>Payment Received On</th>
                                <th>Amount Used</th>
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
                                            className="form-control"
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

                    {/* ---------------- SUMMARY BOX ---------------- */}

                    <div style={{ width: "35%", marginLeft: "auto" }}>
                        <div className="border rounded p-3 mt-3">

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

                    <div style={{ width: "50%" }}>
                        <div className="mb-3">
                            <label className="form-label">Customer Notes:</label>
                            <textarea className="form-control form-control-sm" style={{ resize: "none", height: "90px" }} name="customerNotes" value={formData.customerNotes}
                                onChange={handleChange} />
                        </div>
                    </div>

                    {/* ---------------- BUTTONS ---------------- */}

                    <div className="d-flex justify-content-center mt-4 pt-4 border-top">
                        <button type="button" className="btn border me-3 px-4" onClick={() => navigate(-1)}>
                            Cancel
                        </button>

                        <button type="submit" className="btn px-4" style={{ background: "#7991BB", color: "#FFF" }}>
                            Save Payment
                        </button>
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
