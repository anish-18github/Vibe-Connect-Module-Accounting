import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../../components/Header/Header";
import { Info, Settings, X } from "react-feather";
import './addQuote.css';
import ItemTable, { SummaryBox, type TcsOption } from "../../../../components/Table/ItemTable/ItemTable";
import { FeatherUpload } from "../../Customers/AddCustomer/Add";

interface ItemRow {
    itemDetails: string;
    quantity: number | string;
    rate: number | string;
    discount: number | string;
    amount: number | string;
}

interface QuotesForm {
    quote: {
        customerName: string;
        quote: string;
        quoteDate: string;
        expiryDate: string;
        salesPerson: string;
        projectName: string;
        customerNotes: string;
        termsAndConditions: string;
    };
    itemTable: ItemRow[];
}

type TaxType = "TDS" | "TCS" | "";

export default function AddQuotes() {
    const navigate = useNavigate();

    // ------------- modal + small UI state -------------
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

    // ------------- form state -------------
    const [formData, setFormData] = useState<QuotesForm>({
        quote: {
            customerName: "",
            quote: "",
            quoteDate: "",
            expiryDate: "",
            salesPerson: "",
            projectName: "",
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

    // ---------- TCS options (editable by user) ----------
    const [tcsOptions, setTcsOptions] = useState<TcsOption[]>([
        { id: "tcs_5", name: "TCS Standard", rate: 5 },
        { id: "tcs_12", name: "TCS Standard", rate: 12 },
        { id: "tcs_18", name: "TCS Standard", rate: 18 },
    ]);

    // ---------- taxInfo & totals ----------
    const [taxInfo, setTaxInfo] = useState({
        type: "" as TaxType,
        selectedTax: "", // for TDS -> "0.1" | "1" etc ; for TCS -> option id
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

    // ---------- helpers ----------
    const computeSubtotal = (items: ItemRow[]) => {
        return items.reduce((acc, r) => {
            const amt = parseFloat(String(r.amount || "0")) || 0;
            return acc + amt;
        }, 0);
    };

    // update totals whenever items, tax selection, adjustment or tcsOptions change
    useEffect(() => {
        const subtotal = computeSubtotal(formData.itemTable);

        // determine the rate
        let rate = 0;
        if (taxInfo.type === "TDS") {
            rate = Number(taxInfo.selectedTax || 0);
        } else if (taxInfo.type === "TCS") {
            const opt = tcsOptions.find((o) => o.id === taxInfo.selectedTax);
            rate = opt ? opt.rate : 0;
        }

        const taxAmount = +(subtotal * (rate / 100));
        // Option A: TDS deducts, TCS adds
        const grand =
            taxInfo.type === "TDS"
                ? subtotal - taxAmount + Number(taxInfo.adjustment || 0)
                : subtotal + taxAmount + Number(taxInfo.adjustment || 0);

        setTaxInfo((prev) => ({ ...prev, taxRate: rate, taxAmount, total: grand }));
        setTotals({ subtotal, tax: taxAmount, total: grand, grandTotal: grand });
    }, [formData.itemTable, taxInfo.type, taxInfo.selectedTax, taxInfo.adjustment, tcsOptions]);

    // ---------- handlers ----------
    const handleTaxChange = (field: keyof typeof taxInfo | "type", value: any) => {
        setTaxInfo((prev) => ({ ...prev, [field]: value } as any));
    };

    const handleAddTcs = (opt: TcsOption) => {
        setTcsOptions((prev) => [...prev, opt]);
    };

    // Quote fields
    const handleQuoteChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            quote: {
                ...prev.quote,
                [name]: value,
            },
        }));
    };

    // Item table handlers
    const handleAddRow = () => {
        setFormData((prev) => ({
            ...prev,
            itemTable: [
                ...prev.itemTable,
                {
                    itemDetails: "",
                    quantity: "",
                    rate: "",
                    discount: "",
                    amount: "",
                },
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
        type Field = keyof ItemRow;
        const field = name as Field;

        setFormData((prev) => {
            const updated = [...prev.itemTable];
            const row = { ...updated[index] };
            row[field] = value === "" ? "" : value;

            const qty = parseFloat(String(row.quantity || "0")) || 0;
            const rate = parseFloat(String(row.rate || "0")) || 0;
            const discount = parseFloat(String(row.discount || "0")) || 0;
            const beforeDiscount = qty * rate;
            const finalAmount = beforeDiscount - (beforeDiscount * discount) / 100;
            row.amount = finalAmount ? finalAmount.toFixed(2) : "";

            updated[index] = row;
            return { ...prev, itemTable: updated };
        });
    };

    // submit
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const finalPayload = {
            ...formData,
            totals,
            taxInfo,
            quoteId: Math.floor(100000 + Math.random() * 900000),
            createdOn: new Date().toISOString().split("T")[0],
            createdBy: "Admin",
        };

        console.log("Final Payload:", finalPayload);

        const existing = JSON.parse(localStorage.getItem("quotes") || "[]");
        existing.push(finalPayload);
        localStorage.setItem("quotes", JSON.stringify(existing));

        navigate("/sales/quotes");
    };

    // small utility used by Settings modal
    const applyAutoQuote = () => {
        if (mode === "auto") {
            setFormData((prev) => ({
                ...prev,
                quote: {
                    ...prev.quote,
                    quote: prefix + nextNumber,
                },
            }));
        }
        closePopup();
    };

    return (
        <>
            <Header />

            <div style={{ padding: "0 1.8rem" }}>
                <h1 className="h4 text-dark mb-4 pb-1">New Quote</h1>

                <form onSubmit={handleSubmit} className="mt-4" style={{ color: "#5E5E5E" }}>
                    {/* Customer Name */}
                    <div className="row align-items-center mb-2">
                        <label className="col-sm-2 col-form-label fw-normal">Customer Name:</label>
                        <div className="col-sm-6">
                            <input type="text" name="customerName" className="form-control form-control-sm border" value={formData.quote.customerName} onChange={handleQuoteChange} />
                        </div>
                    </div>

                    {/* Quote Number */}
                    <div className="row align-items-center mb-2">
                        <label className="col-sm-2 col-form-label fw-normal">Quote:</label>
                        <div className="col-sm-6" style={{ position: "relative" }}>
                            <input type="text" className="form-control form-control-sm border" name="quote" value={formData.quote.quote} onChange={handleQuoteChange} style={{ paddingRight: "35px" }} />
                            <div
                                style={{
                                    position: "absolute",
                                    right: "15px",
                                    top: "50%",
                                    transform: "translateY(-55%)",
                                    cursor: "pointer",
                                    paddingRight: "5px",
                                }}
                                onClick={() => setShowSettings(true)}
                            >
                                <Settings size={16} style={{ color: "#555" }} />
                            </div>
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="row align-items-center mb-2">
                        <label className="col-sm-2 col-form-label">Quote Date:</label>
                        <div className="col-sm-2">
                            <input type="date" className="form-control form-control-sm border" name="quoteDate" value={formData.quote.quoteDate} onChange={handleQuoteChange} />
                        </div>

                        <label className="col-sm-2 col-form-label">Expiry Date:</label>
                        <div className="col-sm-2">
                            <input type="date" className="form-control form-control-sm border" name="expiryDate" value={formData.quote.expiryDate} onChange={handleQuoteChange} />
                        </div>
                    </div>

                    {/* Sales Person */}
                    <div className="row align-items-center mb-2">
                        <label className="col-sm-2 col-form-label">Sales Person:</label>
                        <div className="col-sm-6">
                            <input type="text" className="form-control form-control-sm border" name="salesPerson" value={formData.quote.salesPerson} onChange={handleQuoteChange} />
                        </div>
                    </div>

                    {/* Project Name */}
                    <div className="row align-items-center mb-2">
                        <label className="col-sm-2 col-form-label">Project Name:</label>
                        <div className="col-sm-6">
                            <input type="text" className="form-control form-control-sm border" name="projectName" value={formData.quote.projectName} onChange={handleQuoteChange} />
                        </div>
                    </div>

                    {/* Item Table header */}
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

                    <ItemTable rows={formData.itemTable} onRowChange={handleRowChange} onAddRow={handleAddRow} onRemoveRow={handleRemoveRow} />

                    {/* Notes + Summary layout */}
                    <div className="notes-summary-row" style={{ display: "flex", gap: 20, marginTop: 18 }}>
                        {/* Left: notes */}
                        <div style={{ width: "50%" }}>
                            <div className="mb-3">
                                <label className="form-label">Customer Notes:</label>
                                <textarea className="form-control form-control-sm border" style={{ resize: "none", height: "90px" }} name="customerNotes" value={formData.quote.customerNotes} onChange={handleQuoteChange} />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Terms & Conditions:</label>
                                <textarea className="form-control form-control-sm border" style={{ resize: "none", height: "90px" }} name="termsAndConditions" value={formData.quote.termsAndConditions} onChange={handleQuoteChange} />
                            </div>
                        </div>

                        {/* Right: summary */}
                        <div style={{ width: "50%" }}>
                            <SummaryBox totals={totals} taxInfo={taxInfo} onTaxChange={handleTaxChange} tcsOptions={tcsOptions} onAddTcs={handleAddTcs} />
                        </div>
                    </div>

                    {/* Documents */}
                    <div className="row mb-4 mt-4">
                        <label className="col-sm-1 col-form-label d-flex align-items-center">
                            Documents:
                        </label>
                        <div className="col-sm-11">
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

                    {/* Submit Buttons */}
                    <div className="d-flex justify-content-center mt-4 pt-4 border-top">
                        <button
                            type="button"
                            className="btn border me-3 px-4"
                            onClick={() => navigate(-1)}
                        >
                            Cancel
                        </button>

                        <button type="submit" className="btn px-4" style={{ background: "#7991BB", color: "#FFF" }}>
                            Save
                        </button>
                    </div>
                </form>
            </div>

            {/* Settings modal */}
            {showSettings && (
                <div className="settings-overlay" onClick={closePopup}>
                    <div className={`settings-modal ${closing ? "closing" : "opening"}`} onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header custom-header">
                            <h4 className="mb-0 p-4">Configure Quote Number Preferences</h4>
                            <X size={20} style={{ cursor: "pointer", marginRight: "15px" }} onClick={closePopup} />
                        </div>

                        <div className="modal-body mt-3">
                            <p style={{ fontSize: "14px", color: "#555" }}>
                                Your quote numbers are set on auto-generate mode to save your time. Are you sure about changing this setting?
                            </p>

                            <div className="form-check mb-3">
                                <input type="radio" name="mode" className="form-check-input" checked={mode === "auto"} onChange={() => setMode("auto")} />
                                <label className="form-check-label" style={{ fontWeight: 500 }}>
                                    Continue auto-generating quote numbers
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
                                            <input value={prefix} onChange={(e) => setPrefix(e.target.value)} className="form-control" placeholder="QT-" />
                                        </div>

                                        <div style={{ flex: 1 }}>
                                            <label className="form-label">Next Number</label>
                                            <input value={nextNumber} onChange={(e) => setNextNumber(e.target.value)} className="form-control" />
                                        </div>
                                    </div>

                                    <div className="mt-3">
                                        <label>
                                            <input type="checkbox" checked={restartYear} onChange={(e) => setRestartYear(e.target.checked)} className="me-2" />
                                            Restart numbering for quotes at the start of each fiscal year.
                                        </label>
                                    </div>
                                </div>
                            )}

                            <div className="form-check mt-4">
                                <input type="radio" name="mode" className="form-check-input" checked={mode === "manual"} onChange={() => setMode("manual")} />
                                <label className="form-check-label" style={{ fontWeight: 500 }}>
                                    Enter quote numbers manually
                                </label>
                            </div>

                            <div className="d-flex justify-content-end mt-4" style={{ gap: 10 }}>
                                <button className="btn btn-outline-secondary" onClick={closePopup}>
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-primary px-4"
                                    onClick={() => {
                                        applyAutoQuote();
                                    }}
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
