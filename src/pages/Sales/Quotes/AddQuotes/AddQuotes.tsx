import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../../components/Header/Header";
import { Settings, X } from "react-feather";

interface ItemTable {
    itemDetaild: string;
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
                itemDetaild: "",
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
    const handleItemChange = (
        index: number,
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;

        setFormData(prev => {
            const updated = [...prev.itemTable];
            updated[index] = {
                ...updated[index],
                [name]: value
            };
            return { ...prev, itemTable: updated };
        });
    };

    // ---------------------
    // ADD ROW TO ITEM TABLE
    // ---------------------
    const handleAddRow = () => {
        setFormData(prev => ({
            ...prev,
            itemTable: [
                ...prev.itemTable,
                {
                    itemDetaild: "",
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

    return (
        <>
            <Header />

            <div className="container mt-4" >
                <h2 className="mb-4">New Quote</h2>

                <form onSubmit={handleSubmit}>

                    {/* -------------------- QUOTE DETAILS -------------------- */}
                    <div className="row mb-3">
                        <label className="col-md-2 col-form-label ">
                            Customer Name:
                        </label>

                        <div className="col-md-6">
                            <input
                                type="text"
                                className="form-control"
                                name="customerName"
                                value={formData.quote.customerName}
                                onChange={handleQuoteChange}
                            />
                        </div>
                    </div>



                    <div className="row mb-3">
                        <div className="col-md-2 form-label-inline">Quote:</div>
                        <div className="col-md-7" style={{ position: "relative" }}>
                            <input
                                type="text"
                                className="form-control"
                                name="quote"
                                value={formData.quote.quote}
                                onChange={handleQuoteChange}
                                style={{ paddingRight: "35px" }}
                            />

                            <div
                                style={{
                                    position: "absolute",
                                    right: "20px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    cursor: "pointer"
                                }}
                                onClick={() => setShowSettings(true)}

                            >
                                <Settings size={17} style={{ color: "#5E5E5E" }} />
                            </div>
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-3 form-label-inline">Quote Date:</div>
                        <div className="col-md-3">
                            <input
                                type="date"
                                className="form-control"
                                name="quoteDate"
                                value={formData.quote.quoteDate}
                                onChange={handleQuoteChange}
                            />
                        </div>

                        <div className="col-md-3 form-label-inline">Expiry Date:</div>
                        <div className="col-md-3">
                            <input
                                type="date"
                                className="form-control"
                                name="expiryDate"
                                value={formData.quote.expiryDate}
                                onChange={handleQuoteChange}
                            />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-3 form-label-inline">Sales Person:</div>
                        <div className="col-md-7">
                            <input
                                type="text"
                                className="form-control"
                                name="salesPerson"
                                value={formData.quote.salesPerson}
                                onChange={handleQuoteChange}
                            />
                        </div>
                    </div>


                    <div className="row mb-3">
                        <div className="col-md-3 form-label-inline">Project Name:</div>
                        <div className="col-md-7">
                            <input
                                type="text"
                                className="form-control"
                                name="projectName"
                                value={formData.quote.projectName}
                                onChange={handleQuoteChange}
                            />
                        </div>
                    </div>


                    <div className="row mb-3">
                        <div className="col-md-3 form-label-inline">Customer Notes:</div>
                        <div className="col-md-7">
                            <textarea
                                className="form-control"
                                name="customerNotes"
                                value={formData.quote.customerNotes}
                                onChange={handleQuoteChange}
                            />
                        </div>
                    </div>


                    <div className="row mb-3">
                        <div className="col-md-3 form-label-inline">Terms & Conditions:</div>
                        <div className="col-md-7">
                            <textarea
                                className="form-control"
                                name="termsAndConditions"
                                value={formData.quote.termsAndConditions}
                                onChange={handleQuoteChange}
                            />
                        </div>
                    </div>


                    {/* -------------------- ITEM TABLE -------------------- */}
                    <h4 className="mt-4">Item Table</h4>

                    {formData.itemTable.map((row, index) => (
                        <div key={index} className="row g-2 mb-3">

                            <div className="col-md-4">
                                <input
                                    type="text"
                                    name="itemDetaild"
                                    placeholder="Item Details"
                                    className="form-control"
                                    value={row.itemDetaild}
                                    onChange={(e) => handleItemChange(index, e)}
                                />
                            </div>

                            <div className="col-md-2">
                                <input
                                    type="number"
                                    name="quantity"
                                    placeholder="Qty"
                                    className="form-control"
                                    value={row.quantity}
                                    onChange={(e) => handleItemChange(index, e)}
                                />
                            </div>

                            <div className="col-md-2">
                                <input
                                    type="number"
                                    name="rate"
                                    placeholder="Rate"
                                    className="form-control"
                                    value={row.rate}
                                    onChange={(e) => handleItemChange(index, e)}
                                />
                            </div>

                            <div className="col-md-2">
                                <input
                                    type="number"
                                    name="discount"
                                    placeholder="Discount"
                                    className="form-control"
                                    value={row.discount}
                                    onChange={(e) => handleItemChange(index, e)}
                                />
                            </div>

                            <div className="col-md-1">
                                <button
                                    type="button"
                                    className="btn btn-danger w-100"
                                    onClick={() => handleRemoveRow(index)}
                                >
                                    <X />
                                </button>
                            </div>
                        </div>
                    ))}

                    <button type="button" className="btn btn-secondary" onClick={handleAddRow}>
                        + Add Item
                    </button>

                    {/* -------------------- SUBMIT -------------------- */}
                    <div className="d-flex justify-content-center mt-4 pt-4 border-top">
                        <button type="button" className="btn btn-outline-secondary me-3 px-4">
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary px-4">
                            Save
                        </button>
                    </div>

                    {showSettings && (
                        <div
                            className="modal-backdrop-custom"
                            style={{
                                position: "fixed",
                                top: 0,
                                left: 0,
                                width: "100vw",
                                height: "100vh",
                                background: "rgba(0,0,0,0.4)",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                zIndex: 9999
                            }}
                        >
                            <div
                                className="modal-box"
                                style={{
                                    width: "650px",
                                    maxHeight: "80vh",
                                    overflowY: "auto",
                                    background: "white",
                                    borderRadius: "8px",
                                    padding: "20px",
                                    position: "relative",
                                    boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
                                }}
                            >
                                {/* CLOSE BUTTON */}
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "10px",
                                        right: "10px",
                                        cursor: "pointer",
                                        fontSize: "18px",
                                        fontWeight: "bold"
                                    }}
                                    onClick={() => setShowSettings(false)}
                                >
                                    ×
                                </div>

                                {/* HEADER */}
                                <h4 style={{ marginBottom: "10px" }}>Configure Quote Number Preferences</h4>
                                <p style={{ fontSize: "14px", color: "#555", marginBottom: "20px" }}>
                                    Your quote numbers are set on auto-generate mode to save your time.
                                    Are you sure about changing this setting?
                                </p>

                                {/* RADIO OPTIONS */}
                                <div>
                                    {/* Auto Mode */}
                                    <div className="form-check mb-3">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="quoteMode"
                                            checked={mode === "auto"}
                                            onChange={() => setMode("auto")}
                                        />
                                        <label className="form-check-label">
                                            Continue auto-generating quote numbers
                                        </label>
                                    </div>

                                    {/* Conditional content for Auto mode */}
                                    {mode === "auto" && (
                                        <div className="ms-4 p-3 border rounded">
                                            <div className="mb-2">
                                                <label className="form-label">Prefix:</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={prefix}
                                                    onChange={(e) => setPrefix(e.target.value)}
                                                />
                                            </div>

                                            <div className="mb-2">
                                                <label className="form-label">Next Number:</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={nextNumber}
                                                    onChange={(e) => setNextNumber(e.target.value)}
                                                />
                                            </div>

                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    checked={restartYear}
                                                    onChange={(e) => setRestartYear(e.target.checked)}
                                                />
                                                <label className="form-check-label">
                                                    Restart numbering for quotes at the start of each fiscal year
                                                </label>
                                            </div>
                                        </div>
                                    )}

                                    {/* Manual Mode */}
                                    <div className="form-check mt-3">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="quoteMode"
                                            checked={mode === "manual"}
                                            onChange={() => setMode("manual")}
                                        />
                                        <label className="form-check-label">
                                            Enter quote numbers manually
                                        </label>
                                    </div>

                                    {/* Manual mode has NO extra fields */}
                                </div>

                                {/* FOOTER BUTTONS */}
                                <div className="d-flex justify-content-end mt-4">
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary me-2"
                                        onClick={() => setShowSettings(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() => {
                                            console.log("Saved settings:", { mode, prefix, nextNumber, restartYear });
                                            setShowSettings(false);
                                        }}
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}


                </form>
            </div>
        </>
    );
}
