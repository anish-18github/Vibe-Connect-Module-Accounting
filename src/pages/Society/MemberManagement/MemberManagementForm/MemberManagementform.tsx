import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useToast, Toast } from "../../../../components/Toast/Toast";
import Header from "../../../../components/Header/Header";
import { FeatherUpload } from "../../../Sales/Customers/AddCustomer/Add";

import './MMF.css'

interface FormDataType {
    profile: Record<string, any>;
    contact: Record<string, any>;
    billing: Record<string, any>;
    history: Record<string, any>;
    maint: Record<string, any>;
    parking: Record<string, any>;
    doc: Record<string, any>;
    mgr: Record<string, any>;
}

const MemberManagementForm = () => {
    const navigate = useNavigate();
    const { toast, setToast, showToast } = useToast();
    const [formData, setFormData] = useState<FormDataType>({
        profile: {},
        contact: {},
        billing: {},
        history: {},
        maint: {},
        parking: {},
        doc: {},
        mgr: {},
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const fieldValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
        const [section, field] = name.split(".");

        setFormData((prev) => ({
            ...prev,
            [section]: {
                ...prev[section as keyof FormDataType],
                [field]: fieldValue,
            },
        }));
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            // Validation: Check if required fields are filled
            if (!formData.profile.fullName || !formData.contact.name) {
                showToast("Please fill in all required fields", "error");
                return;
            }

            // Here you would typically send the data to your API
            console.log("Form Data:", formData);

            showToast("Member added successfully!", "success");

            // Navigate to member management page after a short delay
            setTimeout(() => {
                navigate("/society/member-management");
            }, 1500);
        } catch (error) {
            showToast("Error submitting form. Please try again.", "error");
            console.error("Form submission error:", error);
        }
    };

    return (
        <>
            <Header />
            <Toast toast={toast} setToast={setToast} />

            <div className="sales-orders-page add-master-setup">
                <form className="sales-order-form" onSubmit={handleSubmit}>
                    {/* ===== Owner / Resident Profile ===== */}
                    <div className="so-details-card mx-5 mb-3">
                        <h1 className="sales-order-title mb-3" style={{ fontSize: 15 }}>Owner/Resident Profile</h1>

                        <div className="row g-3 three-column-form">
                            {/* Col 1 */}
                            <div className="col-lg-4">
                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Full Name:
                                    </label>
                                    <input
                                        type="text"
                                        name="profile.fullName"
                                        className="form-control so-control"
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Ownership Type:
                                    </label>
                                    <select
                                        name="profile.ownershipType"
                                        className="form-select so-control"
                                        onChange={handleChange}
                                    >
                                        <option value="">Select</option>
                                    </select>
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Date Of Possession:
                                    </label>
                                    <input
                                        type="date"
                                        name="profile.dateOfPossession"
                                        className="form-control so-control"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Col 2 */}
                            <div className="col-lg-4">
                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Building Code:
                                    </label>
                                    <input
                                        type="text"
                                        name="profile.buildingCode"
                                        className="form-control so-control"
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Flat Area:
                                    </label>
                                    <input
                                        type="number"
                                        name="profile.flatArea"
                                        className="form-control so-control"
                                        placeholder="0.00"
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Parking Slot Allotted:
                                    </label>
                                    <input
                                        type="text"
                                        name="profile.parkingSlot"
                                        className="form-control so-control"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Col 3 */}
                            <div className="col-lg-4">
                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Flat Number:
                                    </label>
                                    <input
                                        type="text"
                                        name="profile.flatNumber"
                                        className="form-control so-control"
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Occupancy Status:
                                    </label>
                                    <select
                                        name="profile.occupancyStatus"
                                        className="form-select so-control"
                                        onChange={handleChange}
                                    >
                                        <option value="">Select</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="mx-5" style={{ borderTop: "1px solid #e5e7eb" }} />

                    {/* ===== Contact Information ===== */}
                    <div className="so-details-card mx-5 mb-3 mt-3">
                        <h1 className="sales-order-title mb-3">Contact Information</h1>

                        <div className="row g-3 three-column-form">
                            {/* Col 1 */}
                            <div className="col-lg-4">
                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Contact Name:
                                    </label>
                                    <input
                                        type="text"
                                        name="contact.name"
                                        className="form-control so-control"
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Permanent Address:
                                    </label>
                                    <input
                                        type="text"
                                        name="contact.address"
                                        className="form-control so-control"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Col 2 */}
                            <div className="col-lg-4">
                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Mobile Number:
                                    </label>
                                    <input
                                        type="text"
                                        name="contact.mobile"
                                        className="form-control so-control"
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Aadhar No:
                                    </label>
                                    <input
                                        type="text"
                                        name="contact.aadhar"
                                        className="form-control so-control"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Col 3 */}
                            <div className="col-lg-4">
                                <div className="so-form-group mb-5">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Email Address:
                                    </label>
                                    <input
                                        type="email"
                                        name="contact.email"
                                        className="form-control so-control"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="so-form-group mb-4">
                                    <div
                                        className="d-flex align-items-center"
                                        style={{ flexWrap: 'nowrap' }}
                                    >
                                        <label
                                            className="so-label text-sm text-muted-foreground fw-bold mb-0 me-2"
                                            style={{ whiteSpace: 'nowrap', flex: '0 0 auto' }}
                                        >
                                            KYC Documents:
                                        </label>

                                        <div className="form-check form-switch m-0">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                name="contact.kyc"
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="mx-5" style={{ borderTop: "1px solid #e5e7eb" }} />

                    {/* ===== Payment & Billing Preferences ===== */}
                    <div className="so-details-card mx-5 mb-3 mt-3">
                        <h1 className="sales-order-title mb-3">
                            Payment &amp; Billing Preferences
                        </h1>

                        <div className="row g-3 three-column-form">
                            {/* Col 1 */}
                            <div className="col-lg-4">
                                <div className="so-form-group mb-4" style={{ paddingTop: 35 }}>
                                    <div
                                        className="d-flex align-items-center"
                                        style={{ flexWrap: 'nowrap' }}
                                    >
                                        <label
                                            className="so-label text-sm text-muted-foreground fw-bold mb-0 me-2"
                                            style={{ whiteSpace: 'nowrap', flex: '0 0 auto' }}
                                        >
                                            Auto Bill Generator:
                                        </label>

                                        <div className="form-check form-switch m-0">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                name="billing.autoBill"
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </div>


                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Rate Type:
                                    </label>
                                    <select
                                        name="billing.rateType"
                                        className="form-select so-control"
                                        onChange={handleChange}
                                    >
                                        <option value="">Select</option>
                                    </select>
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Invoice:
                                    </label>
                                    <input
                                        type="text"
                                        name="billing.invoice"
                                        className="form-control so-control"
                                        placeholder="INV-VIBE-2025-FLATNO"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Col 2 */}
                            <div className="col-lg-4">
                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Billing Frequency:
                                    </label>
                                    <select
                                        name="billing.frequency"
                                        className="form-select so-control"
                                        onChange={handleChange}
                                    >
                                        <option value="">Select</option>
                                    </select>
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Bank Slip:
                                    </label>
                                    <input
                                        type="text"
                                        name="billing.bankSlip"
                                        className="form-control so-control"
                                        placeholder="BANK-VIBE-MMYY-FLATNO"
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Ledger View:
                                    </label>
                                    <input
                                        type="text"
                                        name="billing.ledgerView"
                                        className="form-control so-control"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Col 3 */}
                            <div className="col-lg-4">
                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Charge Heads:
                                    </label>
                                    <select
                                        name="billing.chargeHeads"
                                        className="form-select so-control"
                                        onChange={handleChange}
                                    >
                                        <option value="">Select</option>
                                    </select>
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Receipt:
                                    </label>
                                    <input
                                        type="text"
                                        name="billing.receipt"
                                        className="form-control so-control"
                                        placeholder="RCPT-XXXX"
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Year-End Reports:
                                    </label>
                                    <select
                                        name="billing.yearEndReports"
                                        className="form-select so-control"
                                        onChange={handleChange}
                                    >
                                        <option value="">Select</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Last row: financial note / auditor / upload */}
                        <div className="row g-3 ">
                            <div className="col-lg-4">
                                <div className="so-form-group mb-2">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Financial Advice Note:
                                    </label>
                                    <input
                                        type="text"
                                        name="billing.financialAdvice"
                                        className="form-control so-control"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="col-lg-4">
                                <div className="so-form-group mb-2">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Auditor Coordination:
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
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="mx-5" style={{ borderTop: "1px solid #e5e7eb" }} />

                    {/* ===== Ownership History ===== */}
                    <div className="so-details-card mx-5 mb-3 mt-3">
                        <h1 className="sales-order-title mb-3">Ownership History</h1>

                        <div className="row g-3 three-column-form">
                            {/* Col 1 */}
                            <div className="col-lg-4">
                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Flat Number:
                                    </label>
                                    <select
                                        name="history.flatNumber"
                                        className="form-select so-control"
                                    >
                                        <option value="">Select</option>
                                    </select>
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Ownership End Date:
                                    </label>
                                    <input
                                        type="date"
                                        name="history.ownershipEndDate"
                                        className="form-control so-control"
                                    />
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Transfer Mode:
                                    </label>
                                    <select
                                        name="history.transferMode"
                                        className="form-select so-control"
                                    >
                                        <option value="">Select</option>
                                    </select>
                                </div>
                            </div>

                            {/* Col 2 */}
                            <div className="col-lg-4">
                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Owner Name:
                                    </label>
                                    <select
                                        name="history.ownerName"
                                        className="form-select so-control"
                                    >
                                        <option value="">Select</option>
                                    </select>
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Transfer Date:
                                    </label>
                                    <input
                                        type="date"
                                        name="history.transferDate"
                                        className="form-control so-control"
                                    />
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Transfer Approved:
                                    </label>
                                    <input
                                        type="text"
                                        name="history.transferApproved"
                                        className="form-control so-control"
                                    />
                                </div>
                            </div>

                            {/* Col 3 */}
                            <div className="col-lg-4">
                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Ownership Start Date:
                                    </label>
                                    <input
                                        type="date"
                                        name="history.ownershipStartDate"
                                        className="form-control so-control"
                                    />
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Transfer Reason:
                                    </label>
                                    <select
                                        name="history.transferReason"
                                        className="form-select so-control"
                                    >
                                        <option value="">Select</option>
                                    </select>
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Document Upload:
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
                                    </div>                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="mx-5" style={{ borderTop: "1px solid #e5e7eb" }} />

                    {/* ===== Maintenance Payment Status ===== */}
                    <div className="so-details-card mx-5 mb-3 mt-3">
                        <h1 className="sales-order-title mb-3">Maintenance Payment Status</h1>

                        <div className="row g-3 three-column-form">
                            {/* Col 1 */}
                            <div className="col-lg-4">
                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Billing Period:
                                    </label>
                                    <select
                                        name="maint.billingPeriod"
                                        className="form-select so-control"
                                    >
                                        <option value="">Select</option>
                                    </select>
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Payment Date:
                                    </label>
                                    <input
                                        type="date"
                                        name="maint.paymentDate"
                                        className="form-control so-control"
                                    />
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Payment Receipts:
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

                            {/* Col 2 */}
                            <div className="col-lg-4">
                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Bill Amount:
                                    </label>
                                    <input
                                        type="number"
                                        name="maint.billAmount"
                                        className="form-control so-control"
                                        placeholder="0.00"
                                    />
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Amount Paid:
                                    </label>
                                    <input
                                        type="number"
                                        name="maint.amountPaid"
                                        className="form-control so-control"
                                        placeholder="0.00"
                                    />
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Status:
                                    </label>
                                    <select
                                        name="maint.status"
                                        className="form-select so-control"
                                    >
                                        <option value="">Select</option>
                                    </select>
                                </div>
                            </div>

                            {/* Col 3 */}
                            <div className="col-lg-4">
                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Due Date:
                                    </label>
                                    <input
                                        type="date"
                                        name="maint.dueDate"
                                        className="form-control so-control"
                                    />
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Payment Date:
                                    </label>
                                    <input
                                        type="date"
                                        name="maint.secondPaymentDate"
                                        className="form-control so-control"
                                    />
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="mx-5" style={{ borderTop: "1px solid #e5e7eb" }} />

                    {/* ===== Parking Allotment ===== */}
                    <div className="so-details-card mx-5 mb-3 mt-3">
                        <h1 className="sales-order-title mb-3">Parking Allotment</h1>

                        <div className="row g-3 three-column-form">
                            {/* Col 1 */}
                            <div className="col-lg-4">
                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Parking Slot No.:
                                    </label>
                                    <select
                                        name="parking.slotNo"
                                        className="form-select so-control"
                                    >
                                        <option value="">Select</option>
                                    </select>
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Allotment Date:
                                    </label>
                                    <input
                                        type="date"
                                        name="parking.allotmentDate"
                                        className="form-control so-control"
                                    />
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Linked to Maintenance:
                                    </label>
                                    <input
                                        type="text"
                                        name="parking.linkedToMaintenance"
                                        className="form-control so-control"
                                    />
                                </div>
                            </div>

                            {/* Col 2 */}
                            <div className="col-lg-4">
                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Vehicle Type:
                                    </label>
                                    <select
                                        name="parking.vehicleType"
                                        className="form-select so-control"
                                    >
                                        <option value="">Select</option>
                                    </select>
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Allotment Type:
                                    </label>
                                    <select
                                        name="parking.allotmentType"
                                        className="form-select so-control"
                                    >
                                        <option value="">Select</option>
                                    </select>
                                </div>
                            </div>

                            {/* Col 3 */}
                            <div className="col-lg-4">
                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Vehicle No:
                                    </label>
                                    <input
                                        type="text"
                                        name="parking.vehicleNo"
                                        className="form-control so-control"
                                    />
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Allotment Type (2):
                                    </label>
                                    <select
                                        name="parking.allotmentType2"
                                        className="form-select so-control"
                                    >
                                        <option value="">Select</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="mx-5" style={{ borderTop: "1px solid #e5e7eb" }} />

                    {/* ===== Document Settings ===== */}
                    <div className="so-details-card mx-5 mb-3 mt-3">
                        <h1 className="sales-order-title mb-3">Document Settings</h1>

                        <div className="row g-3 three-column-form">
                            {/* Col 1 */}
                            <div className="col-lg-4">
                                <div className="so-form-group mb-5" style={{ paddingTop: 30 }}>
                                    <div
                                        className="d-flex align-items-center"
                                        style={{ flexWrap: 'nowrap' }}
                                    >
                                        <label
                                            className="so-label text-sm text-muted-foreground fw-bold mb-0 me-2"
                                            style={{ whiteSpace: 'nowrap', flex: '0 0 auto' }}
                                        >
                                            Auto Generated:
                                        </label>

                                        <div className="form-check form-switch m-0">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                name="doc.autoGenerated"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="so-form-group mb-4" style={{ paddingTop: 15 }}>
                                    <div
                                        className="d-flex align-items-center"
                                        style={{ flexWrap: 'nowrap' }}
                                    >
                                        <label
                                            className="so-label text-sm text-muted-foreground fw-bold mb-0 me-2"
                                            style={{ whiteSpace: 'nowrap', flex: '0 0 auto' }}
                                        >
                                            Approval Required:
                                        </label>

                                        <div className="form-check form-switch m-0">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                name="doc.approvalRequired"
                                            />
                                        </div>
                                    </div>
                                </div>


                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Upload Document:
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
                                    </div>                                </div>
                            </div>

                            {/* Col 2 */}
                            <div className="col-lg-4">
                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Document Name:
                                    </label>
                                    <input
                                        type="text"
                                        name="doc.documentName"
                                        className="form-control so-control"
                                    />
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Linked Module:
                                    </label>
                                    <input
                                        type="text"
                                        name="doc.linkedModule1"
                                        className="form-control so-control"
                                    />
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Date of Possession:
                                    </label>
                                    <input
                                        type="date"
                                        name="doc.dateOfPossession"
                                        className="form-control so-control"
                                    />
                                </div>
                            </div>

                            {/* Col 3 */}
                            <div className="col-lg-4">
                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Linked Module:
                                    </label>
                                    <input
                                        type="text"
                                        name="doc.linkedModule2"
                                        className="form-control so-control"
                                    />
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Format Type:
                                    </label>
                                    <input
                                        type="text"
                                        name="doc.formatType"
                                        className="form-control so-control"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="mx-5" style={{ borderTop: "1px solid #e5e7eb" }} />

                    {/* ===== Managerial & Secretarial Services ===== */}
                    <div className="so-details-card mx-5 mb-3 mt-3">
                        <h1 className="sales-order-title mb-3">
                            Managerial &amp; Secretarial Services
                        </h1>

                        <div className="row g-3 three-column-form">
                            {/* Col 1 */}
                            <div className="col-lg-4">
                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Meeting Agenda:
                                    </label>
                                    <input
                                        type="text"
                                        name="mgr.meetingAgenda"
                                        className="form-control so-control"
                                    />
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Technical Issue Tracker:
                                    </label>
                                    <input
                                        type="text"
                                        name="mgr.techIssueTracker"
                                        className="form-control so-control"
                                    />
                                </div>
                            </div>

                            {/* Col 2 */}
                            <div className="col-lg-4">
                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Meeting Type:
                                    </label>
                                    <select
                                        name="mgr.meetingType"
                                        className="form-select so-control"
                                    >
                                        <option value="">Select</option>
                                    </select>
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Issue Status:
                                    </label>
                                    <input
                                        type="text"
                                        name="mgr.issueStatus"
                                        className="form-control so-control"
                                    />
                                </div>
                            </div>

                            {/* Col 3 */}
                            <div className="col-lg-4">
                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Meeting Date:
                                    </label>
                                    <input
                                        type="date"
                                        name="mgr.meetingDate"
                                        className="form-control so-control"
                                    />
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Statutory Compliance:
                                    </label>
                                    <input
                                        type="text"
                                        name="mgr.statutoryCompliance"
                                        className="form-control so-control"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit button */}
                    <div className="d-flex justify-content-center my-4">

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
                            style={{ background: "#7991BB", color: "#FFFFFF" }}
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default MemberManagementForm;
