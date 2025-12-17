import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import Header from "../../../components/Header/Header";
// import { FeatherUpload } from "../../Sales/Customers/AddCustomer/Add";
// import { useGlobalToast } from '../../../components/Toast/ToastContext';
import './addMasterSetup.css';
import { Link } from 'react-feather';
import { useGlobalToast } from '../../../../components/Toast/ToastContext';
import Header from '../../../../components/Header/Header';
import { FeatherUpload } from '../../../Sales/Customers/AddCustomer/Add';

interface MasterSetupFormData {
    society: {
        name: string;
        registrationNumber: string;
        noOfBuildings: number | '';
        flatsPerBuilding: number | '';
        finYearStart: string;
        finYearEnd: string;
    };
    building: {
        frequency: string;
        flatNumber: string;
        squareFootArea: number | '';
        noOfFloors: number | '';
        association: string;
        initialOwner: string;
        commonFacilities: string;
        flatType: string;
        occupancyStatus: string;
    };
    coa: {
        accountName: string;
        category: string;
        balanceType: string;
        linkedBank: string;
        accountCode: string;
        openingBalance: number | '';
        transactionType: string;
        accountType: string;
        tds: string;
        gst: string;
    };
    mc: {
        categoryName: string;
        applicationBuildings: string;
        appliesTo: string;
        chargeCodeId: string;
        rateType: string;
        accountLinked: string;
        billingFrequency: string;
        rateAmount: number | '';
    };
    bank: {
        name: string;
        accountType: string;
        accountNumber: string;
        ifsc: string;
    };
    staff: {
        name: string;
        contact: string;
        role: string;
        salaryType: string;
    };
    docs: {
        shareCertificateNumber: string;
        memberDocumentDb: string;
        meetingMinutes: string;
        memberDocScrutiny: string;
    };
}

interface ValidationErrors {
    [key: string]: string;
}

