import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../../components/Header/Header";
import { Info, Settings, X } from "react-feather";
import './addInvoice.css'
import ItemTable, {
    SummaryBox,
    type TcsOption,
} from "../../../../components/Table/ItemTable/ItemTable";
import { FeatherUpload } from "../../Customers/AddCustomer/Add";

interface ItemRow {
    itemDetails: string;
    quantity: number | string;
    rate: number | string;
    discount: number | string;
    amount: number | string;
}

interface InvoiceForm {
    invoice: {
        customerName: string;
        invoiceNo: string;
        invoiceDate: string;
        dueDate: string;
        paymentTerms: string;
        salesperson: string;
        customerNotes: string;
        termsAndConditions: string;
    };
    itemTable: ItemRow[];
}

type TaxType = "TDS" | "TCS" | "";

export default function AddInvoice() {
    const navigate = useNavigate();

    // ---------------- Modal + Settings ----------------
    const [showSettings, setShowSettings] = useState(false);
    const [closing, setClosing] = useState(false);
    const [mode, setMode] = useState<"auto" | "manual">("auto");
    const [prefix, setPrefix] = useState("");
    const [nextNumber, setNextNumber] = useState("");
    const [restartYear, setRestartYear] = useState(false);

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
    const [formData, setFormData] = useState<InvoiceForm>({
        invoice: {
            customerName: "",
            invoiceNo: "",
            invoiceDate: "",
            dueDate: "",
            paymentTerms: "",
            salesperson: "",
            customerNotes: "",
            termsAndConditions: "",
        },
        itemTable: [
            {
                itemDetails: "",
                quantity: "",
                rate: "",
                discount: "",
                amount: "",
            },
        ],
    });

    // ---------------- TCS Options ----------------
    const [tcsOptions, setTcsOptions] = useState<TcsOption[]>([
        { id: "tcs_5", name: "TCS Standard", rate: 5 },
        { id: "tcs_12", name: "TCS Standard", rate: 12 },
        { id: "tcs_18", name: "TCS Standard", rate: 18 },
    ]);

    // ---------------- Tax & Totals ----------------
    const [taxInfo, setTaxInfo] = useState({
        type: "" as TaxType,
        selectedTax: "",
        adjustment: 0,
        taxRate: 0,
        taxAmount: 0,
        total: 0,
    });

    const [totals, setTotals] = useState({
        subtotal: 0,
        tax: 0,
        total: 0,
        grandTotal: 0,
    });

    const computeSubtotal = (items: ItemRow[]) => {
        return items.reduce((acc, r) => {
            const amt = parseFloat(String(r.amount || "0")) || 0;
            return acc + amt;
        }, 0);
    };

    useEffect(() => {
        const subtotal = computeSubtotal(formData.itemTable);

        let rate = 0;

        if (taxInfo.type === "TDS") {
            rate = Number(taxInfo.selectedTax);
        } else if (taxInfo.type === "TCS") {
            const opt = tcsOptions.find((o) => o.id === taxInfo.selectedTax);
            rate = opt ? opt.rate : 0;
        }

        const taxAmount = +(subtotal * (rate / 100));

        const grand =
            taxInfo.type === "TDS"
                ? subtotal - taxAmount + Number(taxInfo.adjustment || 0)
                : subtotal + taxAmount + Number(taxInfo.adjustment || 0);

        setTaxInfo((prev) => ({
            ...prev,
            taxRate: rate,
            taxAmount,
            total: grand,
        }));

        setTotals({
            subtotal,
            tax: taxAmount,
            total: grand,
            grandTotal: grand,
        });
    }, [
        formData.itemTable,
        taxInfo.type,
        taxInfo.selectedTax,
        taxInfo.adjustment,
        tcsOptions,
    ]);

    // ---------------- Handlers ----------------
    const handleTaxChange = (field: any, value: any) => {
        setTaxInfo((prev) => ({ ...prev, [field]: value }));
    };

    const handleAddTcs = (opt: TcsOption) => {
        setTcsOptions((prev) => [...prev, opt]);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            invoice: { ...prev.invoice, [name]: value },
        }));
    };

    const handleAddRow = () => {
        setFormData((prev) => ({
            ...prev,
            itemTable: [
                ...prev.itemTable,
                { itemDetails: "", quantity: "", rate: "", discount: "", amount: "" },
            ],
        }));
    };

    const handleRemoveRow = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            itemTable: prev.itemTable.filter((_, i) => i !== index),
        }));
    };

    const handleRowChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => {
            const updated = [...prev.itemTable];
            const row = { ...updated[index] };
            row[name as keyof ItemRow] = value;

            const qty = parseFloat(String(row.quantity || "0")) || 0;
            const rate = parseFloat(String(row.rate || "0")) || 0;
            const discount = parseFloat(String(row.discount || "0")) || 0;

            const before = qty * rate;
            const final = before - (before * discount) / 100;

            row.amount = final ? final.toFixed(2) : "";

            updated[index] = row;
            return { ...prev, itemTable: updated };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const finalPayload = {
            ...formData,
            totals,
            taxInfo,
            invoiceId: Math.floor(100000 + Math.random() * 900000),
            createdOn: new Date().toISOString().split("T")[0],
            createdBy: "Admin",
        };

        const existing = JSON.parse(localStorage.getItem("invoices") || "[]");
        existing.push(finalPayload);
        localStorage.setItem("invoices", JSON.stringify(existing));

        navigate("/sales/invoices");
    };

    const applyAutoInvoice = () => {
        if (mode === "auto") {
            setFormData((prev) => ({
                ...prev,
                invoice: { ...prev.invoice, invoiceNo: prefix + nextNumber },
            }));
        }
        closePopup();
    };

    // ---------------- UI ----------------
    return (
        <>
            <Header />

            <div className="sales-orders-page" style={{ padding: "0 1.8rem" }}>
                <h1 className="h4 text-dark mb-4 pb-1">Invoice</h1>

                <form onSubmit={handleSubmit} className="mt-4" style={{ color: "#5E5E5E" }}>
                    <div className="two-column-form">
                        <div className="left-column">

                            <div className="form-row">
                                <label>Customer Name:</label>
                                <select
                                    className="form-select form-control-sm"
                                    name="customerName"
                                    value={formData.invoice.customerName}
                                    onChange={handleChange}
                                >
                                    <option value="" disabled>Select Customer</option>
                                    <option value="Customer A">Customer A</option>
                                    <option value="Customer B">Customer B</option>
                                </select>
                            </div>

                            <div className="form-row">
                                <label>Invoice Date:</label>
                                <input
                                    type="date"
                                    name="invoiceDate"
                                    className="form-control form-control-sm"
                                    value={formData.invoice.invoiceDate}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-row">
                                <label>Payment Terms:</label>
                                <select
                                    name="paymentTerms"
                                    className="form-select form-control-sm"
                                    value={formData.invoice.paymentTerms}
                                    onChange={handleChange}
                                >
                                    <option value="" disabled>Select</option>
                                    <option value="Advance">Advance</option>
                                    <option value="Net 15">Net 15</option>
                                    <option value="Net 30">Net 30</option>
                                </select>
                            </div>
                        </div>

                        <div className="right-column">
                            <div className="form-row" style={{ position: "relative" }}>
                                <label>Invoice No:</label>
                                <input
                                    type="text"
                                    name="invoiceNo"
                                    className="form-control form-control-sm"
                                    value={formData.invoice.invoiceNo}
                                    onChange={handleChange}
                                    style={{ paddingRight: "35px" }}
                                />
                                <div
                                    onClick={() => setShowSettings(true)}
                                    style={{
                                        position: "absolute",
                                        right: "12px",
                                        top: "65%",
                                        transform: "translateY(-85%)",
                                        cursor: "pointer",
                                    }}
                                >
                                    <Settings size={16} />
                                </div>
                            </div>

                            <div className="form-row">
                                <label>Due Date:</label>
                                <input
                                    type="date"
                                    name="dueDate"
                                    className="form-control form-control-sm"
                                    value={formData.invoice.dueDate}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-row">
                                <label>Salesperson:</label>
                                <select
                                    name="salesperson"
                                    className="form-select form-control-sm"
                                    value={formData.invoice.salesperson}
                                    onChange={handleChange}
                                >
                                    <option value="" disabled>Select Salesperson</option>
                                    <option value="John">John</option>
                                    <option value="Maria">Maria</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Item Table */}
                    <h5
                        className="mt-4 fw-normal"
                        style={{
                            width: "100%",
                            backgroundColor: "#EEEEEE",
                            padding: "6px",
                            borderRadius: "5px",
                            border: "1px solid #D9D9D9",
                            color: "#5E5E5E",
                        }}
                    >
                        Item Table
                    </h5>

                    <ItemTable
                        rows={formData.itemTable}
                        onRowChange={handleRowChange}
                        onAddRow={handleAddRow}
                        onRemoveRow={handleRemoveRow}
                    />

                    {/* Notes + Summary */}
                    <div
                        className="notes-summary-row"
                        style={{ display: "flex", gap: 5, marginTop: 18 }}
                    >
                        <div style={{ width: "50%" }}>
                            <div className="mb-3">
                                <label className="form-label">Customer Notes:</label>
                                <textarea
                                    name="customerNotes"
                                    className="form-control form-control-sm"
                                    style={{ resize: "none", height: "90px" }}
                                    value={formData.invoice.customerNotes}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Terms & Conditions:</label>
                                <textarea
                                    name="termsAndConditions"
                                    className="form-control form-control-sm"
                                    style={{ resize: "none", height: "90px" }}
                                    value={formData.invoice.termsAndConditions}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div style={{ width: "50%" }}>
                            <SummaryBox
                                totals={totals}
                                taxInfo={taxInfo}
                                onTaxChange={handleTaxChange}
                                tcsOptions={tcsOptions}
                                onAddTcs={handleAddTcs}
                            />
                        </div>
                    </div>

                    {/* Documents */}
                    <div className="row mt-4 mb-4">
                        <label className="col-sm-1 col-form-label">Documents:</label>
                        <div className="col-sm-11">
                            <div
                                onClick={() =>
                                    document.getElementById("fileUploadInput")?.click()
                                }
                                className="d-flex flex-column align-items-center justify-content-center w-100 p-4 bg-light"
                                style={{
                                    minHeight: "120px",
                                    border: "2px dotted #a0a0a0",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                }}
                            >
                                <FeatherUpload size={28} className="text-muted mb-2" />
                                <span className="text-secondary small">
                                    Click to Upload Documents
                                </span>

                                <input
                                    id="fileUploadInput"
                                    type="file"
                                    multiple
                                    className="d-none"
                                    onChange={(e) => {
                                        const files = e.target.files;
                                        if (files?.length) {
                                            alert(`${files.length} file(s) selected!`);
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="d-flex justify-content-center mt-4 pt-4 border-top">
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
                            <h4 className="mb-0 p-4">
                                Configure Invoice Number Preferences
                            </h4>
                            <X
                                size={20}
                                style={{ cursor: "pointer", marginRight: "15px" }}
                                onClick={closePopup}
                            />
                        </div>

                        <div className="modal-body mt-3">
                            <p style={{ fontSize: "14px", color: "#555" }}>
                                Your Invoices are currently set to auto-generate numbers.
                                Change settings if needed.
                            </p>

                            {/* Auto mode */}
                            <div className="form-check mb-3">
                                <input
                                    type="radio"
                                    name="mode"
                                    className="form-check-input"
                                    checked={mode === "auto"}
                                    onChange={() => setMode("auto")}
                                />
                                <label className="form-check-label">
                                    Continue auto-generating Invoice Numbers
                                </label>
                                <Info size={18} className="ms-2" />
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
                                                placeholder="INV-"
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

                            {/* Manual mode */}
                            <div className="form-check mt-4">
                                <input
                                    type="radio"
                                    name="mode"
                                    className="form-check-input"
                                    checked={mode === "manual"}
                                    onChange={() => setMode("manual")}
                                />
                                <label className="form-check-label">
                                    Enter Invoice Numbers manually
                                </label>
                            </div>

                            <div className="d-flex justify-content-end mt-4" style={{ gap: 10 }}>
                                <button className="btn btn-outline-secondary" onClick={closePopup}>
                                    Cancel
                                </button>
                                <button className="btn btn-primary px-4" onClick={applyAutoInvoice}>
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
