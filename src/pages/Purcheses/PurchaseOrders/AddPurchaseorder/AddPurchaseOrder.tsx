// PurchaseOrder.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../../components/Header/Header";
import ItemTable, { SummaryBox, type ItemRow, type TcsOption } from "../../../../components/Table/ItemTable/ItemTable";
import { FeatherUpload } from "../../../Sales/Customers/AddCustomer/Add";
import './addPurchaseOrder.css'


interface PurchaseOrderHeader {
    vendorName: string;
    deliveryType: "organization" | "customer";
    purchaseOrderNo: string;
    referenceNo: string;
    orderDate: string;
    deliveryDate: string;
    shipmentPreference: string;
    paymentTerms: string;
    customerNotes: string;
    termsAndConditions: string;
}

interface PurchaseOrderForm {
    purchaseOrder: PurchaseOrderHeader;
    itemTable: ItemRow[];
}

type TaxType = "TDS" | "TCS" | "";


export default function AddPurchaseOrder() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState<PurchaseOrderForm>({
        purchaseOrder: {
            vendorName: "",
            deliveryType: "organization",
            purchaseOrderNo: "",
            referenceNo: "",
            orderDate: "",
            deliveryDate: "",
            shipmentPreference: "",
            paymentTerms: "",
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

    const [tcsOptions, setTcsOptions] = useState<TcsOption[]>([
        { id: "tcs_5", name: "TCS Standard", rate: 5 },
        { id: "tcs_12", name: "TCS Standard", rate: 12 },
        { id: "tcs_18", name: "TCS Standard", rate: 18 },
    ]);

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

    const [showAddressModal, setShowAddressModal] = useState(false);

    const handleOpenAddress = () => setShowAddressModal(true);
    const handleCloseAddress = () => setShowAddressModal(false);





    useEffect(() => {
        document.body.style.overflow = showAddressModal ? "hidden" : "auto";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [showAddressModal]);


    // ---------------- Handlers ----------------

    const handleRowChange = (
        index: number,
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;
        type Field = keyof ItemRow;
        const field = name as Field;

        setFormData(prev => {
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

    const handleAddRow = () => {
        setFormData(prev => ({
            ...prev,
            itemTable: [
                ...prev.itemTable,
                { itemDetails: "", quantity: "", rate: "", discount: "", amount: "" },
            ],
        }));
    };

    const handleRemoveRow = (index: number) => {
        setFormData(prev => ({
            ...prev,
            itemTable: prev.itemTable.filter((_, i) => i !== index),
        }));
    };

    const handleTaxChange = (field: any, value: any) => {
        setTaxInfo(prev => ({ ...prev, [field]: value }));
    };

    const handleAddTcs = (opt: TcsOption) => {
        setTcsOptions(prev => [...prev, opt]);
    };


    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            purchaseOrder: {
                ...prev.purchaseOrder,
                [name]: value,
            },
        }));
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: build payload, save to localStorage/API like Sales Orders
        navigate(-1);
    };

    return (
        <>
            <Header />

            <div className="purchase-order-page" style={{ padding: "69px 1.8rem 0 1.8rem" }}>
                <h1 className="h4 text-dark mb-4 pb-1">New Purchase Order</h1>

                <form onSubmit={handleSubmit} className="mt-4" style={{ color: "#5E5E5E" }}>
                    {/* Vendor Name + search icon */}
                    {/* TWO COLUMN AREA: 4 FIELDS EACH SIDE */}
                    <div className="row">
                        {/* COLUMN 1: Vendor, Delivery Address, Purchase Order# */}
                        <div className="col-lg-4">
                            {/* Vendor Name */}
                            <div className="row mb-3 align-items-center">
                                <label className="col-sm-5 col-form-label fw-normal">
                                    Vendor Name<span className="text-danger">*</span>
                                </label>
                                <div className="col-sm-6">
                                    <select
                                        name="vendorName"
                                        className="form-select form-select-sm"
                                        value={formData.purchaseOrder.vendorName}
                                        onChange={handleChange}
                                    >
                                        <option value="" disabled>Select a Vendor</option>
                                        <option value="Vendor A">Vendor A</option>
                                        <option value="Vendor B">Vendor B</option>
                                    </select>
                                </div>
                            </div>

                            {/* Purchase Order# */}
                            <div className="row mb-3 align-items-center">
                                <label className="col-sm-5 col-form-label fw-normal">
                                    Purchase Order#<span className="text-danger">*</span>
                                </label>
                                <div className="col-sm-6">
                                    <input
                                        type="text"
                                        name="purchaseOrderNo"
                                        className="form-control form-control-sm border"
                                        value={formData.purchaseOrder.purchaseOrderNo}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Delivery Address (radio block) */}
                            <div className="row mb-3 align-items-center">
                                <label className="col-sm-5 col-form-label fw-normal">
                                    Delivery Address<span className="text-danger">*</span>
                                </label>
                                <div className="col-sm-7">
                                    <div className="mb-1">
                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                id="orgRadio"
                                                name="deliveryType"
                                                checked={formData.purchaseOrder.deliveryType === "organization"}
                                                onChange={() =>
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        purchaseOrder: {
                                                            ...prev.purchaseOrder,
                                                            deliveryType: "organization",
                                                        },
                                                    }))
                                                }
                                            />
                                            <label className="form-check-label" htmlFor="orgRadio">
                                                Organization
                                            </label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                id="custRadio"
                                                name="deliveryType"
                                                checked={formData.purchaseOrder.deliveryType === "customer"}
                                                onChange={() =>
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        purchaseOrder: {
                                                            ...prev.purchaseOrder,
                                                            deliveryType: "customer",
                                                        },
                                                    }))
                                                }
                                            />
                                            <label className="form-check-label" htmlFor="custRadio">
                                                Customer
                                            </label>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        className="btn btn-link p-0"
                                        style={{ fontSize: "13px" }}
                                        onClick={handleOpenAddress}
                                    >
                                        Change destination to deliver
                                    </button>
                                </div>
                            </div>

                        </div>

                        {/* COLUMN 2: Reference#, Date, Delivery Date */}
                        <div className="col-lg-4">
                            {/* Reference# */}
                            <div className="row mb-3 align-items-center">
                                <label className="col-sm-4 col-form-label fw-normal">Reference#</label>
                                <div className="col-sm-8">
                                    <input
                                        type="text"
                                        name="referenceNo"
                                        className="form-control form-control-sm border"
                                        value={formData.purchaseOrder.referenceNo}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Date */}
                            <div className="row mb-3 align-items-center">
                                <label className="col-sm-4 col-form-label fw-normal">Date</label>
                                <div className="col-sm-5">
                                    <input
                                        type="date"
                                        name="orderDate"
                                        className="form-control form-control-sm border"
                                        value={formData.purchaseOrder.orderDate}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Delivery Date */}
                            <div className="row mb-3 align-items-center">
                                <label className="col-sm-4 col-form-label fw-normal">Delivery Date</label>
                                <div className="col-sm-5">
                                    <input
                                        type="date"
                                        name="deliveryDate"
                                        className="form-control form-control-sm border"
                                        value={formData.purchaseOrder.deliveryDate}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* COLUMN 3: Shipment Preference, Payment Terms (2 fields) */}
                        <div className="col-lg-4">
                            {/* Shipment Preference */}
                            <div className="row mb-3 align-items-center">
                                <label className="col-sm-4 col-form-label fw-normal">
                                    Shipment Preference
                                </label>
                                <div className="col-sm-8">
                                    <select
                                        name="shipmentPreference"
                                        className="form-select form-select-sm"
                                        value={formData.purchaseOrder.shipmentPreference}
                                        onChange={handleChange}
                                    >
                                        <option value="" disabled>
                                            Choose the shipment preference
                                        </option>
                                        <option value="By Air">By Air</option>
                                        <option value="By Road">By Road</option>
                                        <option value="By Sea">By Sea</option>
                                    </select>
                                </div>
                            </div>

                            {/* Payment Terms */}
                            <div className="row mb-3 align-items-center">
                                <label className="col-sm-4 col-form-label fw-normal">
                                    Payment Terms
                                </label>
                                <div className="col-sm-6">
                                    <select
                                        name="paymentTerms"
                                        className="form-select form-select-sm"
                                        value={formData.purchaseOrder.paymentTerms}
                                        onChange={handleChange}
                                    >
                                        <option value="" disabled>Select</option>
                                        <option value="Due on Receipt">Due on Receipt</option>
                                        <option value="Net 15">Net 15</option>
                                        <option value="Net 30">Net 30</option>
                                        <option value="Net 45">Net 45</option>
                                    </select>
                                </div>
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
                            <div className="mb-3">
                                <label className="form-label">Customer Notes:</label>
                                <textarea className="form-control form-control-sm border" style={{ resize: "none", height: "90px" }} name="customerNotes" value={formData.purchaseOrder.customerNotes} onChange={handleChange} />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Terms & Conditions:</label>
                                <textarea className="form-control form-control-sm border" style={{ resize: "none", height: "90px" }} name="termsAndConditions" value={formData.purchaseOrder.termsAndConditions} onChange={handleChange} />
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

            {showAddressModal && (
                <div
                    className="modal-backdrop-custom"
                    onClick={handleCloseAddress}
                >
                    <div
                        className="modal-dialog-custom"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="modal-header border-0 pb-2">
                            <h5 className="modal-title">New address</h5>
                            <button
                                type="button"
                                className="btn-close text-danger"
                                onClick={handleCloseAddress}
                            />
                        </div>

                        <div className="modal-body pt-0">
                            <div className="mb-2">
                                <label className="form-label">Attention</label>
                                <input className="form-control form-control-sm border" />
                            </div>
                            <div className="mb-2">
                                <label className="form-label">Street 1</label>
                                <textarea className="form-control form-control-sm border" rows={2} />
                            </div>
                            <div className="mb-2">
                                <label className="form-label">Street 2</label>
                                <textarea className="form-control form-control-sm border" rows={2} />
                            </div>
                            <div className="mb-2">
                                <label className="form-label">City</label>
                                <input className="form-control form-control-sm border" />
                            </div>
                            <div className="mb-2">
                                <label className="form-label">State/Province</label>
                                <input className="form-control form-control-sm border" />
                            </div>
                            <div className="mb-2">
                                <label className="form-label">ZIP/Postal Code</label>
                                <input className="form-control form-control-sm border" />
                            </div>
                            <div className="mb-2">
                                <label className="form-label">Country/Region</label>
                                <select className="form-select form-select-sm border">
                                    <option value="">Select or type to add</option>
                                </select>
                            </div>
                            <div className="mb-2">
                                <label className="form-label">Phone</label>
                                <input className="form-control form-control-sm border" />
                            </div>
                        </div>

                        <div className="modal-footer border-0">
                            <button
                                type="button"
                                className="btn btn-primary btn-sm"
                                onClick={handleCloseAddress}
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                className="btn btn-light btn-sm"
                                onClick={handleCloseAddress}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </>
    );
}
