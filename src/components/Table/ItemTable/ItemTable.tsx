// import { X } from "react-feather";

import { PlusCircle } from "react-feather";

export interface ItemRow {
    itemDetails: string;
    quantity: number | string;
    rate: number | string;
    discount: number | string;
    amount: number | string;
}

export interface TotalsBox {
    subtotal: number;
    tax: number;
    total: number;
    grandTotal: number;
}

export interface TaxInfo {
    type: string;
    selectedTax: string;
    adjustment: number;
    taxRate: number;
    taxAmount: number;
    total: number;
}

export interface ItemTableProps {
    rows: ItemRow[];
    onRowChange: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
    onAddRow: () => void;
}


// ---------------------------
// MAIN ITEM TABLE COMPONENT
// ---------------------------
function ItemTable({
    rows,
    onRowChange,
    onAddRow
}: ItemTableProps) {
    return (
        <>
            <div className="row">
                <div className="col-md-12">
                    <table className="table table-bordered table-sm align-middle">
                        <thead className="bg-light">
                            <tr>
                                <th className="fw-normal" style={{ width: "30%", fontSize: "20px" }}>Item Details</th>
                                <th className="fw-normal" style={{ width: "10%", fontSize: "20px" }}>Quantity</th>
                                <th className="fw-normal" style={{ width: "10%", fontSize: "20px" }}>Rate</th>
                                <th className="fw-normal" style={{ width: "12%", fontSize: "20px" }}>Discount</th>
                                <th className="fw-normal" style={{ width: "12%", fontSize: "20px" }}>Amount</th>
                            </tr>
                        </thead>

                        <tbody>
                            {rows.map((row, index) => (
                                <tr key={index} className="position-relative">

                                    <td>
                                        <input
                                            type="text"
                                            name="itemDetails"
                                            className="form-control form-control-sm border-0"
                                            value={row.itemDetails}
                                            onChange={(e) => onRowChange(index, e)}
                                        />
                                    </td>

                                    <td>
                                        <input
                                            type="number"
                                            name="quantity"
                                            className="form-control form-control-sm no-spinner border-0"
                                            value={row.quantity}
                                            onChange={(e) => onRowChange(index, e)}
                                        />
                                    </td>

                                    <td>
                                        <input
                                            type="number"
                                            name="rate"
                                            className="form-control form-control-sm no-spinner border-0"
                                            value={row.rate}
                                            onChange={(e) => onRowChange(index, e)}
                                        />
                                    </td>

                                    <td className="d-flex align-items-center">
                                        <input
                                            type="number"
                                            name="discount"
                                            className="form-control form-control-sm no-spinner border-0"
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
                                </tr>
                            ))}
                        </tbody>

                    </table>

                    <button
                        type="button"
                        className="btn btn-sm fw-normal"
                        onClick={onAddRow}
                        style={{
                            color: "#5E5E5E",
                            border: "1px solid #D9D9D9"
                        }}
                    >
                        <PlusCircle size={18} style={{
                            color: "#878787",
                        }} /> Add New Row
                    </button>
                </div>
            </div>
        </>
    );
}

export default ItemTable;


// ---------------------------------------
// SEPARATE SUMMARY BOX COMPONENT
// ---------------------------------------
export function SummaryBox({
    totals,
    taxInfo,
    onTaxChange
}: {
    totals: TotalsBox;
    taxInfo: TaxInfo;
    onTaxChange: (field: string, value: any) => void;
}) {
    return (
        <div className="summary-box fw-normal">
            <div className="d-flex flex-row-reverse">
                <div
                    className="total-box p-3"
                    style={{
                        backgroundColor: "#F1F0F0",
                        borderRadius: "5px",
                        width: "100%",
                        fontSize: "20px"
                    }}
                >
                    <div className="d-flex justify-content-between mb-2">
                        <span>Sub Total</span>
                        <span>{totals.subtotal}</span>
                    </div>

                    <div className="mt-3 mb-2">

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
                                className="form-select form-select-sm w-25"
                                style={{
                                    color: "#878787",
                                    backgroundColor: "#F1F0F0",
                                    height: "35px"

                                }}
                                value={taxInfo.selectedTax}
                                onChange={(e) => onTaxChange("selectedTax", e.target.value)}
                            >
                                <option value="" disabled hidden>Select Tax</option>
                                <option value="5">5%</option>
                                <option value="12">12%</option>
                                <option value="18">18%</option>
                            </select>

                                <span>-0.00</span>

                        </div>
                    </div>

                    <div className="d-flex align-items-center mt-3 fw-normal"
                        style={{
                            color: "#878787",
                            fontSize: "22px",
                            gap: "5.5rem"
                        }}
                    >
                        <label className="col-sm-1 col-form-label">Adjustment</label>
                        <input
                            type="number"
                            className="form-control form-control-sm no-spinner"
                            style={{
                                width: "25%",
                                background: "#D9D9D9",
                                height: "35px"

                            }}
                            value={taxInfo.adjustment}
                            onChange={(e) => onTaxChange("adjustment", Number(e.target.value))}
                        />
                    </div>

                    <hr />

                    <div className="d-flex justify-content-between mt-3 fw-normal">
                        <span style={{
                            fontSize: "22px"
                        }} >Total (₹)</span>
                        <span style={{
                            fontSize: "20px"
                        }} >{totals.grandTotal}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
