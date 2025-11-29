import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../../components/Header/Header";
import { Info, Settings, X } from "react-feather";
import './addQuote.css'
import ItemTable from "../../../../components/Table/ItemTable/ItemTable";

interface ItemTable {
    itemDetails: string;
    quantity: string | number;
    rate: string | number;
    discount: string | number;
    amount: string | number;
}


interface QuotesForm {
    quote: {
        customerName: string;
        quote: string;
        quoteDate: string;
        expiryDate: string;   // ➜ NEW FIELD
        salesPerson: string;
        projectName: string;
        customerNotes: string;
        termsAndConditions: string;
    };

    itemTable: ItemTable[];
}

export default function AddQuotes() {
    const navigate = useNavigate();

    // ---------------------
    // SETTINGS MODAL STATES
    // ---------------------
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
        }, 250); // matches animation duration
    };

  



    useEffect(() => {
        if (showSettings) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto"; // cleanup
        };
    }, [showSettings]);



    // ---------------------
    // INITIAL STATE
    // ---------------------
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
            }
        ]

    });

    // ---------------------
    // HANDLE CHANGE (QUOTE OBJECT)
    // ---------------------
    const handleQuoteChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            quote: {
                ...prev.quote,
                [name]: value,
            }
        }));
    };

    // ---------------------
    // HANDLE CHANGE (ITEM TABLE)
    // ---------------------
    // const handleItemChange = (
    //     index: number,
    //     e: React.ChangeEvent<HTMLInputElement>
    // ) => {
    //     const { name, value } = e.target;

    //     setFormData(prev => {
    //         const updated = [...prev.itemTable];
    //         updated[index] = {
    //             ...updated[index],
    //             [name]: name === "itemDetails" ? value : value === "" ? "" : Number(value)
    //         };
    //         return { ...prev, itemTable: updated };
    //     });
    // };

    // ---------------------
    // ADD ROW TO ITEM TABLE
    // ---------------------
    const handleAddRow = () => {
        setFormData(prev => ({
            ...prev,
            itemTable: [
                ...prev.itemTable,
                {
                    itemDetails: "",
                    quantity: "",
                    rate: "",
                    discount: "",
                    amount: "",
                }
            ]
        }));
    };

    // ---------------------
    // REMOVE ROW
    // ---------------------
    const handleRemoveRow = (index: number) => {
        setFormData(prev => ({
            ...prev,
            itemTable: prev.itemTable.filter((_, i) => i !== index)
        }));
    };

    // ---------------------
    // SUBMIT HANDLER
    // ---------------------
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const finalPayload = {
            ...formData,
            quoteId: Math.floor(100000 + Math.random() * 900000),
            createdOn: new Date().toISOString().split("T")[0],
            createdBy: "Admin"
        };

        console.log("Final Payload:", finalPayload);

        const existing = JSON.parse(localStorage.getItem("quotes") || "[]");
        existing.push(finalPayload);
        localStorage.setItem("quotes", JSON.stringify(existing));

        navigate("/sales/quotes");
    };

    const handleRowChange = (
        index: number,
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;

        setFormData(prev => {
            const updated = [...prev.itemTable];
            updated[index] = {
                ...updated[index],
                [name]: name === "itemDetails" ? value : value === "" ? "" : Number(value)
            };
            return { ...prev, itemTable: updated };
        });
    };


    const [taxInfo, setTaxInfo] = useState({
        taxRate: 0,
        taxAmount: 0,
        total: 0
    });

    const totals = {
        subtotal: 0,
        tax: taxInfo.taxAmount,
        total: taxInfo.total,
        grandTotal: taxInfo.total + taxInfo.taxAmount // or your own formula
    };


    const handleTaxChange = (field: string, value: any) => {
        setTaxInfo(prev => ({
            ...prev,
            [field]: value,
        }));
    };

      const [taxInfo, setTaxInfo] = useState({
        type: "",          // NEW
        selectedTax: "",   // NEW
        adjustment: 0,     // NEW
        taxRate: 0,
        taxAmount: 0,
        total: 0
    });




    return (
        <>
            <Header />

            <div style={{ padding: "0 1rem" }}>
                <h1 className="h4 text-dark mb-4 pb-1">New Quote</h1>

                <form onSubmit={handleSubmit} className="mt-4">

                    {/* Customer Name */}
                    <div className="row align-items-center mb-2">
                        <label className="col-sm-2 col-form-label fw-normal">
                            Customer Name:
                        </label>
                        <div className="col-sm-6">
                            <input
                                type="text"
                                name="customerName"
                                className="form-control form-control-sm"
                                value={formData.quote.customerName}
                                onChange={handleQuoteChange}
                            />
                        </div>
                    </div>

                    {/* Quote Number */}
                    <div className="row align-items-center mb-2">
                        <label className="col-sm-2 col-form-label fw-normal">Quote:</label>
                        <div className="col-sm-6" style={{ position: "relative" }}>
                            <input
                                type="text"
                                className="form-control form-control-sm"
                                name="quote"
                                value={formData.quote.quote}
                                onChange={handleQuoteChange}
                                style={{ paddingRight: "35px" }}
                            />
                            <div
                                style={{
                                    position: "absolute",
                                    right: "15px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    cursor: "pointer"
                                }}
                                onClick={() => setShowSettings(true)}
                            >
                                <Settings size={16} style={{ color: "#555" }} />
                            </div>
                        </div>
                    </div>

                    {/* Date Fields */}
                    <div className="row align-items-center mb-2">
                        <label className="col-sm-2 col-form-label">Quote Date:</label>
                        <div className="col-sm-2">
                            <input
                                type="date"
                                className="form-control form-control-sm"
                                name="quoteDate"
                                value={formData.quote.quoteDate}
                                onChange={handleQuoteChange}
                            />
                        </div>

                        <label className="col-sm-2 col-form-label">Expiry Date:</label>
                        <div className="col-sm-2">
                            <input
                                type="date"
                                className="form-control form-control-sm"
                                name="expiryDate"
                                value={formData.quote.expiryDate}
                                onChange={handleQuoteChange}
                            />
                        </div>
                    </div>

                    {/* Sales Person */}
                    <div className="row align-items-center mb-2">
                        <label className="col-sm-2 col-form-label">Sales Person:</label>
                        <div className="col-sm-6">
                            <input
                                type="text"
                                className="form-control form-control-sm"
                                name="salesPerson"
                                value={formData.quote.salesPerson}
                                onChange={handleQuoteChange}
                            />
                        </div>
                    </div>

                    {/* Project Name */}
                    <div className="row align-items-center mb-2">
                        <label className="col-sm-2 col-form-label">Project Name:</label>
                        <div className="col-sm-6">
                            <input
                                type="text"
                                className="form-control form-control-sm"
                                name="projectName"
                                value={formData.quote.projectName}
                                onChange={handleQuoteChange}
                            />
                        </div>
                    </div>

                    {/* Customer Notes */}
                    <div className="row align-items-center mb-2">
                        <label className="col-sm-2 col-form-label">Customer Notes:</label>
                        <div className="col-sm-6">
                            <textarea
                                className="form-control form-control-sm"
                                name="customerNotes"
                                value={formData.quote.customerNotes}
                                onChange={handleQuoteChange}
                            />
                        </div>
                    </div>

                    {/* Terms & Conditions */}
                    <div className="row align-items-center mb-3">
                        <label className="col-sm-2 col-form-label">Terms & Conditions:</label>
                        <div className="col-sm-6">
                            <textarea
                                className="form-control form-control-sm"
                                name="termsAndConditions"
                                value={formData.quote.termsAndConditions}
                                onChange={handleQuoteChange}
                            />
                        </div>
                    </div>

                    {/* ------------------ ITEM TABLE ------------------ */}
                    <h5 className="mt-4 mb-3">Item Table</h5>
                    <ItemTable
                        rows={formData.itemTable}
                        totals={{
                            subtotal: totals.subtotal,
                            tax: totals.tax,
                            total: totals.total,
                            grandTotal: totals.grandTotal,   // ✔ REQUIRED
                        }}
                        taxInfo={{
                            type: taxInfo.type,
                            selectedTax: taxInfo.selectedTax,
                            adjustment: taxInfo.adjustment,
                            taxRate: taxInfo.taxRate,
                            taxAmount: taxInfo.taxAmount,
                            total: taxInfo.total
                        }}
                        onRowChange={handleRowChange}
                        onAddRow={handleAddRow}
                        onRemoveRow={handleRemoveRow}
                        onTaxChange={(field, value) => handleTaxChange(field, value)} // ✔ match signature
                    />



                    <button type="button" className="btn btn-secondary btn-sm" onClick={handleAddRow}>
                        + Add Item
                    </button>

                    {/* Submit Buttons */}
                    <div className="d-flex justify-content-center mt-4 pt-4 border-top">
                        <button type="button" className="btn border me-3 px-4">
                            Cancel
                        </button>
                        <button type="submit" className="btn px-4" style={{ background: "#7991BB", color: "#FFF" }}>
                            Save
                        </button>
                    </div>
                </form>
            </div>

            {showSettings && (
                <div className="settings-overlay" onClick={closePopup}>
                    <div
                        className={`settings-modal ${closing ? "closing" : "opening"}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* HEADER */}
                        <div className="modal-header custom-header">
                            <h4 className="mb-0 p-4">Configure Quote Number Preferences</h4>
                            <X size={20} style={{ cursor: "pointer", marginRight: "15px" }} onClick={closePopup} />
                        </div>

                        {/* BODY CONTENT */}
                        <div className="modal-body mt-3">

                            {/* PARAGRAPH */}
                            <p style={{ fontSize: "14px", color: "#555" }}>
                                Your quote numbers are set on auto-generate mode to save your time.
                                Are you sure about changing this setting?
                            </p>

                            {/* RADIO 1 */}
                            <div className="form-check mb-3">
                                <input
                                    type="radio"
                                    name="mode"
                                    className="form-check-input"
                                    checked={mode === "auto"}
                                    onChange={() => setMode("auto")}
                                />
                                <label className="form-check-label" style={{ fontWeight: 500 }}>
                                    Continue auto-generating quote numbers
                                </label>

                                {/* info icon */}
                                <span style={{ marginLeft: "6px", cursor: "pointer" }}>
                                    <Info size={18} />
                                </span>
                            </div>

                            {/* AUTO MODE SETTINGS */}
                            {mode === "auto" && (
                                <div style={{ marginLeft: "25px" }}>

                                    <div style={{ display: "flex", gap: "20px" }}>

                                        <div style={{ flex: 1 }}>
                                            <label className="form-label">Prefix</label>
                                            <input
                                                value={prefix}
                                                onChange={(e) => setPrefix(e.target.value)}
                                                className="form-control"
                                                placeholder="QT-"
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

                                    {/* Checkbox */}
                                    <div className="mt-3">
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={restartYear}
                                                onChange={(e) => setRestartYear(e.target.checked)}
                                                className="me-2"
                                            />
                                            Restart numbering for quotes at the start of each fiscal year.
                                        </label>
                                    </div>
                                </div>
                            )}

                            {/* RADIO 2 */}
                            <div className="form-check mt-4">
                                <input
                                    type="radio"
                                    name="mode"
                                    className="form-check-input"
                                    checked={mode === "manual"}
                                    onChange={() => setMode("manual")}
                                />
                                <label className="form-check-label" style={{ fontWeight: 500 }}>
                                    Enter quote numbers manually
                                </label>
                            </div>

                            {/* BUTTONS */}
                            <div className="d-flex justify-content-end mt-4" style={{ gap: "10px" }}>
                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={closePopup}                                >
                                    Cancel
                                </button>

                                <button
                                    className="btn btn-primary px-4"
                                    onClick={() => {
                                        if (mode === "auto") {
                                            setFormData((prev) => ({
                                                ...prev,
                                                quote: {
                                                    ...prev.quote,
                                                    quote: prefix + nextNumber
                                                }
                                            }));
                                        }
                                        closePopup();
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
