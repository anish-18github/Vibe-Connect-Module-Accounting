import React, { useState, useRef, useEffect } from 'react';
import Header from '../../../../components/Header/Header';
import { useNavigate } from "react-router-dom";
import './addCustomer.css';
import { Plus, X } from 'react-feather';

// Interface Definitions
interface ContactPerson {
    salutation: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    designation: string;
    department: string;
}

interface FormData {
    customer: {
        customerType: string;
        salutation: string;
        firstName: string;
        lastName: string;
        companyName: string;
        displayName: string;
        emailAddress: string;
        countryCode: string;  // ✅ Fixed: Added missing field
        phoneNumber: string;  // ✅ Fixed: Added missing field
    };
    otherDetails: {
        pan: string;
        currency: string;
        paymentTerms: string;
        portalLanguage: string;
    };
    address: {
        attention: string;
        country: string;
        address1: string;
        address2: string;
        city: string;
        state: string;
        zip: string;
        countryCode: string;
        phoneNumber: string;
        fax: string;
    };
    contactPersons: ContactPerson[];
    remarks: string;
}

// Dropdown Data
const salutations = ['Mr.', 'Ms.', 'Mrs.', 'Dr.', 'Sir', 'Madam'];
const currencies = ['USD - US Dollar', 'EUR - Euro', 'INR - Indian Rupee'];
const paymentTerms = ['Net 15', 'Net 30', 'Due on Receipt', 'Custom'];
const languages = ['English', 'Spanish', 'French', 'German'];
const countries = ["India", "United States", "United Kingdom", "Canada", "Australia"];
const states = ["Maharashtra", "Gujarat", "Karnataka", "Tamil Nadu", "Uttar Pradesh"];

export const FeatherUpload = ({ className = 'text-muted', size = 32 }: { className?: string; size?: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`feather feather-upload ${className}`}>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="17 8 12 3 7 8"></polyline>
        <line x1="12" y1="3" x2="12" y2="15"></line>
    </svg>
);

