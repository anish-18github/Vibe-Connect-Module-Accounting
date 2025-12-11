// import { X } from "react-feather";

import { Plus, X } from "react-feather";

import React, { useState } from "react";
import './itemTable.css'


export interface ItemRow {
    itemDetails: string;
    quantity: number | string;
    rate: number | string;
    discount: number | string;
    amount: number | string;
}




export interface ItemTableProps {
    rows: ItemRow[];
    onRowChange: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
    onAddRow: () => void;
    onRemoveRow: (index: number) => void;   // ➜ NEW
}


// ---------------------------
// MAIN ITEM TABLE COMPONENT
// ---------------------------
function ItemTable({
    rows,
    onRowChange,
    onAddRow,
    onRemoveRow,
}: ItemTableProps) {
    return (
        <div className="item-card">
            <div className="item-card-header">
                <span className="item-card-title">Item Table</span>
            </div>

            <div className="item-card-body">
                <div className="row">
                    <div className="col-md-12">
                        <table className="table table-sm align-middle item-table-inner">
                            <thead>
                                <tr>
                                    <th className="fw-medium text-dark ">Item Details</th>
                                    <th className="fw-medium text-dark">Quantity</th>
                                    <th className="fw-medium text-dark">Rate</th>
                                    <th className="fw-medium text-dark">Discount</th>
                                    <th className="fw-medium text-dark">Amount</th>
                                    <th className="fw-medium text-center text-dark">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {rows.map((row, index) => (
                                    <tr key={index}>
                                        <td>
                                            <input
                                                type="text"
                                                name="itemDetails"
                                                className="form-control form-control-sm border-0"
                                                placeholder="Type item details..."
                                                value={row.itemDetails}
                                                onChange={(e) => onRowChange(index, e)}
                                            />
                                        </td>

                                        <td>
                                            <input
                                                type="number"
                                                name="quantity"
                                                className="form-control form-control-sm no-spinner border-0"
                                                placeholder="00.00"
                                                value={row.quantity}
                                                onChange={(e) => onRowChange(index, e)}
                                            />
                                        </td>

                                        <td>
                                            <input
                                                type="number"
                                                name="rate"
                                                className="form-control form-control-sm no-spinner border-0"
                                                placeholder="00.00"
                                                value={row.rate}
                                                onChange={(e) => onRowChange(index, e)}
                                            />
                                        </td>

                                        <td className="d-flex align-items-center">
                                            <input
                                                type="number"
                                                name="discount"
                                                className="form-control form-control-sm no-spinner border-0"
                                                placeholder="00"
                                                value={row.discount}
                                                onChange={(e) => onRowChange(index, e)}
                                            />
                                            <span className="ms-1">%</span>
                                        </td>

                                        <td>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm border-0"
                                                value={row.amount}
                                                disabled
                                            />
                                        </td>

                                        <td className="text-center">
                                            <button
                                                className="border-0 bg-body text-danger"
                                                type="button"
                                                onClick={() => onRemoveRow(index)}
                                            >
                                                <X size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <button
                            type="button"
                            className="btn btn-sm fw-bold item-add-row-btn"
                            onClick={onAddRow}
                        >
                            <Plus size={16} className="me-1" /> Add New Row
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default ItemTable;


// ---------------------------------------
// SEPARATE SUMMARY BOX COMPONENT
// ---------------------------------------
export interface TotalsBox {
    subtotal: number;
    tax: number;
    total: number;
    grandTotal: number;
}

export interface TaxInfo {
    type: "TDS" | "TCS" | "";
    selectedTax: string; // string representation of rate or custom id
    adjustment: number;
    taxRate: number;     // computed numeric rate
    taxAmount: number;
    total: number;
}

export interface TcsOption {
    id: string;     // unique id (uuid or simple timestamp)
    name: string;   // display name
    rate: number;   // numeric percent
}

export interface SummaryBoxProps {
    totals: TotalsBox;
    taxInfo: TaxInfo;
    onTaxChange: (field: keyof TaxInfo | "type", value: any) => void;
    tcsOptions: TcsOption[];
    onAddTcs: (opt: TcsOption) => void; // parent will add to state
}

export function SummaryBox({
    totals,
    taxInfo,
    onTaxChange,
    tcsOptions,
    onAddTcs,
}: SummaryBoxProps) {
    const [showAddModal, setShowAddModal] = useState(false);
    const [newName, setNewName] = useState("");
    const [newRate, setNewRate] = useState<number | "">("");

    const TDS_FIXED = [
        { label: "0.1%", value: "0.1" },
        { label: "1%", value: "1" },
        { label: "5%", value: "5" },
        { label: "10%", value: "10" },
    ];

    const handleSaveNewTcs = () => {
        if (!newName.trim() || newRate === "" || Number(newRate) <= 0) return;
        const id = Date.now().toString();
        const option = { id, name: newName.trim(), rate: Number(newRate) };
        onAddTcs(option);
        // auto-select newly created TCS
        onTaxChange("type", "TCS");
        onTaxChange("selectedTax", option.id);
        setNewName("");
        setNewRate("");
        setShowAddModal(false);
    };

    return (
        <>
            <div className="summary-box fw-normal text-dark">
                <div className="total-box p-3" style={{ backgroundColor: "#F1F0F0", borderRadius: 6 }}>
                    <div className="d-flex justify-content-between mb-2">
                        <span>Sub Total</span>
                        <span>{totals.subtotal.toFixed(2)}</span>
                    </div>

                    <div className="mt-3 mb-2">
                        <label className="form-label fw-bold mb-1">Tax Type</label>

                        <div className="d-flex align-items-center gap-3">
                            <label className="d-flex align-items-center gap-1">
                                <input
                                    type="radio"
                                    name="taxType"
                                    checked={taxInfo.type === "TDS"}
                                    onChange={() => {
                                        onTaxChange("type", "TDS");
                                        // default select first TDS fixed
                                        onTaxChange("selectedTax", TDS_FIXED[0].value);
                                    }}
                                />
                                TDS
                            </label>

                            <label className="d-flex align-items-center gap-1">
                                <input
                                    type="radio"
                                    name="taxType"
                                    checked={taxInfo.type === "TCS"}
                                    onChange={() => {
                                        onTaxChange("type", "TCS");
                                        // default select first TCS option if any
                                        if (tcsOptions.length) onTaxChange("selectedTax", tcsOptions[0].id);
                                    }}
                                />
                                TCS
                            </label>

                            {/* Depending on selected type show appropriate control */}
                            {taxInfo.type === "TDS" && (
                                <select
                                    className="form-select form-select-sm w-50"
                                    value={taxInfo.selectedTax}
                                    style={{
                                        background: "#F1F0F0"
                                    }}
                                    onChange={(e) => onTaxChange("selectedTax", e.target.value)}
                                >
                                    {TDS_FIXED.map((o) => (
                                        <option key={o.value} value={o.value}>
                                            {o.label}
                                        </option>
                                    ))}
                                </select>
                            )}

                            {taxInfo.type === "TCS" && (
                                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                    <select
                                        className="form-select form-select-sm"
                                        value={taxInfo.selectedTax}
                                        onChange={(e) => onTaxChange("selectedTax", e.target.value)}
                                        style={{ minWidth: 100, background: "#F1F0F0" }}
                                    >
                                        <option value="">Select TCS</option>
                                        {tcsOptions.map((opt) => (
                                            <option key={opt.id} value={opt.id}>
                                                {opt.name} - {opt.rate}%
                                            </option>
                                        ))}
                                        <option value="_add_new">+ Add New</option>
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-3 d-flex align-items-center">
                        <label className="form-label me-3">Adjustment</label>
                        <input
                            type="number"
                            className="form-control form-control-sm no-spinner border-0"
                            placeholder="0"
                            style={{ width: 120, background: "#D9D9D9" }}
                            value={taxInfo.adjustment === 0 ? "" : taxInfo.adjustment}
                            onChange={(e) => onTaxChange("adjustment", Number(e.target.value))}
                        />
                    </div>

                    <hr />

                    <div className="d-flex justify-content-between mt-3">
                        <strong>Total (₹)</strong>
                        <strong>{totals.grandTotal.toFixed(2)}</strong>
                    </div>
                </div>
            </div>

            {/* Add New TCS modal (temporary local modal) */}
            {showAddModal && (
                <div className="tcs-modal-backdrop">
                    <div className="tcs-modal">
                        <h5>Add new TCS</h5>

                        <div className="mb-2">
                            <label className="form-label">Tax Name</label>
                            <input className="form-control form-control-sm" value={newName} onChange={(e) => setNewName(e.target.value)} />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Rate %</label>
                            <input
                                className="form-control form-control-sm"
                                type="number"
                                value={newRate as any}
                                onChange={(e) => setNewRate(e.target.value === "" ? "" : Number(e.target.value))}
                            />
                        </div>

                        <div className="d-flex justify-content-end gap-2">
                            <button className="btn btn-sm btn-outline-secondary" onClick={() => setShowAddModal(false)}>
                                Cancel
                            </button>
                            <button className="btn btn-sm btn-primary" onClick={handleSaveNewTcs}>
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Watch for user selecting "+ Add New" in TCS select */}
            {/* We use a tiny effect: when selectedTax equals special value "_add_new", open modal.
          Parent triggers selectedTax update; the parent should forward selectedTax changes.
          To keep component self-contained, detect here by reading taxInfo.selectedTax. */}
            {taxInfo.type === "TCS" && taxInfo.selectedTax === "_add_new" && (
                // open modal (one-time effect)
                <AddNewTrigger openModal={() => setShowAddModal(true)} clearTrigger={() => onTaxChange("selectedTax", "")} />
            )}
        </>
    );
}

/**
 * tiny helper component: when mounted it opens modal (calls openModal) then clears the special selection
 */
function AddNewTrigger({ openModal, clearTrigger }: { openModal: () => void; clearTrigger: () => void }) {
    React.useEffect(() => {
        openModal();
        clearTrigger();
    }, [openModal, clearTrigger]);
    return null;
}
