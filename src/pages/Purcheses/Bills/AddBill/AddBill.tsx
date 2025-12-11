import React, { useEffect, useState } from "react";
import Header from "../../../../components/Header/Header";
import ItemTable, { SummaryBox, type TcsOption } from "../../../../components/Table/ItemTable/ItemTable";
import { FeatherUpload } from "../../../Sales/Customers/AddCustomer/Add";
import { useNavigate } from "react-router-dom";

interface BillHeader {
    vendorName: string;
    bill: string;
    orderNumber: string;
    billDate: string;
    dueDate: string;
    accountsPayable: string;
    subject: string;
    paymentTerm: string;
    customerNotes: string;
    termsAndConditions: string;
}

interface ItemRow {
    itemDetails: string;
    quantity: number | string;
    rate: number | string;
    discount: number | string;
    amount: number | string;
}

interface BillForm {
    billHeader: BillHeader;
    itemTable: ItemRow[];
}

type TaxType = "TDS" | "TCS" | "";


export default function AddBill() {

    const navigate = useNavigate();


    const [formData, setFormData] = useState<BillForm>({
        billHeader: {
            vendorName: "",
            bill: "",
            orderNumber: "",
            billDate: "",
            dueDate: "",
            accountsPayable: "",
            subject: "",
            paymentTerm: "",
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
            billHeader: {
                ...prev.billHeader,
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

            <div style={{ padding: "69px 1.8rem 0 1.8rem", color: "#5E5E5E" }}>
                <h1 className="h4 text-dark mb-4 pb-1">New Bill</h1>

                <form onSubmit={handleSubmit} className="mt-4">
                    <div className="row">
                        {/* COLUMN 1: Vendor Name, Bill, Due Date */}
                        <div className="col-lg-4">
                            {/* Vendor Name */}
                            <div className="row mb-3 align-items-center">
                                <label className="col-sm-4 col-form-label fw-normal">
                                    Vendor Name<span className="text-danger">*</span>
                                </label>
                                <div className="col-sm-7">
                                    <select
                                        name="vendorName"
                                        className="form-select form-select-sm border"
                                        value={formData.billHeader.vendorName}
                                        onChange={handleChange}
                                    >
                                        <option value="" disabled>Select a Vendor</option>
                                        <option value="Vendor A">Vendor A</option>
                                        <option value="Vendor B">Vendor B</option>
                                    </select>
                                </div>
                            </div>

                            {/* Bill */}
                            <div className="row mb-3 align-items-center">
                                <label className="col-sm-4 col-form-label fw-normal">Bill#</label>
                                <div className="col-sm-7">
                                    <input
                                        type="text"
                                        name="bill"
                                        className="form-control form-control-sm border"
                                        value={formData.billHeader.bill}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Due Date */}
                            <div className="row mb-3 align-items-center">
                                <label className="col-sm-4 col-form-label fw-normal">Due Date</label>
                                <div className="col-sm-5">
                                    <input
                                        type="date"
                                        name="dueDate"
                                        className="form-control form-control-sm border"
                                        value={formData.billHeader.dueDate}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* COLUMN 2: Bill Date, Order Number, Accounts Payable */}
                        <div className="col-lg-4">
                            {/* Bill Date */}
                            <div className="row mb-3 align-items-center">
                                <label className="col-sm-5 col-form-label fw-normal">Bill Date</label>
                                <div className="col-sm-5">
                                    <input
                                        type="date"
                                        name="billDate"
                                        className="form-control form-control-sm border"
                                        value={formData.billHeader.billDate}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Order Number */}
                            <div className="row mb-3 align-items-center">
                                <label className="col-sm-5 col-form-label fw-normal">Order Number</label>
                                <div className="col-sm-7">
                                    <input
                                        type="text"
                                        name="orderNumber"
                                        className="form-control form-control-sm border"
                                        value={formData.billHeader.orderNumber}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Accounts Payable */}
                            <div className="row mb-3 align-items-center">
                                <label className="col-sm-5 col-form-label fw-normal">Accounts Payable</label>
                                <div className="col-sm-7">
                                    <select
                                        name="accountsPayable"
                                        className="form-select form-select-sm border"
                                        value={formData.billHeader.accountsPayable}
                                        onChange={handleChange}
                                    >
                                        <option value="" disabled>Select account</option>
                                        <option value="AP-1">Accounts Payable 1</option>
                                        <option value="AP-2">Accounts Payable 2</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* COLUMN 3: Subject, Payment Term */}
                        <div className="col-lg-4">
                            {/* Subject */}
                            <div className="row mb-3 align-items-start">
                                <label className="col-sm-4 col-form-label fw-normal">Subject</label>
                                <div className="col-sm-8">
                                    <textarea
                                        name="subject"
                                        className="form-control form-control-sm border"
                                        rows={2}
                                        style={{ resize: "none" }}
                                        value={formData.billHeader.subject}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Payment Term */}
                            <div className="row mb-3 align-items-center">
                                <label className="col-sm-4 col-form-label fw-normal">Payment Term</label>
                                <div className="col-sm-8">
                                    <select
                                        name="paymentTerm"
                                        className="form-select form-select-sm border"
                                        value={formData.billHeader.paymentTerm}
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
                                <textarea className="form-control form-control-sm border" style={{ resize: "none", height: "90px" }} name="customerNotes" value={formData.billHeader.customerNotes} onChange={handleChange} />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Terms & Conditions:</label>
                                <textarea className="form-control form-control-sm border" style={{ resize: "none", height: "90px" }} name="termsAndConditions" value={formData.billHeader.termsAndConditions} onChange={handleChange} />
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
        </>
    );
}
