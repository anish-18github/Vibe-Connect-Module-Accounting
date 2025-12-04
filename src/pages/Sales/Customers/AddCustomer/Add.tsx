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

    // ✅ FIXED: Main form handler - Correct field mapping
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        let sanitizedValue = value;

        // Sanitize phone numbers
        if (name === "customer.countryCode" || name === "customer.phoneNumber" ||
            name === "address.countryCode" || name === "address.phoneNumber") {
            sanitizedValue = value.replace(/\D/g, "");
        }

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
        <>
            <div className="row align-items-center mb-3">
                <label className="col-sm-2 col-form-label">PAN:</label>
                <div className="col-sm-6">
                    <input
                        type="text"
                        name="otherDetails.pan"
                        className="form-control form-control-sm border"
                        value={formData.otherDetails.pan}
                        onChange={handleChange}
                    />
                </div>
            </div>

            {/* ✅ Currency - NOW USED */}
            <div className="row align-items-center mb-3">
                <label className="col-sm-2 col-form-label">Currency:</label>
                <div className="col-sm-6">
                    <select
                        name="otherDetails.currency"
                        value={formData.otherDetails.currency}
                        onChange={handleChange}
                        className="form-select form-control-sm"
                        style={{ color: formData.otherDetails.currency ? "#000" : "#9b9b9b" }}
                    >
                        <option value="" disabled hidden>-- Select Currency --</option>
                        {currencies.map((c, i) => (
                            <option key={i} value={c}>{c}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* ✅ Payment Terms - NOW USED */}
            <div className="row align-items-center mb-3">
                <label className="col-sm-2 col-form-label">Payment Terms:</label>
                <div className="col-sm-6">
                    <select
                        name="otherDetails.paymentTerms"
                        value={formData.otherDetails.paymentTerms}
                        onChange={handleChange}
                        className="form-select form-control-sm"
                        style={{ color: formData.otherDetails.paymentTerms ? "#000" : "#9b9b9b" }}
                    >
                        <option value="" disabled hidden>-- Select Payment Term --</option>
                        {paymentTerms.map((p, i) => (
                            <option key={i} value={p}>{p}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* ✅ Portal Language - NOW USED */}
            <div className="row align-items-center mb-4">
                <label className="col-sm-2 col-form-label">Portal Language:</label>
                <div className="col-sm-6">
                    <select
                        name="otherDetails.portalLanguage"
                        value={formData.otherDetails.portalLanguage}
                        onChange={handleChange}
                        className="form-select form-control-sm"
                        style={{ color: formData.otherDetails.portalLanguage ? "#000" : "#9b9b9b" }}
                    >
                        <option value="" disabled hidden>-- Select Language --</option>
                        {languages.map((l, i) => (
                            <option key={i} value={l}>{l}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Documents Upload */}
            <div className="row mb-4">
                <label className="col-sm-2 col-form-label">Documents:</label>
                <div className="col-sm-6">
                    <div
                        onClick={() => document.getElementById("fileUploadInput")?.click()}
                        className="d-flex flex-column align-items-center justify-content-center w-100 p-4 bg-light cursor-pointer"
                        style={{
                            minHeight: "120px",
                            border: "2px dotted #a0a0a0",
                            borderRadius: "8px"
                        }}
                    >
                        <FeatherUpload size={32} className="text-muted mb-2" />
                        <span className="text-secondary small">Click to Upload Documents</span>
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
        </>
    );

    const renderAddressTab = () => (
        <>
            <div className="row align-items-center mb-3">
                <label className="col-sm-2 col-form-label">Attention:</label>
                <div className="col-sm-6">
                    <input
                        type="text"
                        name="address.attention"
                        value={formData.address.attention}
                        onChange={handleChange}
                        className="form-control form-control-sm border"
                        placeholder="Enter attention name"
                    />
                </div>
            </div>

            {/* ✅ Countries - NOW USED */}
            <div className="row align-items-center mb-3">
                <label className="col-sm-2 col-form-label">Country / Region:</label>
                <div className="col-sm-6">
                    <select
                        name="address.country"
                        value={formData.address.country}
                        onChange={handleChange}
                        className="form-select form-control-sm"
                        style={{ color: formData.address.country ? "#000" : "#9b9b9b" }}
                    >
                        <option value="" disabled hidden>-- Select Country --</option>
                        {countries.map((cu, i) => (
                            <option key={i} value={cu}>{cu}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="row align-items-center mb-3">
                <label className="col-sm-2 col-form-label">Address Line 1:</label>
                <div className="col-sm-6">
                    <input
                        type="text"
                        name="address.address1"
                        value={formData.address.address1}
                        onChange={handleChange}
                        className="form-control form-control-sm border"
                        placeholder="Enter address line 1"
                    />
                </div>
            </div>

            <div className="row align-items-center mb-3">
                <label className="col-sm-2 col-form-label">Address Line 2:</label>
                <div className="col-sm-6">
                    <input
                        type="text"
                        name="address.address2"
                        value={formData.address.address2}
                        onChange={handleChange}
                        className="form-control form-control-sm border"
                        placeholder="Enter address line 2"
                    />
                </div>
            </div>

            <div className="row align-items-center mb-3">
                <label className="col-sm-2 col-form-label">City:</label>
                <div className="col-sm-6">
                    <input
                        type="text"
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleChange}
                        className="form-control form-control-sm border"
                        placeholder="Enter city"
                    />
                </div>
            </div>

            {/* ✅ States - NOW USED */}
            <div className="row align-items-center mb-3">
                <label className="col-sm-2 col-form-label">State / Province:</label>
                <div className="col-sm-6">
                    <select
                        name="address.state"
                        value={formData.address.state}
                        onChange={handleChange}
                        className="form-select form-control-sm"
                        style={{ color: formData.address.state ? "#000" : "#9b9b9b" }}
                    >
                        <option value="" disabled hidden>-- Select State --</option>
                        {states.map((st, i) => (
                            <option key={i} value={st}>{st}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="row align-items-center mb-3">
                <label className="col-sm-2 col-form-label">ZIP / Postal Code:</label>
                <div className="col-sm-6">
                    <input
                        type="text"
                        name="address.zip"
                        value={formData.address.zip}
                        onChange={handleChange}
                        className="form-control form-control-sm border"
                        placeholder="Enter ZIP / Postal Code"
                    />
                </div>
            </div>

            <div className="row align-items-center mb-4">
                <label className="col-sm-2 col-form-label">Fax:</label>
                <div className="col-sm-6">
                    <input
                        type="text"
                        name="address.fax"
                        value={formData.address.fax}
                        onChange={handleChange}
                        className="form-control form-control-sm border"
                        placeholder="Enter fax number"
                    />
                </div>
            </div>

            <div className="row align-items-center mb-3">
                <label className="col-sm-2 col-form-label">Phone:</label>
                <div className="col-sm-1">
                    <input
                        type="text"
                        name="address.countryCode"
                        placeholder="+91"
                        className="form-control form-control-sm border"
                        value={formData.address.countryCode}
                        onChange={handleChange}
                        inputMode="numeric"
                        pattern="[0-9]*"
                    />
                </div>
                <div className="col-sm-4">
                    <input
                        type="text"
                        name="address.phoneNumber"
                        className="form-control form-control-sm border"
                        value={formData.address.phoneNumber}
                        onChange={handleChange}
                        inputMode="numeric"
                        pattern="[0-9]*"
                    />
                </div>
            </div>
        </>
    );

    const renderContactPersons = () => (
        <div>
            <table className="table table-bordered table-sm align-middle table-rounded">
                <thead className="bg-light">
                    <tr>
                        <th style={{ width: "120px" }}>Salutation</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email Address</th>
                        <th>Phone No.</th>
                        <th>Designation</th>
                        <th>Department</th>
                        <th style={{ width: "60px" }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {formData.contactPersons.map((person, index) => (
                        <tr key={index}>
                            <td>
                                <select className="form-select form-select-sm border-0" value={person.salutation}
                                    onChange={(e) => handleContactChange(index, "salutation", e.target.value)}>
                                    <option value="" disabled>Select</option>
                                    {salutations.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </td>
                            <td><input type="text" className="form-control form-control-sm border-0" value={person.firstName}
                                onChange={(e) => handleContactChange(index, "firstName", e.target.value)} /></td>
                            <td><input type="text" className="form-control form-control-sm border-0" value={person.lastName}
                                onChange={(e) => handleContactChange(index, "lastName", e.target.value)} /></td>
                            <td><input type="email" className="form-control form-control-sm border-0" value={person.email}
                                onChange={(e) => handleContactChange(index, "email", e.target.value)} /></td>
                            <td><input type="text" className="form-control form-control-sm border-0" value={person.phone}
                                onChange={(e) => handleContactChange(index, "phone", e.target.value)} /></td>
                            <td><input type="text" className="form-control form-control-sm border-0" value={person.designation}
                                onChange={(e) => handleContactChange(index, "designation", e.target.value)} /></td>
                            <td><input type="text" className="form-control form-control-sm border-0" value={person.department}
                                onChange={(e) => handleContactChange(index, "department", e.target.value)} /></td>
                            <td className="text-center">
                                <button type='button' className="btn btn-sm border-0" onClick={() => removeContactPerson(index)}>
                                    <X size={16} style={{ color: "red" }} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className="btn btn-outline-primary btn-sm mt-2 d-flex align-items-center gap-1" type='button' onClick={addContactPerson}>
                <Plus size={16} /> Add Contact Person
            </button>
        </div>
    );

    const renderRemarks = () => (
        <div>
            <label className="col-form-label pt-0">Remarks <span className="text-muted">(For Internal Use)</span></label>
            <textarea name="remarks" rows={4} className="form-control border" value={formData.remarks} onChange={handleChange} style={{ resize: "none" }} />
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
            <div style={{ padding: "0 1.8rem" }}>
                <h1 className="h4 text-dark mb-4 pb-1">New Customer</h1>
                <form onSubmit={handleSubmit} className="mt-4" style={{ color: "#5E5E5E" }}>
                    {/* ✅ FIXED: Customer Type Radio - Correct name */}
                    <div className="row align-items-center mb-2">
                        <label className="col-sm-2 col-form-label fw-normal">Customer Type:</label>
                        <div className="col-sm-6 d-flex align-items-center">
                            <div className="form-check me-4">
                                <input type="radio" id="typeBusiness" name="customer.customerType" value="Business"
                                    checked={formData.customer.customerType === "Business"} onChange={handleChange}
                                    className="form-check-input" />
                                <label htmlFor="typeBusiness" className="form-check-label">Business</label>
                            </div>
                            <div className="form-check">
                                <input type="radio" id="typeIndividual" name="customer.customerType" value="Individual"
                                    checked={formData.customer.customerType === "Individual"} onChange={handleChange}
                                    className="form-check-input" />
                                <label htmlFor="typeIndividual" className="form-check-label">Individual</label>
                            </div>
                        </div>
                    </div>

                    {/* ✅ FIXED: Primary Contact - Correct layout */}
                    <div className="row mb-2 align-items-center">
                        <label className="col-sm-2 col-form-label">Primary Contact:</label>
                        <div className="col-sm-2">
                            <select name="customer.salutation" value={formData.customer.salutation} onChange={handleChange}
                                className="form-select form-select-sm" style={{ color: formData.customer.salutation ? "#000" : "#9b9b9b" }}>
                                <option value="" disabled hidden>Salutation</option>
                                {salutations.map((s, i) => <option key={i} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className="col-sm-3">
                            <input type="text" name="customer.firstName" value={formData.customer.firstName}
                                onChange={handleChange} className="form-control form-control-sm border" placeholder="First Name" />
                        </div>
                        <div className="col-sm-2">
                            <input type="text" name="customer.lastName" value={formData.customer.lastName}
                                onChange={handleChange} className="form-control form-control-sm border" placeholder="Last Name" />
                        </div>
                    </div>

                    {/* ✅ FIXED: Phone Section - Correct field names */}
                    <div className="row align-items-center mb-3">
                        <label className="col-sm-2 col-form-label">Phone:</label>
                        <div className="col-sm-1">
                            <input type="text" name="customer.countryCode" placeholder="+91"
                                className="form-control form-control-sm border" value={formData.customer.countryCode}
                                onChange={handleChange} inputMode="numeric" pattern="[0-9]*" />
                        </div>
                        <div className="col-sm-4">
                            <input type="text" name="customer.phoneNumber" className="form-control form-control-sm border"
                                value={formData.customer.phoneNumber} onChange={handleChange} inputMode="numeric" pattern="[0-9]*" />
                        </div>
                    </div>

                    {/* Company Name, Display Name, Email - unchanged */}
                    <div className="row align-items-center mb-2">
                        <label className="col-sm-2 col-form-label">Company Name:</label>
                        <div className="col-sm-6">
                            <input type="text" name="customer.companyName" value={formData.customer.companyName}
                                onChange={handleChange} className="form-control form-control-sm border" />
                        </div>
                    </div>
                    <div className="row align-items-center mb-2">
                        <label className="col-sm-2 col-form-label">Display Name:</label>
                        <div className="col-sm-6">
                            <input type="text" name="customer.displayName" value={formData.customer.displayName}
                                onChange={handleChange} className="form-control form-control-sm border" />
                        </div>
                    </div>
                    <div className="row align-items-center mb-2">
                        <label className="col-sm-2 col-form-label">Email Address:</label>
                        <div className="col-sm-6">
                            <input type="email" name="customer.emailAddress" value={formData.customer.emailAddress}
                                onChange={handleChange} className="form-control form-control-sm border" />
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="mt-4 border-bottom nav-tabs-container" ref={tabsContainerRef}>
                        <ul className="nav nav-tabs border-0">
                            {['Other Details', 'Address', 'Contact Persons', 'Remarks'].map((tab, index) => (
                                <li key={tab} className="nav-item">
                                    <button ref={(el) => { tabRefs.current[index] = el; }} type="button"
                                        className={`nav-link ${activeTab === tab ? 'active' : ''}`}
                                        onClick={() => setActiveTab(tab)}>
                                        {tab}
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <div className="tab-indicator" style={indicatorStyle}></div>
                    </div>

                    <div className="pt-4">{renderTabContent()}</div>

                    <div className="d-flex justify-content-center mt-4 pt-4 border-top">
                        <button type="button" className="btn border me-3 px-4" onClick={() => navigate(-1)}>
                            Cancel
                        </button>
                        <button type="submit" className="btn px-4" style={{ background: "#7991BB", color: "#FFFFFF" }}>
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Add;
