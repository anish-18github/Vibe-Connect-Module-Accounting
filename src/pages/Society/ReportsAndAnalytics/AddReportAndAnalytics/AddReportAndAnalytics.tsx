import { useNavigate } from "react-router-dom";
import Header from "../../../../components/Header/Header";
import './addReportAndAnalytics.css'

const ReportsAnalytics = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
    };

    const navigate = useNavigate();


    return (
        <>
            <Header />

            <div className="sales-orders-page">
                <form onSubmit={handleSubmit} className="sales-order-form">
                    {/* Income Reports */}
                    <div className="so-details-card mx-5 mb-4">
                        <h1 className="sales-order-title mb-4">Income Reports</h1>

                        <div className="row g-3 three-column-form">
                            {/* Col 1 */}
                            <div className="col-lg-4">
                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Date Range:
                                    </label>
                                    <input type="date" className="form-control so-control" />
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Flat:
                                    </label>
                                    <input type="text" className="form-control so-control" />
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Payment Date:
                                    </label>
                                    <input type="date" className="form-control so-control" />
                                </div>

                                <div className="so-form-group mb-0">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Amount Received:
                                    </label>
                                    <input type="number" className="form-control so-control" />
                                </div>
                            </div>

                            {/* Col 2 */}
                            <div className="col-lg-4">
                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Financial Report:
                                    </label>
                                    <select className="form-select so-control">
                                        <option value="">Select</option>
                                    </select>
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Member Name:
                                    </label>
                                    <select className="form-select so-control">
                                        <option value="">Select</option>
                                    </select>
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Payment Mode:
                                    </label>
                                    <select className="form-select so-control">
                                        <option value="">Select</option>
                                    </select>
                                </div>

                                <div className="so-form-group mb-0">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Due Amount:
                                    </label>
                                    <input type="number" className="form-control so-control" />
                                </div>
                            </div>

                            {/* Col 3 */}
                            <div className="col-lg-4">
                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Building:
                                    </label>
                                    <select className="form-select so-control">
                                        <option value="">Select</option>
                                    </select>
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Income Category:
                                    </label>
                                    <select className="form-select so-control">
                                        <option value="">Select</option>
                                    </select>
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Receipt Number:
                                    </label>
                                    <input type="text" className="form-control so-control" />
                                </div>

                                <div className="so-form-group mb-0">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Remarks:
                                    </label>
                                    <input type="text" className="form-control so-control" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="mx-5" style={{ borderTop: "1px solid #e5e7eb" }} />

                    {/* Expense Reports */}
                    <div className="so-details-card mx-5 mb-4 mt-3">
                        <h2 className="sales-order-title mb-4">Expense Reports</h2>

                        <div className="row g-3 three-column-form">
                            {/* Col 1 */}
                            <div className="col-lg-4">
                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Date Range:
                                    </label>
                                    <input type="date" className="form-control so-control" />
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Payment Date:
                                    </label>
                                    <input type="date" className="form-control so-control" />
                                </div>

                                <div className="so-form-group mb-0">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Document:
                                    </label>
                                    <input type="file" className="form-control so-control" />
                                </div>
                            </div>

                            {/* Col 2 */}
                            <div className="col-lg-4">
                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Vendor Name:
                                    </label>
                                    <select className="form-select so-control">
                                        <option value="">Select</option>
                                    </select>
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Amount Paid:
                                    </label>
                                    <input type="number" className="form-control so-control" />
                                </div>

                                <div className="so-form-group mb-0">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Remark:
                                    </label>
                                    <input type="text" className="form-control so-control" />
                                </div>
                            </div>

                            {/* Col 3 */}
                            <div className="col-lg-4">
                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Expense Category:
                                    </label>
                                    <select className="form-select so-control">
                                        <option value="">Select</option>
                                    </select>
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Payment Mode:
                                    </label>
                                    <select className="form-select so-control">
                                        <option value="">Select</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mx-5" style={{ borderTop: "1px solid #e5e7eb" }} />


                    {/* Balance Sheet */}
                    <div className="so-details-card mx-5 mb-4 mt-3">
                        <h2 className="sales-order-title mb-4">Balance Sheet</h2>

                        <div className="row g-3 three-column-form mb-3">
                            <div className="col-lg-4">
                                <div className="so-form-group mb-0">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Date:
                                    </label>
                                    <input type="date" className="form-control so-control" />
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div className="so-form-group mb-0">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Building:
                                    </label>
                                    <select className="form-select so-control">
                                        <option value="">Select</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Asset Category table */}
                        <div className="item-card mb-3">
                            <div className="item-card-header">
                                <span className="item-card-title">Asset Category</span>
                            </div>

                            <div className="item-card-body">
                                <table className="table table-sm align-middle item-table-inner item-table-bordered">
                                    <thead>
                                        <tr>
                                            <th className="fw-medium text-dark">Category</th>
                                            <th className="fw-medium text-dark text-end">Input</th>
                                        </tr>
                                    </thead>

                                    <tbody className="item-table-body">
                                        {[
                                            "Cash In Hand",
                                            "Bank Balance",
                                            "Fixed Deposits",
                                            "Receivables (Auto)",
                                            "Prepaid Expenses",
                                            "Vendor Advance Payment",
                                            "Other Investments",
                                            "Other Tangible Assets",
                                        ].map((label, i) => (
                                            <tr key={i}>
                                                <td className="text-muted-foreground small">{label}</td>
                                                <td className="text-end">
                                                    <input
                                                        type="number"
                                                        className="form-control form-control-sm no-spinner border-0 text-end item-input-sm item-input-narrow"
                                                        placeholder="0"
                                                    />
                                                </td>
                                            </tr>
                                        ))}

                                        <tr className="item-table-footer">
                                            <td className="fw-bold small">Total Assets</td>
                                            <td className="text-end">
                                                <input
                                                    type="number"
                                                    className="form-control form-control-sm no-spinner border-0 text-end item-input-sm item-input-narrow"
                                                    placeholder="0"
                                                    disabled
                                                />
                                            </td>
                                        </tr>
                                    </tbody>

                                </table>


                            </div>
                        </div>


                        {/* Liability Category table */}
                        <div className="item-card mb-3">
                            <div className="item-card-header">
                                <span className="item-card-title">Liability Category</span>
                            </div>
                            <div className="item-card-body">
                                <table className="table table-sm align-middle item-table-inner">
                                    <thead>
                                        <tr>
                                            <th className="fw-medium text-dark">Category</th>
                                            <th className="fw-medium text-dark text-end">Input</th>
                                        </tr>
                                    </thead>
                                    <tbody className="item-table-body">
                                        {[
                                            "Member Deposits / Sinking Fund",
                                            "Advance Maintenance Collected",
                                            "Vendor Payables",
                                            "Statutory Dues (TDS, GST, Property)",
                                            "Loan Outstanding",
                                            "Audit / Legal Provisions",
                                            "Other Liabilities",
                                        ].map((label, i) => (
                                            <tr key={i}>
                                                <td>{label}</td>
                                                <td className="text-end">
                                                    <input
                                                        type="number"
                                                        className="form-control form-control-sm no-spinner border-0 text-end item-input-narrow"
                                                        placeholder="0"
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td className="fw-bold">Total Liability</td>
                                            <td className="text-end">
                                                <input
                                                    type="number"
                                                    className="form-control form-control-sm no-spinner border-0 text-end item-input-narrow"
                                                    placeholder="0"
                                                    disabled
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Equity / Capital table */}
                        <div className="item-card">
                            <div className="item-card-header">
                                <span className="item-card-title">Equity and Capital</span>
                            </div>
                            <div className="item-card-body">
                                <table className="table table-sm align-middle item-table-inner">
                                    <thead>
                                        <tr>
                                            <th className="fw-medium text-dark">Equity / Capital</th>
                                            <th className="fw-medium text-dark text-end">Input</th>
                                        </tr>
                                    </thead>
                                    <tbody className="item-table-body">
                                        {[
                                            "Opening Fund Balance",
                                            "Current Year Surplus / Deficit",
                                            "Reserves & Special Funds",
                                        ].map((label, i) => (
                                            <tr key={i}>
                                                <td>{label}</td>
                                                <td className="text-end">
                                                    <input
                                                        type="number"
                                                        className="form-control form-control-sm no-spinner border-0 text-end item-input-narrow"
                                                        placeholder="0"
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                        <tr className="table-footer-row">
                                            <td className="fw-bold">Total Equity</td>
                                            <td className="text-end">
                                                <input
                                                    type="number"
                                                    className="form-control form-control-sm no-spinner border-0 text-end item-input-narrow"
                                                    placeholder="0"
                                                    disabled
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="mx-5" style={{ borderTop: "1px solid #e5e7eb" }} />


                    {/* Profit & Loss */}
                    <div className="so-details-card mx-5 mb-4 mt-3">
                        <h2 className="sales-order-title mb-4">Profit &amp; Loss</h2>

                        <div className="row g-3 three-column-form mb-3">
                            <div className="col-lg-4">
                                <div className="so-form-group mb-0">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Date:
                                    </label>
                                    <input type="date" className="form-control so-control" />
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div className="so-form-group mb-0">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Building:
                                    </label>
                                    <select className="form-select so-control">
                                        <option value="">Select</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Income table */}
                        <div className="item-card mb-3">
                            <div className="item-card-header">
                                <span className="item-card-title">Income</span>
                            </div>
                            <div className="item-card-body">
                                <table className="table table-sm align-middle item-table-inner">
                                    <thead>
                                        <tr>
                                            <th className="fw-medium text-dark">Income</th>
                                            <th className="fw-medium text-dark text-end">Input</th>
                                        </tr>
                                    </thead>
                                    <tbody className="item-table-body">
                                        {[
                                            "Maintenance Charges",
                                            "Parking Fees",
                                            "Rental Income",
                                            "Interest on Fixed",
                                            "Penalty / Late Fees",
                                            "Facility Booking Charges",
                                            "Donations / Grants",
                                            "Other Income",
                                        ].map((label, i) => (
                                            <tr key={i}>
                                                <td>{label}</td>
                                                <td className="text-end">
                                                    <input
                                                        type="number"
                                                        className="form-control form-control-sm no-spinner border-0 text-end item-input-narrow"
                                                        placeholder="0"
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td className="fw-bold">Total Income</td>
                                            <td className="text-end">
                                                <input
                                                    type="number"
                                                    className="form-control form-control-sm no-spinner border-0 text-end item-input-narrow"
                                                    placeholder="0"
                                                    disabled
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Expenditure table */}
                        <div className="item-card">
                            <div className="item-card-header">
                                <span className="item-card-title">Expenditure</span>
                            </div>
                            <div className="item-card-body">
                                <table className="table table-sm align-middle item-table-inner">
                                    <thead>
                                        <tr>
                                            <th className="fw-medium text-dark">Expenditure</th>
                                            <th className="fw-medium text-dark text-end">Input</th>
                                        </tr>
                                    </thead>
                                    <tbody className="item-table-body">
                                        {[
                                            "Security",
                                            "Housekeeping / Cleaning",
                                            "Electricity",
                                            "Water Supply",
                                            "Repairs & Maintenance",
                                            "Staff Salaries",
                                            "Office/Admin Expenses",
                                            "Insurance Premiums",
                                            "Statutory Payments",
                                            "Event Expenses",
                                            "Professional Fees",
                                            "Other Custom Expense",
                                        ].map((label, i) => (
                                            <tr key={i}>
                                                <td>{label}</td>
                                                <td className="text-end">
                                                    <input
                                                        type="number"
                                                        className="form-control form-control-sm no-spinner border-0 text-end item-input-narrow"
                                                        placeholder="0"
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td className="fw-bold">Total Expenditure</td>
                                            <td className="text-end">
                                                <input
                                                    type="number"
                                                    className="form-control form-control-sm no-spinner border-0 text-end item-input-narrow"
                                                    placeholder="0"
                                                    disabled
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="mx-5" style={{ borderTop: "1px solid #e5e7eb" }} />


                    {/* Maintenance Due Report */}
                    <div className="so-details-card mx-5 mb-4 mt-3">
                        <h2 className="sales-order-title mb-4">Maintenance Due Report</h2>

                        <div className="row g-3 three-column-form">
                            <div className="col-lg-4">
                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Building:
                                    </label>
                                    <select className="form-select so-control">
                                        <option value="">Select</option>
                                    </select>
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Billing Period:
                                    </label>
                                    <input type="text" className="form-control so-control" />
                                </div>

                                <div className="so-form-group mb-0">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Payment Status:
                                    </label>
                                    <select className="form-select so-control">
                                        <option value="">Select</option>
                                    </select>
                                </div>
                            </div>

                            <div className="col-lg-4">
                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Flat:
                                    </label>
                                    <select className="form-select so-control">
                                        <option value="">Select</option>
                                    </select>
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Amount Paid:
                                    </label>
                                    <input type="number" className="form-control so-control" />
                                </div>

                                <div className="so-form-group mb-0">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Remark:
                                    </label>
                                    <input type="text" className="form-control so-control" />
                                </div>
                            </div>

                            <div className="col-lg-4">
                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Owner Name:
                                    </label>
                                    <input type="text" className="form-control so-control" />
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Amount Due:
                                    </label>
                                    <input type="number" className="form-control so-control" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mx-5" style={{ borderTop: "1px solid #e5e7eb" }} />


                    {/* Forecasting */}
                    <div className="so-details-card mx-5 mb-4 mt-3">
                        <h2 className="sales-order-title mb-4">Forecasting</h2>

                        <div className="row g-3 three-column-form">
                            <div className="col-lg-4">
                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Category:
                                    </label>
                                    <select className="form-select so-control">
                                        <option value="">Select</option>
                                    </select>
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Start Date:
                                    </label>
                                    <input type="date" className="form-control so-control" />
                                </div>

                                <div className="so-form-group mb-0">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Remark:
                                    </label>
                                    <input type="text" className="form-control so-control" />
                                </div>
                            </div>

                            <div className="col-lg-4">
                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Expected Amount (₹):
                                    </label>
                                    <input type="number" className="form-control so-control" />
                                </div>

                                <div className="so-form-group mb-0">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        End Date:
                                    </label>
                                    <input type="date" className="form-control so-control" />
                                </div>
                            </div>

                            <div className="col-lg-4">
                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Frequency:
                                    </label>
                                    <select className="form-select so-control">
                                        <option value="">Select</option>
                                    </select>
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Basis / Assumption:
                                    </label>
                                    <input type="text" className="form-control so-control" />
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
                </form>
            </div>
        </>
    );
};

export default ReportsAnalytics;
