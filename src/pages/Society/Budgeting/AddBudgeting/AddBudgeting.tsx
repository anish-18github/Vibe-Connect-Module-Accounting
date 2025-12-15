import { useNavigate } from "react-router-dom";
import Header from "../../../../components/Header/Header";
import { FeatherUpload } from "../../../Sales/Customers/AddCustomer/Add";
import { Plus } from "react-feather";

const AddBudgeting = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        // submit logic
    };

    const navigate = useNavigate();

    return (
        <>
            <Header />

            <div className="sales-orders-page add-master-setup">
                <form onSubmit={handleSubmit} className="sales-order-form ">
                    {/* Annual Budget Setup */}
                    <div className="so-details-card mx-5 mb-4">
                        <h1 className="sales-order-title mb-4">Annual Budget Setup</h1>

                        <div className="row g-3 three-column-form">
                            {/* COL 1 */}
                            <div className="col-lg-4">
                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Financial Year:
                                    </label>
                                    <select className="form-select so-control">
                                        <option value="">Select</option>
                                    </select>
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Category Name:
                                    </label>
                                    <input type="text" className="form-control so-control" />
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Added By:
                                    </label>
                                    <input type="text" className="form-control so-control" />
                                </div>

                                <div className="so-form-group mb-0">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Note:
                                    </label>
                                    <textarea className="form-control so-control textarea" />
                                </div>
                            </div>

                            {/* COL 2 */}
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
                                        Frequency:
                                    </label>
                                    <select className="form-select so-control">
                                        <option value="">Select</option>
                                    </select>
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Created Date:
                                    </label>
                                    <input type="date" className="form-control so-control" />
                                </div>
                            </div>

                            {/* COL 3 */}
                            <div className="col-lg-4">
                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Category Type:
                                    </label>
                                    <select className="form-select so-control">
                                        <option value="">Select</option>
                                    </select>
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Planned Amount:
                                    </label>
                                    <input type="number" className="form-control so-control" />
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Last Modified Date:
                                    </label>
                                    <input type="date" className="form-control so-control" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Monthly Allocation */}
                    <div className="so-details-card mx-5 mb-4">
                        <h2 className="sales-order-title mb-4">Monthly Allocation</h2>

                        <div className="row g-3 three-column-form">
                            <div className="col-lg-4">
                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Monthly Allocation:
                                    </label>
                                    <select className="form-select so-control">
                                        <option value="">Select</option>
                                    </select>
                                </div>
                            </div>

                            <div className="col-lg-4">
                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Month:
                                    </label>
                                    <select className="form-select so-control">
                                        <option value="">Select</option>
                                    </select>
                                </div>
                            </div>

                            <div className="col-lg-4">
                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Allocated Amount:
                                    </label>
                                    <input type="number" className="form-control so-control" />
                                </div>
                            </div>
                        </div>

                        <div className="row g-3">

                            <div className="col-lg-4">
                                <div className="so-form-group mb-0">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Note:
                                    </label>
                                    <input type="text" className="form-control so-control textarea" />
                                </div>
                            </div>

                            <div className="col-lg-4 d-flex align-items-center">
                                <label className="so-label text-sm text-muted-foreground fw-bold me-3 mb-0">
                                    Auto-Recalculate:
                                </label>
                                {/* Replace with your own switch/toggle */}
                                <input type="checkbox" />
                            </div>


                        </div>
                    </div>

                    {/* Budget vs Actual */}
                    <div className="so-details-card mx-5 mb-4">
                        <h2 className="sales-order-title mb-4">Budget vs Actual Comparison</h2>

                        <div className="item-card">
                            <div className="item-card-header">
                                <span className="item-card-title">Budget vs Actual</span>
                            </div>

                            <div className="item-card-body">
                                <div className="row">
                                    <div className="col-md-12">
                                        <table className="table table-sm align-middle item-table-inner">
                                            <thead>
                                                <tr>
                                                    <th className="fw-medium text-dark">Category</th>
                                                    <th className="fw-medium text-dark">Budgeted</th>
                                                    <th className="fw-medium text-dark">Actual</th>
                                                    <th className="fw-medium text-dark">Variance(₹)</th>
                                                    <th className="fw-medium text-dark">Variance(%)</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {/* Row 1 */}
                                                <tr>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            className="form-control form-control-sm border-0"
                                                            placeholder="Category"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            className="form-control form-control-sm no-spinner border-0"
                                                            placeholder="00.00"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            className="form-control form-control-sm no-spinner border-0"
                                                            placeholder="00.00"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            className="form-control form-control-sm no-spinner border-0"
                                                            placeholder="00.00"
                                                        />
                                                    </td>
                                                    <td className="d-flex align-items-center">
                                                        <input
                                                            type="number"
                                                            className="form-control form-control-sm no-spinner border-0"
                                                            placeholder="00.00"
                                                        />
                                                        <span className="ms-1">%</span>
                                                    </td>
                                                </tr>

                                                {/* Row 2 */}
                                                <tr>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            className="form-control form-control-sm border-0"
                                                            placeholder="Category"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            className="form-control form-control-sm no-spinner border-0"
                                                            placeholder="00.00"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            className="form-control form-control-sm no-spinner border-0"
                                                            placeholder="00.00"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            className="form-control form-control-sm no-spinner border-0"
                                                            placeholder="00.00"
                                                        />
                                                    </td>
                                                    <td className="d-flex align-items-center">
                                                        <input
                                                            type="number"
                                                            className="form-control form-control-sm no-spinner border-0"
                                                            placeholder="00.00"
                                                        />
                                                        <span className="ms-1">%</span>
                                                    </td>
                                                </tr>

                                                {/* Row 3 */}
                                                <tr>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            className="form-control form-control-sm border-0"
                                                            placeholder="Category"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            className="form-control form-control-sm no-spinner border-0"
                                                            placeholder="00.00"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            className="form-control form-control-sm no-spinner border-0"
                                                            placeholder="00.00"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            className="form-control form-control-sm no-spinner border-0"
                                                            placeholder="00.00"
                                                        />
                                                    </td>
                                                    <td className="d-flex align-items-center">
                                                        <input
                                                            type="number"
                                                            className="form-control form-control-sm no-spinner border-0"
                                                            placeholder="00.00"
                                                        />
                                                        <span className="ms-1">%</span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>

                                        {/* later you can wire this to add more rows dynamically */}
                                        <button
                                            type="button"
                                            className="btn btn-sm fw-bold item-add-row-btn"
                                        >
                                            <Plus size={16} /> Add New Row
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Revision History */}
                    <div className="so-details-card mx-5 mb-4">
                        <h2 className="sales-order-title mb-4">Revision History</h2>

                        <div className="row g-3 three-column-form">
                            <div className="col-lg-4">
                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Revision ID:
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control so-control"
                                        placeholder="REV-BUD-2025-01"
                                    />
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Previous Budget:
                                    </label>
                                    <input type="number" className="form-control so-control" />
                                </div>

                                <div className="so-form-group mb-0">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Revised By:
                                    </label>
                                    <input type="text" className="form-control so-control" />
                                </div>
                            </div>

                            <div className="col-lg-4">
                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Budget Type:
                                    </label>
                                    <select className="form-select so-control">
                                        <option value="">Select</option>
                                    </select>
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Revised Budget:
                                    </label>
                                    <input type="number" className="form-control so-control" />
                                </div>


                                <div className="so-form-group mb-0">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Document:
                                    </label>
                                    <div
                                        className="doc-upload-box"
                                        onClick={() =>
                                            document.getElementById("doc-share-upload")?.click()
                                        }
                                    >
                                        <FeatherUpload size={16} className="text-muted mb-1" />
                                        <span className="text-secondary small">
                                            Click to Upload Documents
                                        </span>

                                        <input
                                            id="doc-share-upload"
                                            type="file"
                                            multiple
                                            className="d-none"
                                            onChange={(e) => {
                                                const files = e.target.files;
                                                if (files?.length) {
                                                    console.log("Share Register files:", files);
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-4">
                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Category Name:
                                    </label>
                                    <select className="form-select so-control">
                                        <option value="">Select</option>
                                    </select>
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Variance(₹):
                                    </label>
                                    <input type="number" className="form-control so-control" />
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* Reminder Notifications */}
                    <div className="so-details-card mx-5 mb-4">
                        <h2 className="sales-order-title mb-4">Reminder Notifications</h2>

                        <div className="row g-3 three-column-form">
                            <div className="col-lg-4">
                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Reminder Title:
                                    </label>
                                    <input type="text" className="form-control so-control" />
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Auto Reminder Frequency:
                                    </label>
                                    <input type="text" className="form-control so-control" />
                                </div>

                                <div className="so-form-group mb-0">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Status:
                                    </label>
                                    <select className="form-select so-control">
                                        <option value="">Select</option>
                                    </select>
                                </div>
                            </div>

                            <div className="col-lg-4">
                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Reminder Type:
                                    </label>
                                    <select className="form-select so-control">
                                        <option value="">Select</option>
                                    </select>
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Custom Message:
                                    </label>
                                    <input type="text" className="form-control so-control" />
                                </div>

                                <div className="so-form-group mb-0">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Repeat Until:
                                    </label>
                                    <input type="date" className="form-control so-control" />
                                </div>
                            </div>

                            <div className="col-lg-4">
                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Trigger Day:
                                    </label>
                                    <select className="form-select so-control">
                                        <option value="">Select</option>
                                    </select>
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Communication Channel:
                                    </label>
                                    <select className="form-select so-control">
                                        <option value="">Select</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Forecasting */}
                    <div className="so-details-card mx-5 mb-4">
                        <h2 className="sales-order-title mb-4">Forecasting</h2>

                        <div className="row g-3 three-column-form">
                            <div className="col-lg-4">
                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Forecast Type:
                                    </label>
                                    <select className="form-select so-control">
                                        <option value="">Select</option>
                                    </select>
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Start Month:
                                    </label>
                                    <input type="month" className="form-control so-control" />
                                </div>

                                <div className="so-form-group mb-">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Forecasted Amount:
                                    </label>
                                    <input type="number" className="form-control so-control" />
                                </div>
                            </div>

                            <div className="col-lg-4">
                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Financial Year:
                                    </label>
                                    <input type="text" className="form-control so-control" />
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        End Month:
                                    </label>
                                    <input type="month" className="form-control so-control" />
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Category:
                                    </label>
                                    <select className="form-select so-control">
                                        <option value="">Select</option>
                                    </select>
                                </div>
                            </div>

                            <div className="col-lg-4">
                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Forecast Period:
                                    </label>
                                    <select className="form-select so-control">
                                        <option value="">Select</option>
                                    </select>
                                </div>

                                <div className="so-form-group mb-0">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Note:
                                    </label>
                                    <input type="text" className="form-control so-control subject-textarea" />
                                </div>


                            </div>
                        </div>

                    </div>

                    {/* Submit button aligned like Sales Order buttons */}
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

export default AddBudgeting;
