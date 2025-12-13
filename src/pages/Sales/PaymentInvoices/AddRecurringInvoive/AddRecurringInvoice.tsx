import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../../components/Header/Header";
// import { Info, Settings, X } from "react-feather";
import './addRecurringInvoice.css';

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

interface RecurringInvoiceForm {
    invoice: {
        customerName: string;
        invoiceNo: string;
        orderNumber: string;
        repeatEvery: string;
        startOn: string;
        endOn: string;
        paymentTerms: string;
        salesperson: string;
        deliveryMethod: string;
        customerNotes: string;
        termsAndConditions: string;
    };
    itemTable: ItemRow[];
}

type TaxType = "TDS" | "TCS" | "";

export default function AddRecurringInvoices() {
    const navigate = useNavigate();

    // ---------------- Modal + Small UI State ----------------
    // const [showSettings, setShowSettings] = useState(false);
    // const [prefix, setPrefix] = useState("");
    // const [nextNumber, setNextNumber] = useState("");
    // const [restartYear, setRestartYear] = useState(false);
    // const [closing, setClosing] = useState(false);

    // const closePopup = () => {
    //     setClosing(true);
    //     setTimeout(() => {
    //         setShowSettings(false);
    //         setClosing(false);
    //     }, 250);
    // };

    // useEffect(() => {
    //     document.body.style.overflow = showSettings ? "hidden" : "auto";
    //     return () => {
    //         document.body.style.overflow = "auto";
    //     };
    // }, [showSettings]);

    // ---------------- Form State ----------------
    const [formData, setFormData] = useState<RecurringInvoiceForm>({
        invoice: {
            customerName: "",
            invoiceNo: "",
            orderNumber: "",
            repeatEvery: "",
            startOn: "",
            endOn: "",
            paymentTerms: "",
            salesperson: "",
            deliveryMethod: "",
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
            invoiceId: Math.floor(100000 + Math.random() * 900000),
            createdOn: new Date().toISOString().split("T")[0],
            createdBy: "Admin",
        };

        const existing = JSON.parse(localStorage.getItem("recurringInvoices") || "[]");
        existing.push(finalPayload);
        localStorage.setItem("recurringInvoices", JSON.stringify(existing));

        navigate("/recurring/invoices");
    };

    // const applyAutoSO = () => {
    //     if (mode === "auto") {
    //         setFormData((prev) => ({
    //             ...prev,
    //             invoice: {
    //                 ...prev.invoice,
    //                 invoiceNo: prefix + nextNumber,
    //             },
    //         }));
    //     }
    //     closePopup();
    // };

    return (
        <>
            <Header />

            <div className="sales-orders-page">
                <form onSubmit={handleSubmit} className="sales-order-form">
                    {/* TOP DETAILS CARD */}
                    <div className="so-details-card mx-5 mb-4">
                        <h1 className="sales-order-title mb-4">New Recurring Invoice</h1>

                        <div className="row g-3 three-column-form">
                            {/* COLUMN 1: 3 fields */}
                            <div className="col-lg-4">
                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Customer:
                                    </label>
                                    <select
                                        name="customerName"
                                        className="form-select so-control"
                                        value={formData.invoice.customerName}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select Customer</option>
                                        <option value="Customer A">Customer A</option>
                                        <option value="Customer B">Customer B</option>
                                    </select>
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Order Number:
                                    </label>
                                    <input
                                        type="number"
                                        name="orderNumber"
                                        className="form-control so-control"
                                        value={formData.invoice.orderNumber}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Repeat Every:
                                    </label>
                                    <select
                                        name="repeatEvery"
                                        className="form-select so-control"
                                        value={formData.invoice.repeatEvery}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select</option>
                                        <option value="Week">Week</option>
                                        <option value="2 Weeks">2 Weeks</option>
                                        <option value="Month">Month</option>
                                        <option value="2 Months">2 Months</option>
                                        <option value="3 Months">3 Months</option>
                                        <option value="6 Months">6 Months</option>
                                        <option value="Year">Year</option>
                                        <option value="2 Years">2 Years</option>
                                        <option value="3 Years">3 Years</option>
                                    </select>
                                </div>
                            </div>

                            {/* COLUMN 2: 3 fields (Subject textarea + Profile Name + Start/End dates) */}
                            <div className="col-lg-4">

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Profile Name:
                                    </label>
                                    <input
                                        type="text"
                                        name="invoiceNo"
                                        className="form-control so-control"
                                        value={formData.invoice.invoiceNo}
                                        onChange={handleChange}
                                        placeholder="Enter profile name"
                                    />
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Terms:
                                    </label>
                                    <div className="row g-2">
                                        <div className="col-6">
                                            <input
                                                type="date"
                                                name="startOn"
                                                className="form-control so-control"
                                                value={formData.invoice.startOn}
                                                onChange={handleChange}
                                                placeholder="Start On"
                                            />
                                        </div>
                                        <div className="col-6">
                                            <input
                                                type="date"
                                                name="endOn"
                                                className="form-control so-control"
                                                value={formData.invoice.endOn}
                                                onChange={handleChange}
                                                placeholder="End On"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Payment Terms:
                                    </label>
                                    <select
                                        name="paymentTerms"
                                        className="form-select so-control"
                                        value={formData.invoice.paymentTerms}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select</option>
                                        <option value="Advance">Advance</option>
                                        <option value="Net 15">Net 15</option>
                                        <option value="Net 30">Net 30</option>
                                        <option value="Net 45">Net 45</option>
                                    </select>
                                </div>
                            </div>

                            {/* COLUMN 3: 2 fields */}
                            <div className="col-lg-4">
                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Salesperson:
                                    </label>
                                    <select
                                        name="salesperson"
                                        className="form-select so-control"
                                        value={formData.invoice.salesperson}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select Salesperson</option>
                                        <option value="John">John</option>
                                        <option value="Maria">Maria</option>
                                    </select>
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Subject:
                                    </label>
                                    <textarea
                                        className="form-control so-control subject-textarea"
                                        style={{ height: "100px", resize: "none" }}
                                        name="customerNotes"
                                        value={formData.invoice.customerNotes}
                                        onChange={handleChange}
                                        placeholder="Enter recurring invoice subject..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* OUTSIDE CARD - Standard Sales Order layout */}
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
                                        name="additionalNotes"
                                        value={formData.invoice.customerNotes || ""}
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
                                        value={formData.invoice.termsAndConditions}
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
}
