import { Plus, X } from "react-feather";

export interface ItemRow {
    itemDetails: string;
    quantity: number | string;   // ✔ FIXED
    rate: number | string;       // ✔ FIXED
    discount: number | string;   // ✔ FIXED
    amount: number;
}



export interface TotalsBox {
    subtotal: number;
    tax: number;
    total: number;
    grandTotal: number;  // ✔ REQUIRED (fixes your error)
}


export interface TaxInfo {
    type: string;          // "TDS" | "TCS"
    selectedTax: string;   // "5" | "12" | "18"
    adjustment: number;    // adjustment value

    taxRate: number;
    taxAmount: number;
    total: number;
}



export interface ItemTableProps {
    rows: ItemRow[];
    totals: TotalsBox;
    taxInfo: TaxInfo;

    onRowChange: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
    onAddRow: () => void;
    onRemoveRow: (index: number) => void;

    onTaxChange: (field: string, value: any) => void;
}


function ItemTable({
    rows,
    onRowChange,
    onAddRow,
    onRemoveRow,
    totals,
    taxInfo,
    onTaxChange
}: ItemTableProps) {
    return (
        <div className="row mt-3">

            {/* LEFT SIDE TABLE */}
            <div className="col-md-8">

                <table className="table table-bordered table-sm align-middle">
                    <thead className="bg-light">
                        <tr>
                            <th style={{ width: "30%" }}>Item Details</th>
                            <th style={{ width: "10%" }}>Quantity</th>
                            <th style={{ width: "10%" }}>Rate</th>
                            <th style={{ width: "12%" }}>Discount</th>
                            <th style={{ width: "12%" }}>Amount</th>
                            <th style={{ width: "6%" }}>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {rows.map((row: ItemRow, index: number) => (
                            <tr key={index}>
                                <td>
                                    <input
                                        type="text"
                                        name="itemDetails"
                                        className="form-control form-control-sm"
                                        placeholder="Type or click to select an item"
                                        value={row.itemDetails}
                                        onChange={(e) => onRowChange(index, e)}
                                    />
                                </td>

                                <td>
                                    <input
                                        type="number"
                                        name="quantity"
                                        className="form-control form-control-sm"
                                        value={row.quantity}
                                        onChange={(e) => onRowChange(index, e)}
                                    />
                                </td>

                                <td>
                                    <input
                                        type="number"
                                        name="rate"
                                        className="form-control form-control-sm"
                                        value={row.rate}
                                        onChange={(e) => onRowChange(index, e)}
                                    />
                                </td>

                                <td className="d-flex align-items-center">
                                    <input
                                        type="number"
                                        name="discount"
                                        className="form-control form-control-sm"
                                        value={row.discount}
                                        onChange={(e) => onRowChange(index, e)}
                                    />
                                    <span className="ms-1">%</span>
                                </td>

                                <td>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        value={row.amount}
                                        disabled
                                    />
                                </td>

                                <td className="text-center">
                                    <button
                                        className="btn btn-sm btn-outline-danger"
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
                    className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
                    onClick={onAddRow}
                >
                    <Plus size={16} /> Add New Row
                </button>

            </div>

            {/* RIGHT SUMMARY BOX */}
            <div className="col-md-4">
                <div className="total-box p-3">

                    <div className="d-flex justify-content-between mb-2">
                        <span>Sub Total</span>
                        <span>{totals.subtotal}</span>
                    </div>

                    <div className="mt-3 mb-2">
                        <label className="form-label d-block mb-1" style={{ fontWeight: 500 }}>Tax Type</label>

                        <div className="d-flex align-items-center gap-3">

                            <label className="d-flex align-items-center gap-1">
                                <input
                                    type="radio"
                                    name="taxType"
                                    checked={taxInfo.type === "TDS"}
                                    onChange={() => onTaxChange("type", "TDS")}
                                />
                                TDS
                            </label>

                            <label className="d-flex align-items-center gap-1">
                                <input
                                    type="radio"
                                    name="taxType"
                                    checked={taxInfo.type === "TCS"}
                                    onChange={() => onTaxChange("type", "TCS")}
                                />
                                TCS
                            </label>

                            <select
                                className="form-select form-select-sm w-50"
                                value={taxInfo.selectedTax}
                                onChange={(e) => onTaxChange("selectedTax", e.target.value)}
                            >
                                <option value="">Select a Tax</option>
                                <option value="5">5%</option>
                                <option value="12">12%</option>
                                <option value="18">18%</option>
                            </select>

                        </div>
                    </div>

                    <div className="mt-3">
                        <label className="form-label">Adjustment</label>
                        <input
                            type="number"
                            className="form-control form-control-sm"
                            value={taxInfo.adjustment}
                            onChange={(e) => onTaxChange("adjustment", Number(e.target.value))}
                        />
                    </div>

                    <hr />

                    <div className="d-flex justify-content-between mt-3">
                        <strong>Total (₹)</strong>
                        <strong>{totals.grandTotal}</strong>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default ItemTable;