const Add = () => {
    const [formData, setFormData] = useState<FormData>({
        customer: {
            customerType: "",
            salutation: "",
            firstName: "",
            lastName: "",
            companyName: "",
            displayName: "",
            emailAddress: "",
            countryCode: "",  // ✅ Fixed: Added
            phoneNumber: "",  // ✅ Fixed: Added
        },
        otherDetails: {
            pan: "",
            currency: "",
            paymentTerms: "",
            portalLanguage: "",
        },
        address: {
            attention: "",
            country: "",
            address1: "",
            address2: "",
            city: "",
            state: "",
            zip: "",
            countryCode: "",
            phoneNumber: "",
            fax: "",
        },
        contactPersons: [{
            salutation: "",
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            designation: "",
            department: "",
        }],
        remarks: "",
    });

    const navigate = useNavigate();
    const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const tabsContainerRef = useRef<HTMLDivElement>(null);
    const [activeTab, setActiveTab] = useState('Other Details');
    const [indicatorStyle, setIndicatorStyle] = useState({});
    const [errors, setErrors] = useState({
        displayName: "",
    });


    // Contact Persons handlers
    const addContactPerson = () => {
        setFormData({
            ...formData,
            contactPersons: [
                ...formData.contactPersons,
                {
                    salutation: "",
                    firstName: "",
                    lastName: "",
                    email: "",
                    phone: "",
                    designation: "",
                    department: "",
                },
            ],
        });
    };

    const removeContactPerson = (index: number) => {
        const updatedContacts = formData.contactPersons.filter((_, i) => i !== index);
        setFormData({ ...formData, contactPersons: updatedContacts });
    };

    const handleContactChange = (index: number, field: keyof ContactPerson, value: string) => {
        const updated = [...formData.contactPersons];
        updated[index] = { ...updated[index], [field]: value };
        setFormData({ ...formData, contactPersons: updated });
    };

    // Tab indicator
    const calculateIndicatorPosition = () => {
        const activeIndex = ['Other Details', 'Address', 'Contact Persons', 'Remarks'].indexOf(activeTab);
        const activeTabElement = tabRefs.current[activeIndex];
        const container = tabsContainerRef.current;

        if (activeTabElement && container) {
            const tabRect = activeTabElement.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            setIndicatorStyle({
                width: `${tabRect.width}px`,
                transform: `translateX(${tabRect.left - containerRect.left}px)`,
            });
        }
    };

    useEffect(() => {
        calculateIndicatorPosition();
        window.addEventListener('resize', calculateIndicatorPosition);
        return () => window.removeEventListener('resize', calculateIndicatorPosition);
    }, [activeTab]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        let sanitizedValue = value;

        // Sanitize phone numbers
        if (
            name === "customer.countryCode" ||
            name === "customer.phoneNumber" ||
            name === "address.countryCode" ||
            name === "address.phoneNumber"
        ) {
            sanitizedValue = value.replace(/\D/g, "");
        }

        // Generic nested update (unchanged)
        setFormData((prev) => {
            const updated = { ...prev };
            const keys = name.split(".");
            let ref: any = updated;

            for (let i = 0; i < keys.length - 1; i++) {
                ref[keys[i]] = { ...ref[keys[i]] };
                ref = ref[keys[i]];
            }
            ref[keys[keys.length - 1]] = sanitizedValue;
            return updated;
        });

        // ✅ Field‑specific validation: Company Name
        if (name === "customer.companyName") {
            const trimmed = sanitizedValue.trim();
            let msg = "";

            if (!trimmed) {
                msg = "Company Name is required.";
            } else if (trimmed.length < 3) {
                msg = "Company Name must be at least 3 characters.";
            }

            setErrors((prev) => ({ ...prev, companyName: msg }));
        }
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const customerId = Math.floor(100000 + Math.random() * 900000);
        const createdOn = new Date().toISOString().split("T")[0];

        const finalPayload = {
            customerId,
            name: `${formData.customer.firstName} ${formData.customer.lastName}`.trim(),
            customerType: formData.customer.customerType,
            createdOn,
            createdBy: "Admin",
            ...formData,
        };

        const existing = JSON.parse(localStorage.getItem("customers") || "[]");
        existing.push(finalPayload);
        localStorage.setItem("customers", JSON.stringify(existing));

        console.log("Customer saved:", finalPayload);
        navigate("/sales/customers");
    };

    // Render functions (unchanged but consolidated)
    const renderOtherDetailsTab = () => (
        <div className="row g-4 three-column-form">
            {/* COLUMN 1: PAN + Currency (2 fields) */}
            <div className="col-lg-4">
                {/* PAN */}
                <div className="so-form-group mb-4">
                    <label className="so-label text-sm text-muted-foreground fw-bold">
                        PAN:
                    </label>
                    <input
                        type="text"
                        name="otherDetails.pan"
                        className="form-control so-control"
                        placeholder='Enter your PAN'
                        value={formData.otherDetails.pan}
                        onChange={handleChange}
                    />
                </div>

                {/* Currency */}
                <div className="so-form-group mb-4">
                    <label className="so-label text-sm text-muted-foreground fw-bold">
                        Currency:
                    </label>
                    <select
                        name="otherDetails.currency"
                        value={formData.otherDetails.currency}
                        onChange={handleChange}
                        className="form-select so-control"
                        style={{ color: formData.otherDetails.currency ? "#000" : "#9b9b9b" }}
                    >
                        <option value="" disabled hidden>-- Select Currency --</option>
                        {currencies.map((c, i) => (
                            <option key={i} value={c}>{c}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* COLUMN 2: Payment Terms */}
            <div className="col-lg-4">
                <div className="so-form-group mb-4">
                    <label className="so-label text-sm text-muted-foreground fw-bold">
                        Payment Terms:
                    </label>
                    <select
                        name="otherDetails.paymentTerms"
                        value={formData.otherDetails.paymentTerms}
                        onChange={handleChange}
                        className="form-select so-control"
                        style={{ color: formData.otherDetails.paymentTerms ? "#000" : "#9b9b9b" }}
                    >
                        <option value="" disabled hidden>-- Select Payment Term --</option>
                        {paymentTerms.map((p, i) => (
                            <option key={i} value={p}>{p}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* COLUMN 3: Portal Language */}
            <div className="col-lg-4">
                <div className="so-form-group mb-4">
                    <label className="so-label text-sm text-muted-foreground fw-bold">
                        Portal Language:
                    </label>
                    <select
                        name="otherDetails.portalLanguage"
                        value={formData.otherDetails.portalLanguage}
                        onChange={handleChange}
                        className="form-select so-control"
                        style={{ color: formData.otherDetails.portalLanguage ? "#000" : "#9b9b9b" }}
                    >
                        <option value="" disabled hidden>-- Select Language --</option>
                        {languages.map((l, i) => (
                            <option key={i} value={l}>{l}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* FULL WIDTH Documents - Below all columns */}
            <div className="col-12 mt-4">
                <div className="so-form-group mb-4">
                    <label className="so-label text-sm text-muted-foreground fw-bold mb-3">
                        Documents:
                    </label>
                    <div
                        onClick={() => document.getElementById("fileUploadInput")?.click()}
                        className="doc-upload-box"
                    >
                        <FeatherUpload size={32} className="text-muted mb-2" />
                        <span className="text-secondary small">
                            Click to Upload Documents
                        </span>
                        <input
                            id="fileUploadInput"
                            type="file"
                            multiple
                            className="d-none"
                            onChange={(e) => {
                                const files = e.target.files;
                                if (files?.length) {
                                    console.log("Files uploaded:", files);
                                    alert(`${files.length} file(s) selected!`);
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>

    );


    const renderAddressTab = () => (
        <div className="row g-4 three-column-form">
            {/* COLUMN 1 */}
            <div className="col-lg-4">
                {/* Attention */}
                <div className="so-form-group mb-4">
                    <label className="so-label text-sm text-muted-foreground fw-bold">
                        Attention:
                    </label>
                    <input
                        type="text"
                        name="address.attention"
                        value={formData.address.attention}
                        onChange={handleChange}
                        className="form-control so-control"
                        placeholder="Enter attention name"
                    />
                </div>

                {/* Address Line 1 */}
                <div className="so-form-group mb-4">
                    <label className="so-label text-sm text-muted-foreground fw-bold">
                        Address Line 1:
                    </label>
                    <input
                        type="text"
                        name="address.address1"
                        value={formData.address.address1}
                        onChange={handleChange}
                        className="form-control so-control"
                        placeholder="Enter address line 1"
                    />
                </div>

                {/* City */}
                <div className="so-form-group mb-4">
                    <label className="so-label text-sm text-muted-foreground fw-bold">
                        City:
                    </label>
                    <input
                        type="text"
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleChange}
                        className="form-control so-control"
                        placeholder="Enter city"
                    />
                </div>
            </div>

            {/* COLUMN 2 */}
            <div className="col-lg-4">
                {/* Country */}
                <div className="so-form-group mb-4">
                    <label className="so-label text-sm text-muted-foreground fw-bold">
                        Country / Region:
                    </label>
                    <select
                        name="address.country"
                        value={formData.address.country}
                        onChange={handleChange}
                        className="form-select so-control"
                        style={{ color: formData.address.country ? "#000" : "#9b9b9b" }}
                    >
                        <option value="" disabled hidden>-- Select Country --</option>
                        {countries.map((cu, i) => (
                            <option key={i} value={cu}>{cu}</option>
                        ))}
                    </select>
                </div>

                {/* Address Line 2 */}
                <div className="so-form-group mb-4">
                    <label className="so-label text-sm text-muted-foreground fw-bold">
                        Address Line 2:
                    </label>
                    <input
                        type="text"
                        name="address.address2"
                        value={formData.address.address2}
                        onChange={handleChange}
                        className="form-control so-control"
                        placeholder="Enter address line 2"
                    />
                </div>

                {/* State */}
                <div className="so-form-group mb-4">
                    <label className="so-label text-sm text-muted-foreground fw-bold">
                        State / Province:
                    </label>
                    <select
                        name="address.state"
                        value={formData.address.state}
                        onChange={handleChange}
                        className="form-select so-control"
                        style={{ color: formData.address.state ? "#000" : "#9b9b9b" }}
                    >
                        <option value="" disabled hidden>-- Select State --</option>
                        {states.map((st, i) => (
                            <option key={i} value={st}>{st}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* COLUMN 3 */}
            <div className="col-lg-4">
                {/* ZIP */}
                <div className="so-form-group mb-4">
                    <label className="so-label text-sm text-muted-foreground fw-bold">
                        ZIP / Postal Code:
                    </label>
                    <input
                        type="text"
                        name="address.zip"
                        value={formData.address.zip}
                        onChange={handleChange}
                        className="form-control so-control"
                        placeholder="Enter ZIP / Postal Code"
                    />
                </div>

                {/* Phone - Combined as one field with horizontal layout */}
                <div className="so-form-group mb-4">
                    <label className="so-label text-sm text-muted-foreground fw-bold">
                        Phone:
                    </label>
                    <div className="row g-2">
                        <div className="col-2 ms-2">
                            <input
                                type="text"
                                name="address.countryCode"
                                placeholder="+91"
                                className="form-control so-control"
                                value={formData.address.countryCode}
                                onChange={handleChange}
                                inputMode="numeric"
                                pattern="[0-9]*"
                            // style={{ marginLeft: "5px" }}
                            />
                        </div>
                        <div className="col-9">
                            <input
                                type="text"
                                name="address.phoneNumber"
                                className="form-control so-control"
                                value={formData.address.phoneNumber}
                                onChange={handleChange}
                                placeholder='Enter phone'
                                inputMode="numeric"
                                pattern="[0-9]*"
                            />
                        </div>
                    </div>
                </div>

                {/* Fax */}
                <div className="so-form-group mb-4">
                    <label className="so-label text-sm text-muted-foreground fw-bold">
                        Fax:
                    </label>
                    <input
                        type="text"
                        name="address.fax"
                        value={formData.address.fax}
                        onChange={handleChange}
                        className="form-control so-control"
                        placeholder="Enter fax number"
                    />
                </div>
            </div>
        </div>
    );

    const renderContactPersons = () => (
        <div className="item-card">
            <div className="item-card-header">
                <span className="item-card-title">Contact Persons</span>
            </div>

            <div className="item-card-body">
                <div className="row">
                    <div className="col-md-12">
                        <table className="table table-sm align-middle item-table-inner">
                            <thead>
                                <tr>
                                    <th className="fw-medium text-dark" style={{ width: "125px" }}>Salutation</th>
                                    <th className="fw-medium text-dark">First Name</th>
                                    <th className="fw-medium text-dark">Last Name</th>
                                    <th className="fw-medium text-dark">Email Address</th>
                                    <th className="fw-medium text-dark">Phone No.</th>
                                    <th className="fw-medium text-dark">Designation</th>
                                    <th className="fw-medium text-dark">Department</th>
                                    <th className="fw-medium text-center text-dark">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {formData.contactPersons.map((person, index) => (
                                    <tr key={index}>
                                        <td>
                                            <select
                                                className="form-select form-control-sm border-0 item-input"
                                                value={person.salutation}
                                                onChange={(e) => handleContactChange(index, "salutation", e.target.value)}
                                            >
                                                <option value="" disabled>Select</option>
                                                {salutations.map(s => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                        </td>

                                        <td>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm border-0 item-input"
                                                value={person.firstName}
                                                onChange={(e) => handleContactChange(index, "firstName", e.target.value)}
                                            />
                                        </td>

                                        <td>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm border-0 item-input"
                                                value={person.lastName}
                                                onChange={(e) => handleContactChange(index, "lastName", e.target.value)}
                                            />
                                        </td>

                                        <td>
                                            <input
                                                type="email"
                                                className="form-control form-control-sm border-0 item-input"
                                                value={person.email}
                                                onChange={(e) => handleContactChange(index, "email", e.target.value)}
                                            />
                                        </td>

                                        <td>
                                            <input
                                                type="number"
                                                className="form-control form-control-sm border-0 item-input"
                                                value={person.phone}
                                                onChange={(e) => handleContactChange(index, "phone", e.target.value)}
                                            />
                                        </td>

                                        <td>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm border-0 item-input"
                                                value={person.designation}
                                                onChange={(e) => handleContactChange(index, "designation", e.target.value)}
                                            />
                                        </td>

                                        <td>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm border-0 item-input"
                                                value={person.department}
                                                onChange={(e) => handleContactChange(index, "department", e.target.value)}
                                            />
                                        </td>

                                        <td className="text-center">
                                            <button
                                                className="border-0 bg-body text-danger item-remove-btn"
                                                type="button"
                                                onClick={() => removeContactPerson(index)}
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
                            onClick={addContactPerson}
                        >
                            <Plus size={16} className="me-1" /> Add Contact Person
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );


    const renderRemarks = () => (
        <div className='so-form-group mb-4'>
            <label className="so-label text-sm text-muted-foreground fw-bold">Remarks <span className="text-muted">(For Internal Use)</span></label>
            <textarea name="remarks" rows={4} className="form-control so-control textarea" placeholder='Enter your remark...' value={formData.remarks} onChange={handleChange} style={{ resize: "none" }} />
        </div>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Other Details': return renderOtherDetailsTab();
            case 'Address': return renderAddressTab();
            case 'Contact Persons': return renderContactPersons();
            case 'Remarks': return renderRemarks();
            default: return <div className="p-4 bg-light border rounded text-center text-muted">Content coming soon.</div>;
        }
    };

    return (
        <>
            <Header />
            <div className="sales-orders-page">
                <form onSubmit={handleSubmit} className="sales-order-form">

                    {/* Top details card (like Sales Order) */}
                    {/* EXACT SAME 3-column card structure as Sales Order */}
                    <div className="so-details-card mx-5 mb-4">
                        <h1 className="sales-order-title mb-4">New Customer</h1>

                        <div className="row g-3 three-column-form">

                            {/* COLUMN 1 - Customer Type + Primary Contact + Phone */}
                            <div className="col-lg-4">
                                {/* Customer Type */}
                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Customer Type:
                                    </label>
                                    <div className="radio-row">
                                        <div className="form-check">
                                            <input
                                                type="radio"
                                                id="typeBusiness"
                                                name="customer.customerType"
                                                value="Business"
                                                checked={formData.customer.customerType === "Business"}
                                                onChange={handleChange}
                                                className="form-check-input"
                                            />
                                            <label htmlFor="typeBusiness" className="form-check-label">
                                                Business
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                type="radio"
                                                id="typeIndividual"
                                                name="customer.customerType"
                                                value="Individual"
                                                checked={formData.customer.customerType === "Individual"}
                                                onChange={handleChange}
                                                className="form-check-input"
                                            />
                                            <label htmlFor="typeIndividual" className="form-check-label">
                                                Individual
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Primary Contact - Salutation + First + Last (horizontal) */}
                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold mb-2">
                                        Primary Contact:
                                    </label>
                                    <div className="row g-2">
                                        <div className="col-4">
                                            <select
                                                name="customer.salutation"
                                                value={formData.customer.salutation}
                                                onChange={handleChange}
                                                className="form-select so-control"
                                                style={{ color: formData.customer.salutation ? "#000" : "#9b9b9b" }}
                                            >
                                                <option value="" disabled hidden>Mr/Ms</option>
                                                {salutations.map((s, i) => (
                                                    <option key={i} value={s}>{s}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-4">
                                            <input
                                                type="text"
                                                name="customer.firstName"
                                                value={formData.customer.firstName}
                                                onChange={handleChange}
                                                className="form-control so-control"
                                                placeholder="First Name"
                                            />
                                        </div>
                                        <div className="col-4">
                                            <input
                                                type="text"
                                                name="customer.lastName"
                                                value={formData.customer.lastName}
                                                onChange={handleChange}
                                                className="form-control so-control"
                                                placeholder="Last Name"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Phone:
                                    </label>
                                    <div className="row g-2">
                                        <div className="col-2">
                                            <input
                                                type="text"
                                                name="customer.countryCode"
                                                placeholder="+91"
                                                className="form-control so-control"
                                                value={formData.customer.countryCode}
                                                onChange={handleChange}
                                                inputMode="numeric"
                                                pattern="[0-9]*"
                                            />
                                        </div>
                                        <div className="col-10">
                                            <input
                                                type="text"
                                                name="customer.phoneNumber"
                                                className="form-control so-control"
                                                value={formData.customer.phoneNumber}
                                                onChange={handleChange}
                                                placeholder='Enter phone'
                                                inputMode="numeric"
                                                pattern="[0-9]*"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* COLUMN 2 - Company Name + Display Name */}
                            <div className="col-lg-4">
                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Company Name:*
                                    </label>
                                    <input
                                        type="text"
                                        name="customer.companyName"
                                        value={formData.customer.companyName}
                                        onChange={handleChange}
                                        placeholder='Enter Company name'
                                        className="form-control so-control"
                                    />
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Display Name:<span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="customer.displayName"
                                        value={formData.customer.displayName}
                                        onChange={handleChange}
                                        placeholder='Enter Display name'
                                        className={`form-control so-control ${errors.displayName ? "is-invalid" : ""}`}
                                    />
                                    {errors.displayName && (
                                        <div className="invalid-feedback d-block">
                                            {errors.displayName}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* COLUMN 3 - Email + Spacer */}
                            <div className="col-lg-4">
                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Email Address:
                                    </label>
                                    <input
                                        type="email"
                                        name="customer.emailAddress"
                                        value={formData.customer.emailAddress}
                                        onChange={handleChange}
                                        placeholder='customer@example.com'
                                        className="form-control so-control"
                                    />
                                </div>
                                {/* Empty space to match Sales Order's 3rd column height */}
                            </div>
                        </div>
                    </div>

                    {/* Tabs + content, aligned with theme */}
                    <div className="mx-5 form-container">
                        <div className="mt-2 border-bottom nav-tabs-container" ref={tabsContainerRef}>
                            <ul className="nav nav-tabs border-0">
                                {["Other Details", "Address", "Contact Persons", "Remarks"].map(
                                    (tab, index) => (
                                        <li key={tab} className="nav-item">
                                            <button
                                                ref={(el) => {
                                                    tabRefs.current[index] = el;
                                                }}
                                                type="button"
                                                className={`nav-link ${activeTab === tab ? "active" : ""}`}
                                                onClick={() => setActiveTab(tab)}
                                            >
                                                {tab}
                                            </button>
                                        </li>
                                    )
                                )}
                            </ul>
                            <div className="tab-indicator" style={indicatorStyle}></div>
                        </div>

                        <div className="pt-4">{renderTabContent()}</div>

                        <div className="d-flex justify-content-center mt-4 pt-4 border-top">
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
                                Save
                            </button>
                        </div>
                    </div>
                </form>
            </div>

        </>
    );
};

export default Add;
