import { useNavigate } from "react-router-dom";
import Header from "../../../../components/Header/Header"

const MaintenanceManagementForm = () => {

    const navigate = useNavigate();

    return (
        <>
            <Header />

            <div className="sales-orders-page add-master-setup">

                {/* ================= Maintenance Fee Setup ================= */}
                <div className="so-details-card mx-5 mb-3">
                    <h1 className="sales-order-title mb-3">Maintenance Fee Setup</h1>

                    <div className="row g-3 three-column-form">
                        <div className="col-lg-4">
                            <div className="so-form-group mb-4">
                                <label className="so-label fw-bold">Fee Type</label>
                                <select className="form-select so-control">
                                    <option value="">Select</option>
                                    <option>Monthly Maintenance</option>
                                    <option>Parking</option>
                                    <option>Water Charges</option>
                                </select>
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="so-form-group mb-4">
                                <label className="so-label fw-bold">Calculation Basis</label>
                                <select className="form-select so-control">
                                    <option value="">Select</option>
                                    <option>Flat Wise</option>
                                    <option>Sq. Ft Wise</option>
                                    <option>Fixed</option>
                                </select>
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="so-form-group mb-4">
                                <label className="so-label fw-bold">Rate</label>
                                <input type="number" className="form-control so-control" placeholder="0.00" />
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="so-form-group mb-4">
                                <label className="so-label fw-bold">Effective Date</label>
                                <input type="date" className="form-control so-control" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mx-5" style={{ borderTop: "1px solid #e5e7eb" }} />

                {/* ================= Auto Bill Generation ================= */}
                <div className="so-details-card mx-5 mb-3 mt-3">
                    <h1 className="sales-order-title mb-3">Auto Bill Generation</h1>

                    <div className="row g-3 three-column-form">
                        <div className="col-lg-4">
                            <div className="so-form-group mb-4">
                                <label className="so-label fw-bold">Auto Invoice</label>
                                <input type="text" className="form-control so-control" />
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="so-form-group mb-4">
                                <label className="so-label fw-bold">Bill Title</label>
                                <input type="text" className="form-control so-control" />
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="so-form-group mb-4">
                                <label className="so-label fw-bold">Amount</label>
                                <input type="number" className="form-control so-control" />
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="so-form-group mb-4">
                                <label className="so-label fw-bold">Date Range</label>
                                <input type="date" className="form-control so-control" />
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="so-form-group mb-4">
                                <label className="so-label fw-bold">Description</label>
                                <input type="text" className="form-control so-control" />
                            </div>
                        </div>

                        <div className="so-form-group col-lg-4">
                            <label className="so-label text-sm text-muted-foreground fw-bold">Include Penalties</label>
                            <div className="radio-row" style={{ fontSize: 13 }}>
                                <div className="form-check">
                                    <input type="radio" className="form-check-input" name="penalty" />
                                    <label className="form-check-label">Yes</label>
                                </div>
                                <div className="form-check">
                                    <input type="radio" className="form-check-input" name="penalty" />
                                    <label className="form-check-label">No</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mx-5" style={{ borderTop: "1px solid #e5e7eb" }} />

                {/* ================= Late Fee / Penalty Setup ================= */}
                <div className="so-details-card mx-5 mb-3 mt-3">
                    <h1 className="sales-order-title mb-3">Late Fee / Penalty Setup</h1>

                    <div className="row g-3 three-column-form">
                        <div className="col-lg-4">
                            <div className="so-form-group mb-4">
                                <label className="so-label fw-bold">Grace Period (Days)</label>
                                <input type="number" className="form-control so-control" />
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="so-form-group mb-4">
                                <label className="so-label fw-bold">Penalty Type</label>
                                <select className="form-select so-control">
                                    <option>Fixed</option>
                                    <option>Percentage</option>
                                </select>
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="so-form-group mb-4">
                                <label className="so-label fw-bold">Penalty Amount</label>
                                <input type="number" className="form-control so-control" />
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <label className="so-label text-sm text-muted-foreground fw-bold">Auto Apply</label>
                            <div className="radio-row" style={{ fontSize: 13 }}>
                                <div className="form-check">
                                    <input type="radio" className="form-check-input" name="autoApply" />
                                    <label className="form-check-label">Yes</label>
                                </div>
                                <div className="form-check">
                                    <input type="radio" className="form-check-input" name="autoApply" />
                                    <label className="form-check-label">No</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mx-5" style={{ borderTop: "1px solid #e5e7eb" }} />

                {/* PAYMENT COLLECTION */}

                <div className="so-details-card mx-5 mb-3 mt-3">
                    <h1 className="sales-order-title mb-3">Payment Collection</h1>

                    <div className="row g-3 three-column-form">
                        <div className="col-lg-4">
                            <div className="so-form-group mb-4">
                                <label className="so-label fw-bold">Payment Modes</label>
                                <select className="form-select so-control">
                                    <option value="">Select</option>
                                    <option>Cash</option>
                                    <option>UPI</option>
                                    <option>Cheque</option>
                                    <option>Bank Transfer</option>
                                </select>
                            </div>

                            <label className="so-label text-sm text-muted-foreground fw-bold">Amount Received</label>
                            <div className="radio-row" style={{ fontSize: 13 }}>
                                <div className="form-check">
                                    <input type="radio" className="form-check-input" name="amountReceived" />
                                    <label className="form-check-label">Yes</label>
                                </div>
                                <div className="form-check">
                                    <input type="radio" className="form-check-input" name="amountReceived" />
                                    <label className="form-check-label">No</label>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="so-form-group mb-4">
                                <label className="so-label fw-bold">Receipt No</label>
                                <input type="text" className="form-control so-control" />
                            </div>

                            <div className="so-form-group mb-4">
                                <label className="so-label fw-bold">Collected By</label>
                                <select className="form-select so-control">
                                    <option value="">Select</option>
                                    <option>Admin</option>
                                    <option>Accountant</option>
                                </select>
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="so-form-group mb-4">
                                <label className="so-label fw-bold">Payment Date</label>
                                <input type="date" className="form-control so-control" />
                            </div>

                            <div className="so-form-group mb-4">
                                <label className="so-label fw-bold">Auto Generate Receipts</label>
                                <input type="text" className="form-control so-control" />
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="so-form-group mb-4">
                                <label className="so-label fw-bold">Advance Amount Paid</label>
                                <input type="number" className="form-control so-control" />
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="so-form-group mb-4">
                                <label className="so-label fw-bold">Remaining Advance Balance</label>
                                <input type="number" className="form-control so-control" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* OUTSTSANDING DUE TRACKER */}
                <div className="mx-5" style={{ borderTop: "1px solid #e5e7eb" }} />

                <div className="so-details-card mx-5 mb-3 mt-3">
                    <h1 className="sales-order-title mb-3">Outstanding Dues Tracker</h1>

                    <div className="row g-3 three-column-form">
                        <div className="col-lg-4">
                            <div className="so-form-group mb-4">
                                <label className="so-label fw-bold">Flat No</label>
                                <input type="text" className="form-control so-control" />
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="so-form-group mb-4">
                                <label className="so-label fw-bold">Resident Name</label>
                                <input type="text" className="form-control so-control" />
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="so-form-group mb-4">
                                <label className="so-label fw-bold">Outstanding Amount</label>
                                <input type="number" className="form-control so-control" />
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="so-form-group mb-4">
                                <label className="so-label fw-bold">Due Since Date</label>
                                <input type="date" className="form-control so-control" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reminder Notifications */}
                <div className="mx-5" style={{ borderTop: "1px solid #e5e7eb" }} />

                <div className="so-details-card mx-5 mb-3 mt-3">
                    <h1 className="sales-order-title mb-3">Reminder Notifications</h1>

                    <div className="row g-3 three-column-form">
                        <div className="col-lg-4">
                            <div className="so-form-group mb-4">
                                <label className="so-label fw-bold">Reminder Type</label>
                                <select className="form-select so-control">
                                    <option>Email</option>
                                    <option>SMS</option>
                                    <option>WhatsApp</option>
                                </select>
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="so-form-group mb-4">
                                <label className="so-label fw-bold">Auto Reminder Frequency</label>
                                <input type="text" className="form-control so-control" placeholder="e.g. Every 7 Days" />
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="so-form-group mb-4">
                                <label className="so-label fw-bold">Custom Message</label>
                                <input type="text" className="form-control so-control" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Maintenance Ledger */}

                <div className="mx-5" style={{ borderTop: "1px solid #e5e7eb" }} />

                <div className="so-details-card mx-5 mb-3 mt-3">
                    <h1 className="sales-order-title mb-3">Maintenance Ledger</h1>

                    <div className="row g-5 mx-4">
                        {/* Column 1 */}
                        <div className="col-lg-6">
                            <div className="so-form-group mb-4">
                                <label className="so-label fw-bold">Transaction Type</label>
                                <select className="form-select so-control">
                                    <option>Debit</option>
                                    <option>Credit</option>
                                </select>
                            </div>
                        </div>

                        {/* Column 2 */}
                        <div className="col-lg-6">
                            <div className="so-form-group mb-4">
                                <label className="so-label fw-bold">Balance Type</label>
                                <select className="form-select so-control">
                                    <option>Opening</option>
                                    <option>Closing</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>




                {/* Exemption Handling */}

                <div className="mx-5" style={{ borderTop: "1px solid #e5e7eb" }} />

                <div className="so-details-card mx-5 mb-3 mt-3">
                    <h1 className="sales-order-title mb-3">Exemption Handling</h1>

                    <div className="row g-3 three-column-form">
                        <div className="col-lg-4">
                            <div className="so-form-group mb-4">
                                <label className="so-label fw-bold">Flat No</label>
                                <select className="form-select so-control">
                                    <option value="">Select</option>
                                </select>
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="so-form-group mb-4">
                                <label className="so-label fw-bold">Reason</label>
                                <select className="form-select so-control">
                                    <option>Vacant</option>
                                    <option>Special Approval</option>
                                </select>
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="so-form-group mb-4">
                                <label className="so-label fw-bold">Time Period</label>
                                <input type="text" className="form-control so-control" />
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <label className="so-label text-sm text-muted-foreground fw-bold">Approval By Admin</label>
                            <div className="radio-row" style={{ fontSize: 13 }}>
                                <div className="form-check">
                                    <input type="radio" className="form-check-input" name="adminApproval" />
                                    <label className="form-check-label">Yes</label>
                                </div>
                                <div className="form-check">
                                    <input type="radio" className="form-check-input" name="adminApproval" />
                                    <label className="form-check-label">No</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Buttons */}
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
                        style={{ background: '#7991BB', color: '#FFF' }}
                    >
                        Save
                    </button>
                </div>


            </div>
        </>
    )
}

export default MaintenanceManagementForm;