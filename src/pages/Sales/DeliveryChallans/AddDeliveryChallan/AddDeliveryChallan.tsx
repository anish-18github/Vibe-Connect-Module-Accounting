import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../../components/Header/Header";
import { Info, Settings, X } from "react-feather";
import './addDeliveryChallan.css'
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

interface DeliveryChallanForm {
    challan: {
        customerName: string;
        challanNo: string;
        challanDate: string;
        deliveryDate: string;
        deliveryMethod: string;
        salesperson: string;
        customerNotes: string;
        termsAndConditions: string;
    };
    itemTable: ItemRow[];
}

type TaxType = "TDS" | "TCS" | "";

export default function AddDeliveryChallan() {
    const navigate = useNavigate();

    // ---------------- Modal + Small UI State ----------------
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
    const [formData, setFormData] = useState<DeliveryChallanForm>({
        challan: {
            customerName: "",
            challanNo: "",
            challanDate: "",
            deliveryDate: "",
            deliveryMethod: "",
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
            rate = Number(taxInfo.selectedTax || 0);
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
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            challan: { ...prev.challan, [name]: value },
        }));
    };

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

    const handleRowChange = (
        index: number,
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;
        type Field = keyof ItemRow;
        const field = name as Field;

        setFormData((prev) => {
            const updated = [...prev.itemTable];
            const row = { ...updated[index] };
            row[field] = value;

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
            challanId: Math.floor(100000 + Math.random() * 900000),
            createdOn: new Date().toISOString().split("T")[0],
            createdBy: "Admin",
        };

        const existing = JSON.parse(localStorage.getItem("deliveryChallans") || "[]");
        existing.push(finalPayload);
        localStorage.setItem("deliveryChallans", JSON.stringify(existing));

        navigate("/delivery/challan");
    };

    const applyAutoSO = () => {
        if (mode === "auto") {
            setFormData((prev) => ({
                ...prev,
                challan: {
                    ...prev.challan,
                    challanNo: prefix + nextNumber,
                },
            }));
        }
        closePopup();
    };

    // ---------------- UI ----------------
    return (
        <>
            <Header />

            <div className="sales-orders-page" style={{ padding: "0 1.8rem" }}>
                <h1 className="h4 text-dark mb-4 pb-1">Delivery Challan</h1>

                <form onSubmit={handleSubmit} className="mt-4" style={{ color: "#5E5E5E" }}>

                    <div className="two-column-form">
                        <div className="left-column">

                            {/* Customer Name */}
                            <div className="form-row">
                                <label>Customer Name:</label>
                                <select
                                    name="customerName"
                                    className="form-control form-control-sm"
                                    value={formData.challan.customerName}
                                    onChange={handleChange}
                                >
                                    <option value="" disabled hidden >Select Customer</option>
                                    <option value="Customer A">Customer A</option>
                                    <option value="Customer B">Customer B</option>
                                </select>
                            </div>

                            {/* Challan Date */}
                            <div className="form-row">
                                <label>Delivery Challan Date:</label>
                                <input
                                    type="date"
                                    className="form-control form-control-sm"
                                    name="challanDate"
                                    value={formData.challan.challanDate}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Delivery Method */}
                            <div className="form-row">
                                <label>Challan Type:</label>
                                <select
                                    name="deliveryMethod"
                                    className="form-control form-control-sm"
                                    value={formData.challan.deliveryMethod}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Delivery Method</option>
                                    <option value="Courier">Courier</option>
                                    <option value="Transport">Transport</option>
                                    <option value="Pickup">Pickup</option>
                                </select>
                            </div>

                        </div>

                        <div className="right-column">

                            {/* Challan No */}
                            <div className="form-row" style={{ position: "relative" }}>
                                <label>Delivery Challan:</label>
                                <input
                                    type="text"
                                    name="challanNo"
                                    className="form-control form-control-sm"
                                    value={formData.challan.challanNo}
                                    onChange={handleChange}
                                    style={{ paddingRight: "35px" }}
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

                            {/* Salesperson */}
                            <div className="form-row">
                                <label>Reference:</label>
                                <select
                                    name="salesperson"
                                    className="form-control form-control-sm"
                                    value={formData.challan.salesperson}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Salesperson</option>
                                    <option value="John">John</option>
                                    <option value="Maria">Maria</option>
                                </select>
                            </div>

                        </div>
                    </div>


                    {/* Item Table Title */}
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
                    <div className="notes-summary-row" style={{ display: "flex", gap: 5, marginTop: 18 }}>
                        {/* Left: notes */}
                        <div style={{ width: "50%" }}>
                            <div className="mb-3" >
                                <label className="form-label">Customer Notes:</label>
                                <textarea className="form-control form-control-sm" style={{ resize: "none", height: "90px" }}
                                    name="customerNotes" value={formData.challan.customerNotes} onChange={handleChange} />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Terms & Conditions:</label>
                                <textarea className="form-control form-control-sm" style={{ resize: "none", height: "90px" }}
                                    name="termsAndConditions" value={formData.challan.termsAndConditions} onChange={handleChange} />
                            </div>
                        </div>

                        {/* Right: summary */}
                        <div style={{ width: "50%" }}>
                            <SummaryBox totals={totals} taxInfo={taxInfo} onTaxChange={handleTaxChange} tcsOptions={tcsOptions} onAddTcs={handleAddTcs} />
                        </div>
                    </div>

                    {/* Documents */}
                    <div className="row mb-4 mt-4">
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
                                <FeatherUpload size={32} className="text-muted mb-2" />
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
                                            console.log("Files uploaded:", files);
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
                        className={`settings-modal ${closing ? "closing" : "opening"
                            }`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header custom-header">
                            <h4 className="mb-0 p-4">
                                Configure Delivery Challan Number
                            </h4>
                            <X
                                size={20}
                                style={{ cursor: "pointer", marginRight: "15px" }}
                                onClick={closePopup}
                            />
                        </div>

                        <div className="modal-body mt-3">
                            <p style={{ fontSize: "14px", color: "#555" }}>
                                Your Delivery Challans are currently set to auto-generate
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
                                    Continue auto-generating Challan Numbers
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
                                                placeholder="DC-"
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
                                    Enter Challan Numbers manually
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