const AddMasterSetup = () => {
    const navigate = useNavigate();
    const { showToast } = useGlobalToast();

    const [formData, setFormData] = useState<MasterSetupFormData>({
        society: {
            name: '',
            registrationNumber: '',
            noOfBuildings: '',
            flatsPerBuilding: '',
            finYearStart: '',
            finYearEnd: '',
        },
        building: {
            frequency: '',
            flatNumber: '',
            squareFootArea: '',
            noOfFloors: '',
            association: '',
            initialOwner: '',
            commonFacilities: '',
            flatType: '',
            occupancyStatus: '',
        },
        coa: {
            accountName: '',
            category: '',
            balanceType: '',
            linkedBank: '',
            accountCode: '',
            openingBalance: '',
            transactionType: '',
            accountType: '',
            tds: '',
            gst: '',
        },
        mc: {
            categoryName: '',
            applicationBuildings: '',
            appliesTo: '',
            chargeCodeId: '',
            rateType: '',
            accountLinked: '',
            billingFrequency: '',
            rateAmount: '',
        },
        bank: {
            name: '',
            accountType: '',
            accountNumber: '',
            ifsc: '',
        },
        staff: {
            name: '',
            contact: '',
            role: '',
            salaryType: '',
        },
        docs: {
            shareCertificateNumber: '',
            memberDocumentDb: '',
            meetingMinutes: '',
            memberDocScrutiny: '',
        },
    });

    const [errors, setErrors] = useState<ValidationErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = (): boolean => {
        const newErrors: ValidationErrors = {};

        // Required validations
        if (!formData.society.name.trim()) newErrors.societyName = 'Society Name is required';
        if (!formData.society.registrationNumber.trim()) newErrors.registrationNumber = 'Registration Number is required';
        if (formData.society.noOfBuildings === '' || formData.society.noOfBuildings <= 0) {
            newErrors.noOfBuildings = 'No. of Buildings must be greater than 0';
        }
        if (!formData.society.finYearStart) newErrors.finYearStart = 'Financial Year Start is required';
        if (!formData.society.finYearEnd) newErrors.finYearEnd = 'Financial Year End is required';

        // Date validation
        if (formData.society.finYearStart && formData.society.finYearEnd) {
            if (new Date(formData.society.finYearStart) >= new Date(formData.society.finYearEnd)) {
                newErrors.dateRange = 'Financial Year End must be after Year Start';
            }
        }

        // Building section validations
        if (!formData.building.frequency) newErrors.buildingFrequency = 'Building Frequency is required';
        if (!formData.building.flatType) newErrors.flatType = 'Flat Type is required';

        // COA validations
        if (!formData.coa.accountName) newErrors.accountName = 'Account Name is required';
        if (!formData.coa.accountType) newErrors.accountType = 'Account Type is required';

        // Bank validations
        if (!formData.bank.name) newErrors.bankName = 'Bank Name is required';
        if (!formData.bank.accountNumber.trim()) newErrors.accountNumber = 'Account Number is required';
        if (!formData.bank.ifsc.trim()) newErrors.ifsc = 'IFSC Code is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const fieldValue = type === 'number' ? (value === '' ? '' : Number(value)) : value;

        const keys = name.split('.');
        setFormData((prev) => {
            const updated = { ...prev };
            let current: any = updated;

            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
            }

            current[keys[keys.length - 1]] = fieldValue;
            return updated;
        });

        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) {
            showToast('Please fill in all required fields correctly.', 'error');
            return;
        }

        setIsSubmitting(true);

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Store success message in sessionStorage
            sessionStorage.setItem('formSuccess', 'Master Setup created successfully!');

            showToast('Master Setup created successfully!', 'success');

            // Redirect to master setup page
            navigate('/society/master-setup');
        } catch (error) {
            showToast('Failed to create Master Setup. Please try again.', 'error');
            console.error('Submit error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Header />

            <div className="sales-orders-page add-master-setup">                <form className="sales-order-form" onSubmit={handleSubmit}>
                {/* ===== Society Details ===== */}
                <div className="so-details-card mx-5 mb-3">
                    <h1 className="sales-order-title mb-3" style={{ fontSize: 15 }}>Society Details</h1>

                    <div className="row g-3 three-column-form">
                        {/* col 1 */}
                        <div className="col-lg-4">
                            <div className="so-form-group mb-4">
                                <label className="so-label text-sm text-muted-foreground fw-bold">
                                    Society Name:
                                </label>
                                <input
                                    type="text"
                                    name="society.name"
                                    className={`form-control so-control ${errors.societyName ? 'is-invalid' : ''}`}
                                    placeholder="Enter society name"
                                    value={formData.society.name}
                                    onChange={handleInputChange}
                                />
                                {errors.societyName && <small className="text-danger">{errors.societyName}</small>}
                            </div>

                            <div className="so-form-group mb-4">
                                <label className="so-label text-sm text-muted-foreground fw-bold">
                                    Flats per Building:
                                </label>
                                <input
                                    type="number"
                                    name="society.flatsPerBuilding"
                                    className="form-control so-control"
                                    placeholder="0"
                                    value={formData.society.flatsPerBuilding}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        {/* col 2 */}
                        <div className="col-lg-4">
                            <div className="so-form-group mb-4">
                                <label className="so-label text-sm text-muted-foreground fw-bold">
                                    Registration Number:
                                </label>
                                <input
                                    type="text"
                                    name="society.registrationNumber"
                                    className={`form-control so-control ${errors.registrationNumber ? 'is-invalid' : ''}`}
                                    placeholder="Enter registration no."
                                    value={formData.society.registrationNumber}
                                    onChange={handleInputChange}
                                />
                                {errors.registrationNumber && <small className="text-danger">{errors.registrationNumber}</small>}
                            </div>

                            <div className="so-form-group mb-4">
                                <label className="so-label text-sm text-muted-foreground fw-bold">
                                    Financial Year Start:
                                </label>
                                <input
                                    type="date"
                                    name="society.finYearStart"
                                    className={`form-control so-control ${errors.finYearStart || errors.dateRange ? 'is-invalid' : ''}`}
                                    value={formData.society.finYearStart}
                                    onChange={handleInputChange}
                                />
                                {errors.finYearStart && <small className="text-danger">{errors.finYearStart}</small>}
                            </div>
                        </div>

                        {/* col 3 */}
                        <div className="col-lg-4">
                            <div className="so-form-group mb-4">
                                <label className="so-label text-sm text-muted-foreground fw-bold">
                                    No. of Buildings:
                                </label>
                                <input
                                    type="number"
                                    name="society.noOfBuildings"
                                    className={`form-control so-control ${errors.noOfBuildings ? 'is-invalid' : ''}`}
                                    placeholder="0"
                                    value={formData.society.noOfBuildings}
                                    onChange={handleInputChange}
                                />
                                {errors.noOfBuildings && <small className="text-danger">{errors.noOfBuildings}</small>}
                            </div>

                            <div className="so-form-group mb-4">
                                <label className="so-label text-sm text-muted-foreground fw-bold">
                                    Financial Year End:
                                </label>
                                <input
                                    type="date"
                                    name="society.finYearEnd"
                                    className={`form-control so-control ${errors.finYearEnd || errors.dateRange ? 'is-invalid' : ''}`}
                                    value={formData.society.finYearEnd}
                                    onChange={handleInputChange}
                                />
                                {errors.finYearEnd && <small className="text-danger">{errors.finYearEnd}</small>}
                                {errors.dateRange && <small className="text-danger">{errors.dateRange}</small>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* divider */}
                <div className="mx-5" style={{ borderTop: "1px solid #e5e7eb" }} />

                {/* ===== Building / Flats Details ===== */}
                <div className="so-details-card mx-5 mb-3 mt-3">
                    <h1 className="sales-order-title mb-3" style={{ fontSize: 15 }}>Building / Flats Details</h1>

                    <div className="row g-3 three-column-form">
                        {/* col 1 */}
                        <div className="col-lg-4">
                            <div className="so-form-group mb-4">
                                <label className="so-label text-sm text-muted-foreground fw-bold">
                                    Building Frequency:
                                </label>
                                <select
                                    name="building.frequency"
                                    className={`form-select so-control ${errors.buildingFrequency ? 'is-invalid' : ''}`}
                                    value={formData.building.frequency}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select</option>
                                    <option>Monthly</option>
                                    <option>Quarterly</option>
                                    <option>Yearly</option>
                                </select>
                                {errors.buildingFrequency && <small className="text-danger">{errors.buildingFrequency}</small>}
                            </div>

                            <div className="so-form-group mb-4">
                                <label className="so-label text-sm text-muted-foreground fw-bold">
                                    Flat Number:
                                </label>
                                <input
                                    type="text"
                                    name="building.flatNumber"
                                    className="form-control so-control"
                                    placeholder="Enter flat number"
                                    value={formData.building.flatNumber}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="so-form-group mb-4">
                                <label className="so-label text-sm text-muted-foreground fw-bold">
                                    Square Foot Area:
                                </label>
                                <input
                                    type="number"
                                    name="building.squareFootArea"
                                    className="form-control so-control"
                                    placeholder="0.00"
                                    value={formData.building.squareFootArea}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        {/* col 2 */}
                        <div className="col-lg-4">
                            <div className="so-form-group mb-4">
                                <label className="so-label text-sm text-muted-foreground fw-bold">
                                    Number of Floors:
                                </label>
                                <input
                                    type="number"
                                    name="building.noOfFloors"
                                    className="form-control so-control"
                                    placeholder="0"
                                    value={formData.building.noOfFloors}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="so-form-group mb-4">
                                <label className="so-label text-sm text-muted-foreground fw-bold">
                                    Building Association:
                                </label>
                                <input
                                    type="text"
                                    name="building.association"
                                    className="form-control so-control"
                                    placeholder="Enter association"
                                    value={formData.building.association}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="so-form-group mb-4">
                                <label className="so-label text-sm text-muted-foreground fw-bold">
                                    Initial Owner:
                                </label>
                                <input
                                    type="text"
                                    name="building.initialOwner"
                                    className="form-control so-control"
                                    placeholder="Enter owner name"
                                    value={formData.building.initialOwner}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        {/* col 3 */}
                        <div className="col-lg-4">
                            <div className="so-form-group mb-4">
                                <label className="so-label text-sm text-muted-foreground fw-bold">
                                    Common Facilities:
                                </label>
                                <select
                                    name="building.commonFacilities"
                                    className="form-select so-control"
                                    value={formData.building.commonFacilities}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select</option>
                                    <option>Gym</option>
                                    <option>Swimming Pool</option>
                                    <option>Club House</option>
                                </select>
                            </div>

                            <div className="so-form-group mb-4">
                                <label className="so-label text-sm text-muted-foreground fw-bold">
                                    Flat Type:
                                </label>
                                <select
                                    name="building.flatType"
                                    className={`form-select so-control ${errors.flatType ? 'is-invalid' : ''}`}
                                    value={formData.building.flatType}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select</option>
                                    <option>1 BHK</option>
                                    <option>2 BHK</option>
                                    <option>3 BHK</option>
                                </select>
                                {errors.flatType && <small className="text-danger">{errors.flatType}</small>}
                            </div>

                            <div className="so-form-group mb-4">
                                <label className="so-label text-sm text-muted-foreground fw-bold">
                                    Occupancy Status:
                                </label>
                                <select
                                    name="building.occupancyStatus"
                                    className="form-select so-control"
                                    value={formData.building.occupancyStatus}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select</option>
                                    <option>Occupied</option>
                                    <option>Vacant</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* divider */}
                <div className="mx-5" style={{ borderTop: "1px solid #e5e7eb" }} />

                {/* ===== Chart of Accounts ===== */}
                <div className="so-details-card mx-5 mb-3 mt-3">
                    <h1 className="sales-order-title mb-3" style={{ fontSize: 15 }}>Chart of Accounts</h1>

                    <div className="row g-3 three-column-form">
                        {/* col 1 */}
                        <div className="col-lg-4">
                            <div className="so-form-group mb-4">
                                <label className="so-label text-sm text-muted-foreground fw-bold">
                                    Account Name:
                                </label>
                                <select
                                    name="coa.accountName"
                                    className={`form-select so-control ${errors.accountName ? 'is-invalid' : ''}`}
                                    value={formData.coa.accountName}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select account</option>
                                    <option>Cash in Hand</option>
                                    <option>Bank Account</option>
                                    <option>Maintenance Fund</option>
                                    <option>Reserve Fund</option>
                                    <option>Member Deposits</option>
                                </select>
                                {errors.accountName && <small className="text-danger">{errors.accountName}</small>}
                            </div>

                            <div className="so-form-group mb-4">
                                <label className="so-label text-sm text-muted-foreground fw-bold">
                                    Category:
                                </label>
                                <input
                                    type="text"
                                    name="coa.category"
                                    className="form-control so-control"
                                    value={formData.coa.category}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="so-form-group mb-4">
                                <label className="so-label text-sm text-muted-foreground fw-bold">
                                    Balance Type:
                                </label>
                                <input
                                    type="text"
                                    name="coa.balanceType"
                                    className="form-control so-control"
                                    value={formData.coa.balanceType}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="so-form-group mb-4">
                                <label className="so-label text-sm text-muted-foreground fw-bold">
                                    Linked Bank Account:
                                </label>
                                <input
                                    type="text"
                                    name="coa.linkedBank"
                                    className="form-control so-control"
                                    value={formData.coa.linkedBank}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        {/* col 2 */}
                        <div className="col-lg-4">
                            <div className="so-form-group mb-4">
                                <label className="so-label text-sm text-muted-foreground fw-bold">
                                    Account Code:
                                </label>
                                <input
                                    type="text"
                                    name="coa.accountCode"
                                    className="form-control so-control"
                                    value={formData.coa.accountCode}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="so-form-group mb-4">
                                <label className="so-label text-sm text-muted-foreground fw-bold">
                                    Opening Balance:
                                </label>
                                <input
                                    type="number"
                                    name="coa.openingBalance"
                                    className="form-control so-control"
                                    placeholder="0.00"
                                    value={formData.coa.openingBalance}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="so-form-group mb-4">
                                <label className="so-label text-sm text-muted-foreground fw-bold">
                                    Transaction Type:
                                </label>
                                <select
                                    name="coa.transactionType"
                                    className="form-select so-control"
                                    value={formData.coa.transactionType}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select</option>
                                    <option>Debit</option>
                                    <option>Credit</option>
                                </select>
                            </div>
                        </div>

                        {/* col 3 */}
                        <div className="col-lg-4">
                            <div className="so-form-group" style={{ marginBottom: 30 }}>
                                <label className="so-label text-sm text-muted-foreground fw-bold">
                                    Account Type:
                                </label>
                                <select
                                    name="coa.accountType"
                                    className={`form-select so-control ${errors.accountType ? 'is-invalid' : ''}`}
                                    value={formData.coa.accountType}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select</option>
                                    <option>Asset</option>
                                    <option>Liability</option>
                                    <option>Equity</option>
                                    <option>Income</option>
                                    <option>Expense</option>
                                </select>
                                {errors.accountType && <small className="text-danger">{errors.accountType}</small>}
                            </div>

                            <div className="so-form-group" style={{ marginBottom: 38 }}>
                                <label className="so-label text-sm text-muted-foreground fw-bold">
                                    TDS Deductible:
                                </label>
                                <div className="d-flex align-items-center gap-3" >
                                    <div className="radio-row">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="coa.tds"
                                            value="yes"
                                            checked={formData.coa.tds === 'yes'}
                                            onChange={handleInputChange}
                                        />
                                        <label className="form-check-label" style={{ fontSize: 15 }}>Yes</label>
                                    </div>
                                    <div className="radio-row">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="coa.tds"
                                            value="no"
                                            checked={formData.coa.tds === 'no'}
                                            onChange={handleInputChange}
                                        />
                                        <label className="form-check-label" style={{ fontSize: 15 }}>No</label>
                                    </div>
                                </div>
                            </div>

                            <div className="so-form-group mb-4">
                                <label className="so-label text-sm text-muted-foreground fw-bold">
                                    GST Application:
                                </label>
                                <div className="d-flex align-items-center gap-3">
                                    <div className="radio-row">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="coa.gst"
                                            value="yes"
                                            checked={formData.coa.gst === 'yes'}
                                            onChange={handleInputChange}
                                        />
                                        <label className="form-check-label">Yes</label>
                                    </div>
                                    <div className="radio-row">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="coa.gst"
                                            value="no"
                                            checked={formData.coa.gst === 'no'}
                                            onChange={handleInputChange}
                                        />
                                        <label className="form-check-label">No</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* divider */}
                <div className="mx-5" style={{ borderTop: "1px solid #e5e7eb" }} />

                {/* ===== Maintenance Categories ===== */}
                <div className="so-details-card mx-5 mb-3 mt-3">
                    <h1 className="sales-order-title mb-3" style={{ fontSize: 15 }}>Maintenance Categories</h1>

                    <div className="row g-3 three-column-form">
                        {/* col 1 */}
                        <div className="col-lg-4">
                            <div className="so-form-group mb-4">
                                <label className="so-label text-sm text-muted-foreground fw-bold">
                                    Category Name:
                                </label>
                                <input
                                    type="text"
                                    name="mc.categoryName"
                                    className="form-control so-control"
                                    value={formData.mc.categoryName}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="so-form-group mb-4">
                                <label className="so-label text-sm text-muted-foreground fw-bold">
                                    Application Buildings:
                                </label>
                                <input
                                    type="text"
                                    name="mc.applicationBuildings"
                                    className="form-control so-control"
                                    value={formData.mc.applicationBuildings}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="so-form-group mb-4">
                                <label className="so-label text-sm text-muted-foreground fw-bold">
                                    Applies to:
                                </label>
                                <select
                                    name="mc.appliesTo"
                                    className="form-select so-control"
                                    value={formData.mc.appliesTo}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select</option>
                                    <option>All Flats</option>
                                    <option>Residential Flats</option>
                                    <option>Commercial Flats</option>
                                </select>
                            </div>
                        </div>

                        {/* col 2 */}
                        <div className="col-lg-4">
                            <div className="so-form-group mb-4">
                                <label className="so-label text-sm text-muted-foreground fw-bold">
                                    Charge Code ID:
                                </label>
                                <input
                                    type="text"
                                    name="mc.chargeCodeId"
                                    className="form-control so-control"
                                    value={formData.mc.chargeCodeId}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="so-form-group mb-4">
                                <label className="so-label text-sm text-muted-foreground fw-bold">
                                    Rate Type:
                                </label>
                                <select
                                    name="mc.rateType"
                                    className="form-select so-control"
                                    value={formData.mc.rateType}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select</option>
                                    <option>Fixed</option>
                                    <option>Variable</option>
                                    <option>Per Sqft</option>
                                </select>
                            </div>

                            <div className="so-form-group mb-4">
                                <label className="so-label text-sm text-muted-foreground fw-bold">
                                    Account Linked:
                                </label>
                                <input
                                    type="text"
                                    name="mc.accountLinked"
                                    className="form-control so-control"
                                    value={formData.mc.accountLinked}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        {/* col 3 */}
                        <div className="col-lg-4">
                            <div className="so-form-group mb-4">
                                <label className="so-label text-sm text-muted-foreground fw-bold">
                                    Billing Frequency:
                                </label>
                                <select
                                    name="mc.billingFrequency"
                                    className="form-select so-control"
                                    value={formData.mc.billingFrequency}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select</option>
                                    <option>Monthly</option>
                                    <option>Quarterly</option>
                                    <option>Yearly</option>
                                </select>
                            </div>

                            <div className="so-form-group mb-4">
                                <label className="so-label text-sm text-muted-foreground fw-bold">
                                    Rate Amount:
                                </label>
                                <input
                                    type="number"
                                    name="mc.rateAmount"
                                    className="form-control so-control"
                                    placeholder="0.00"
                                    value={formData.mc.rateAmount}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* divider */}
                <div className="mx-5" style={{ borderTop: "1px solid #e5e7eb" }} />

                {/* ===== Bank Accounts ===== */}
                <div className="so-details-card mx-5 mb-3 mt-3">
                    <h1 className="sales-order-title mb-3" style={{ fontSize: 15 }}>Bank Accounts</h1>

                    <div className="row g-3 three-column-form">
                        {/* col 1 */}
                        <div className="col-lg-4">
                            <div className="so-form-group mb-4">
                                <label className="so-label text-sm text-muted-foreground fw-bold">
                                    Bank Name:
                                </label>
                                <select
                                    name="bank.name"
                                    className={`form-select so-control ${errors.bankName ? 'is-invalid' : ''}`}
                                    value={formData.bank.name}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select bank</option>
                                    <option>State Bank of India</option>
                                    <option>HDFC Bank</option>
                                    <option>ICICI Bank</option>
                                    <option>Axis Bank</option>
                                    <option>Kotak Mahindra Bank</option>
                                </select>
                                {errors.bankName && <small className="text-danger">{errors.bankName}</small>}
                            </div>

                            <div className="so-form-group mb-4">
                                <label className="so-label text-sm text-muted-foreground fw-bold">
                                    Account Type:
                                </label>
                                <select
                                    name="bank.accountType"
                                    className="form-select so-control"
                                    value={formData.bank.accountType}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select</option>
                                    <option>Current</option>
                                    <option>Savings</option>
                                </select>
                            </div>
                        </div>

                        {/* col 2 */}
                        <div className="col-lg-4">
                            <div className="so-form-group mb-4">
                                <label className="so-label text-sm text-muted-foreground fw-bold">
                                    Account Number:
                                </label>
                                <input
                                    type="text"
                                    name="bank.accountNumber"
                                    className={`form-control so-control ${errors.accountNumber ? 'is-invalid' : ''}`}
                                    value={formData.bank.accountNumber}
                                    onChange={handleInputChange}
                                />
                                {errors.accountNumber && <small className="text-danger">{errors.accountNumber}</small>}
                            </div>
                        </div>

                        {/* col 3 */}
                        <div className="col-lg-4">
                            <div className="so-form-group mb-4">
                                <label className="so-label text-sm text-muted-foreground fw-bold">
                                    IFSC Code:
                                </label>
                                <input
                                    type="text"
                                    name="bank.ifsc"
                                    className={`form-control so-control ${errors.ifsc ? 'is-invalid' : ''}`}
                                    value={formData.bank.ifsc}
                                    onChange={handleInputChange}
                                />
                                {errors.ifsc && <small className="text-danger">{errors.ifsc}</small>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* divider */}
                <div className="mx-5" style={{ borderTop: "1px solid #e5e7eb" }} />

                {/* ===== Staff Master ===== */}
                <div className="so-details-card mx-5 mb-3 mt-3">
                    <h1 className="sales-order-title mb-3" style={{ fontSize: 15 }}>Staff Master</h1>

                    <div className="row g-3 three-column-form">
                        {/* col 1 */}
                        <div className="col-lg-4">
                            <div className="so-form-group mb-4">
                                <label className="so-label text-sm text-muted-foreground fw-bold">
                                    Staff Name:
                                </label>
                                <select
                                    name="staff.name"
                                    className="form-select so-control"
                                    value={formData.staff.name}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select staff</option>
                                    <option>Rajesh Kumar</option>
                                    <option>Priya Sharma</option>
                                    <option>Amit Patel</option>
                                    <option>Sneha Gupta</option>
                                </select>
                            </div>

                            <div className="so-form-group mb-4">
                                <label className="so-label text-sm text-muted-foreground fw-bold">
                                    Contact Info:
                                </label>
                                <select
                                    name="staff.contact"
                                    className="form-select so-control"
                                    value={formData.staff.contact}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select</option>
                                    <option>9876543210</option>
                                    <option>9765432109</option>
                                    <option>9654321098</option>
                                </select>
                            </div>
                        </div>

                        {/* col 2 */}
                        <div className="col-lg-4">
                            <div className="so-form-group mb-4">
                                <label className="so-label text-sm text-muted-foreground fw-bold">
                                    Role:
                                </label>
                                <select
                                    name="staff.role"
                                    className="form-select so-control"
                                    value={formData.staff.role}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select role</option>
                                    <option>Manager</option>
                                    <option>Secretary</option>
                                    <option>Treasurer</option>
                                    <option>Maintenance Staff</option>
                                    <option>Security</option>
                                </select>
                            </div>
                        </div>

                        {/* col 3 */}
                        <div className="col-lg-4">
                            <div className="so-form-group mb-4">
                                <label className="so-label text-sm text-muted-foreground fw-bold">
                                    Salary:
                                </label>
                                <select
                                    name="staff.salaryType"
                                    className="form-select so-control"
                                    value={formData.staff.salaryType}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select</option>
                                    <option>Monthly</option>
                                    <option>Quarterly</option>
                                    <option>Yearly</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* divider */}
                <div className="mx-5" style={{ borderTop: "1px solid #e5e7eb" }} />

                {/* ===== Document Settings ===== */}
                <div className="so-details-card mx-5 mb-3 mt-3">
                    <h1 className="sales-order-title mb-3" style={{ fontSize: 15 }}>Document Settings</h1>

                    <div className="row g-3 three-column-form">
                        {/* col 1 */}
                        <div className="col-lg-4">
                            <div className="so-form-group mb-4">
                                <label className="so-label text-sm text-muted-foreground fw-bold">
                                    Share Certificate Number:
                                </label>
                                <input
                                    type="text"
                                    name="docs.shareCertificateNumber"
                                    className="form-control so-control"
                                    value={formData.docs.shareCertificateNumber}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="so-form-group mb-4">
                                <label className="so-label text-sm text-muted-foreground fw-bold">
                                    Transfer Register:
                                </label>
                                <div
                                    className="doc-upload-box"
                                    onClick={() =>
                                        document.getElementById("doc-transfer-upload")?.click()
                                    }
                                >
                                    <FeatherUpload size={16} className="text-muted mb-1" />
                                    <span className="text-secondary small">
                                        Click to Upload Documents
                                    </span>

                                    <input
                                        id="doc-transfer-upload"
                                        type="file"
                                        multiple
                                        className="d-none"
                                        onChange={(e) => {
                                            const files = e.target.files;
                                            if (files?.length) {
                                                console.log("Transfer Register files:", files);
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="so-form-group mb-4">
                                <label className="so-label text-sm text-muted-foreground fw-bold">
                                    Member Document Database:
                                </label>
                                <div className="position-relative">
                                    <input
                                        type="text"
                                        name="docs.memberDocumentDb"
                                        className="form-control so-control"
                                        value={formData.docs.memberDocumentDb}
                                        onChange={handleInputChange}
                                        placeholder="Enter or paste link"
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-link position-absolute"
                                        style={{ right: '8px', top: '50%', transform: 'translateY(-50%)', padding: '4px', border: 'none' }}
                                        onClick={() => {
                                            if (formData.docs.memberDocumentDb) {
                                                window.open(formData.docs.memberDocumentDb, '_blank');
                                            }
                                        }}
                                    >
                                        <Link size={16} className="text-muted" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* col 2 */}
                        <div className="col-lg-4">
                            <div className="so-form-group mb-4">
                                <label className="so-label text-sm text-muted-foreground fw-bold">
                                    Share Register:
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

                            <div className="so-form-group mb-4">
                                <label className="so-label text-sm text-muted-foreground fw-bold">
                                    I&J Registers:
                                </label>
                                <div
                                    className="doc-upload-box"
                                    onClick={() =>
                                        document.getElementById("doc-ij-upload")?.click()
                                    }
                                >
                                    <FeatherUpload size={16} className="text-muted mb-1" />
                                    <span className="text-secondary small">
                                        Click to Upload Documents
                                    </span>

                                    <input
                                        id="doc-ij-upload"
                                        type="file"
                                        multiple
                                        className="d-none"
                                        onChange={(e) => {
                                            const files = e.target.files;
                                            if (files?.length) {
                                                console.log("I&J Register files:", files);
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="so-form-group mb-4">
                                <label className="so-label text-sm text-muted-foreground fw-bold">
                                    Meeting Minutes:
                                </label>
                                <input
                                    type="text"
                                    name="docs.meetingMinutes"
                                    className="form-control so-control"
                                    value={formData.docs.meetingMinutes}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        {/* col 3 */}
                        <div className="col-lg-4">
                            <div className="so-form-group mb-4">
                                <label className="so-label text-sm text-muted-foreground fw-bold">
                                    Nomination Register:
                                </label>
                                <div
                                    className="doc-upload-box"
                                    onClick={() =>
                                        document.getElementById("doc-nomination-upload")?.click()
                                    }
                                >
                                    <FeatherUpload size={16} className="text-muted mb-1" />
                                    <span className="text-secondary small">
                                        Click to Upload Documents
                                    </span>

                                    <input
                                        id="doc-nomination-upload"
                                        type="file"
                                        multiple
                                        className="d-none"
                                        onChange={(e) => {
                                            const files = e.target.files;
                                            if (files?.length) {
                                                console.log("Nomination Register files:", files);
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="so-form-group mb-4">
                                <label className="so-label text-sm text-muted-foreground fw-bold">
                                    Member Document Scrutiny:
                                </label>
                                <input
                                    type="text"
                                    name="docs.memberDocScrutiny"
                                    className="form-control so-control"
                                    value={formData.docs.memberDocScrutiny}
                                    onChange={handleInputChange}
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
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
            </form>
            </div>
        </>
    );
};

export default AddMasterSetup;