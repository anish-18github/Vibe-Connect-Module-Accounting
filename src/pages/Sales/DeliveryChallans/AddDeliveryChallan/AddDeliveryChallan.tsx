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
        reference: string;
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
            reference: "",
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

            <div className="sales-orders-page">
                <form onSubmit={handleSubmit} className="sales-order-form">
                    {/* TOP DETAILS CARD - 5 fields in 3 columns */}
                    <div className="so-details-card mx-5 mb-4">
                        <h1 className="sales-order-title mb-4">Delivery Challan</h1>

                        <div className="row g-3 three-column-form">
                            {/* COLUMN 1: Customer + Challan Date */}
                            <div className="col-lg-4">
                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Customer:
                                    </label>
                                    <select
                                        name="customerName"
                                        className="form-select so-control"
                                        value={formData.challan.customerName}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select Customer</option>
                                        <option value="Customer A">Customer A</option>
                                        <option value="Customer B">Customer B</option>
                                    </select>
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Challan Date:
                                    </label>
                                    <input
                                        type="date"
                                        name="challanDate"
                                        className="form-control so-control"
                                        value={formData.challan.challanDate}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* COLUMN 2: Challan Type + Challan No */}
                            <div className="col-lg-4">
                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Challan Type:
                                    </label>
                                    <select
                                        name="deliveryMethod"
                                        className="form-select so-control"
                                        value={formData.challan.deliveryMethod}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select Delivery Method</option>
                                        <option value="Courier">Courier</option>
                                        <option value="Transport">Transport</option>
                                        <option value="Pickup">Pickup</option>
                                    </select>
                                </div>

                                <div className="so-form-group mb-4 position-relative">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Challan No:
                                    </label>
                                    <input
                                        type="text"
                                        name="challanNo"
                                        className="form-control so-control"
                                        value={formData.challan.challanNo}
                                        onChange={handleChange}
                                        placeholder="Auto-generated"
                                        style={{ paddingRight: "35px" }}
                                    />
                                    <span
                                        className="so-settings-icon"
                                        onClick={() => setShowSettings(true)}
                                    >
                                        <Settings size={16} />
                                    </span>
                                </div>
                            </div>

                            {/* COLUMN 3: Reference (single field - takes top space) */}
                            <div className="col-lg-4">
                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Reference:
                                    </label>
                                    <input
                                        type="text"
                                        name="reference"
                                        className="form-control so-control"
                                        value={formData.challan.reference}
                                        onChange={handleChange}
                                        placeholder="Enter reference"
                                    />
                                </div>
                                {/* Empty space to balance height */}
                                <div className="so-form-group mb-4">&nbsp;</div>
                            </div>
                        </div>
                    </div>

                    {/* OUTSIDE CARD - Identical to Sales Order */}
                    <div className="mx-5">
                        <ItemTable
                            rows={formData.itemTable}
                            onRowChange={handleRowChange}
                            onAddRow={handleAddRow}
                            onRemoveRow={handleRemoveRow}
                        />

                        <div className="notes-summary-row">
                            <div className="notes-column">
                                <div className="so-form-group">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Customer Notes:
                                    </label>
                                    <textarea
                                        className="form-control so-control textarea"
                                        name="customerNotes"
                                        value={formData.challan.customerNotes}
                                        onChange={handleChange}
                                        placeholder="Add note for customer..."
                                    />
                                </div>

                                <div className="so-form-group">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Terms & Conditions:
                                    </label>
                                    <textarea
                                        className="form-control so-control textarea"
                                        name="termsAndConditions"
                                        value={formData.challan.termsAndConditions}
                                        onChange={handleChange}
                                        placeholder="Enter terms and conditions..."
                                    />
                                </div>
                            </div>

                            <div className="summary-column">
                                <SummaryBox
                                    totals={totals}
                                    taxInfo={taxInfo}
                                    onTaxChange={handleTaxChange}
                                    tcsOptions={tcsOptions}
                                    onAddTcs={handleAddTcs}
                                />
                            </div>
                        </div>

                        <div className="row mb-4 mt-4 align-items-start">
                            <label className="so-label text-sm text-muted-foreground fw-bold">
                                Documents:
                            </label>
                            <div className="col-sm-12">
                                <div
                                    className="doc-upload-box"
                                    onClick={() => document.getElementById("fileUploadInput")?.click()}
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
                                Save
                            </button>
                        </div>
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
