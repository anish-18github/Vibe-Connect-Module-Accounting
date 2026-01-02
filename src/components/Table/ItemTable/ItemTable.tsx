// import { X } from "react-feather";

import { Plus, X } from 'react-feather';

import React, { useEffect, useState } from 'react';
// import { TaxOption } from '../../../../services/api/taxService';

import './itemTable.css';
// import type { TaxOption } from '../../../services/api/taxService';

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
  onRemoveRow: (index: number) => void; // ➜ NEW
}

// ---------------------------
// MAIN ITEM TABLE COMPONENT
// ---------------------------
function ItemTable({ rows, onRowChange, onAddRow, onRemoveRow }: ItemTableProps) {
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
                        style={{ height: 30 }}
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
                        style={{ height: 30 }}
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
                        style={{ height: 30 }}
                        value={row.rate}
                        onChange={(e) => onRowChange(index, e)}
                      />
                    </td>

                    <td>
                      <div className="position-relative">
                        <input
                          type="number"
                          name="discount"
                          className="form-control form-control-sm no-spinner border-0 pe-4"
                          placeholder="00"
                          value={row.discount}
                          style={{ height: 30 }}
                          onChange={(e) => onRowChange(index, e)}
                        />
                        <span
                          className="position-absolute top-50 end-0 translate-middle-y me-2 text-muted"
                          style={{ pointerEvents: 'none', fontSize: 12 }}
                        >
                          %
                        </span>
                      </div>
                    </td>


                    <td>
                      <input
                        type="text"
                        className="form-control form-control-sm border-0"
                        style={{ height: 30 }}
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

/* ================= INTERFACES ================= */

export interface TotalsBox {
  subtotal: number;
  tax: number;
  total: number;
  grandTotal: number;
}

export interface TaxInfo {
  type: 'TDS' | 'TCS' | '';
  selectedTax: string;
  adjustment: number;
  taxRate: number;
  taxAmount: number;
  total: number;
}

export interface TdsOption {
  id: number;
  name: string;
  rate: number;
}

export interface TcsOption {
  id: string;
  name: string;
  rate: number;
}

export interface SummaryBoxProps {
  totals: TotalsBox;
  taxInfo: TaxInfo;
  onTaxChange: (field: keyof TaxInfo | 'type', value: any) => void;

  tcsOptions: TcsOption[];
  tdsOptions: TdsOption[];
  loadingTax: boolean;

  onAddTcs: (data: { name: string; rate: number }) => void;

  // ✅ optional for now
  onEditTcs?: (id: string, data: { name: string; rate: number }) => void;
  onDeleteTcs?: (id: string) => void;
}


/* ================= COMPONENT ================= */

export function SummaryBox({
  totals,
  taxInfo,
  onTaxChange,
  tdsOptions,
  tcsOptions,
  loadingTax,
  onAddTcs,
  onEditTcs,
  onDeleteTcs,
}: SummaryBoxProps) {
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [rate, setRate] = useState<number | ''>('');

  /* ---------- OPEN ADD MODAL ---------- */
  const openAddModal = () => {
    setEditId(null);
    setName('');
    setRate('');
    setShowModal(true);
  };

  /* ---------- OPEN EDIT MODAL ---------- */
  // const openEditModal = (opt: TcsOption) => {
  //   setEditId(opt.id);
  //   setName(opt.name);
  //   setRate(opt.rate);
  //   setShowModal(true);
  // };

  /* ---------- SAVE TCS ---------- */
  const handleSave = () => {
    if (!name.trim() || rate === '' || rate <= 0) return;

    const payload = {
      name: name.trim(),
      rate: Number(rate),
    };

    if (editId) {
      // ✅ safe optional call + correct arguments
      onEditTcs?.(editId, payload);
    } else {
      onAddTcs(payload);
    }

    setShowModal(false);
  };


  /* ---------- WATCH "+ ADD NEW" ---------- */
  useEffect(() => {
    if (taxInfo.type === 'TCS' && taxInfo.selectedTax === '_add_new') {
      openAddModal();
      onTaxChange('selectedTax', '');
    }
  }, [taxInfo.selectedTax, taxInfo.type]);

  /* ================= JSX ================= */

  return (
    <>
      <div className="summary-box">
        <div className="total-box p-3" style={{ background: '#F1F0F0', borderRadius: 6, fontSize: 14 }}>
          {/* Subtotal */}
          <div className="d-flex justify-content-between mb-2">
            <span>Sub Total</span>
            <span>{totals.subtotal.toFixed(2)}</span>
          </div>

          {/* Tax Type */}
          <div className="mt-3 mb-2">
            <label className="form-label fw-bold mb-1">Tax Type</label>

            <div className="d-flex align-items-center gap-3" style={{ fontSize: 12 }}>
              <label className="d-flex align-items-center gap-1">
                <input
                  type="radio"
                  name="taxType"
                  checked={taxInfo.type === 'TDS'}
                  onChange={() => onTaxChange('type', 'TDS')}
                />{' '}
                TDS
              </label>

              <label className="d-flex align-items-center gap-1">
                <input
                  type="radio"
                  name="taxType"
                  checked={taxInfo.type === 'TCS'}
                  onChange={() => onTaxChange('type', 'TCS')}
                />{' '}
                TCS
              </label>

              {/* ---------- TDS (READ ONLY) ---------- */}
              {taxInfo.type === 'TDS' && (
                <select
                  className="form-select form-select-sm w-50"
                  disabled={loadingTax}
                  value={taxInfo.selectedTax}
                  style={{
                    background: '#F1F0F0',
                  }}
                  onChange={(e) => onTaxChange('selectedTax', e.target.value)}
                >
                  <option value="">Select TDS</option>
                  {tdsOptions.map((t) => (
                    <option key={t.id} value={t.rate}>
                      {t.name} – {t.rate}%
                    </option>
                  ))}
                </select>
              )}

              {/* ---------- TCS (CRUD) ---------- */}
              {taxInfo.type === 'TCS' && (
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>

                  <select
                    className="form-select form-select-sm"
                    value={taxInfo.selectedTax}
                    onChange={(e) => onTaxChange('selectedTax', e.target.value)}
                    style={{ minWidth: 100, background: '#F1F0F0', fontSize: 12 }}
                  >
                    <option value="">Select TCS</option>
                    {tcsOptions.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.name} – {opt.rate}%
                      </option>
                    ))}
                    <option value="_add_new">+ Add New</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Adjustment */}
          <div className="mt-3 d-flex align-items-center">
            <label className="form-label me-3">Adjustment</label>
            <input
              type="number"
              className="form-control form-control-sm no-spinner border-0"
              placeholder='0'
              style={{ width: 120, background: '#D9D9D9' }}
              value={taxInfo.adjustment || ''}
              onChange={(e) => onTaxChange('adjustment', Number(e.target.value))}
            />
          </div>

          <hr />

          {/* Total */}
          <div className="d-flex justify-content-between mt-3">
            <strong>Total (₹)</strong>
            <strong>{totals.grandTotal.toFixed(2)}</strong>
          </div>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="tcs-modal-backdrop">
          <div className="tcs-modal">
            <h5 style={{ fontSize: 15 }}>{editId ? 'Edit TCS' : 'Add TCS'}</h5>


            <div style={{ fontSize: 13 }}>

              <div className="mb-2">
                <label className="form-label">Tax Name</label>
                <input
                  className="form-control mb-2"
                  placeholder="e.g. Service tax"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Rate %</label>
                <input
                  className="form-control mb-3"
                  type="number"
                  placeholder="e.g. 1.8 %"
                  value={rate}
                  onChange={(e) => setRate(e.target.value === '' ? '' : Number(e.target.value))}
                />
              </div>
            </div>

            <div className="d-flex justify-content-between">
              {editId && (
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => {
                    onDeleteTcs?.(editId);
                    setShowModal(false);
                  }}
                >
                  Delete
                </button>
              )}

              <div className="ms-auto">
                <button className="btn border me-3 px-3" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button className="btn px-4"
                  style={{ background: '#7991BB', color: '#FFF' }} onClick={handleSave}>
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
