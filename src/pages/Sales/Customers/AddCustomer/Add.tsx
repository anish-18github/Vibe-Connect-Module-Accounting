import React, { useState, useRef, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import Header from '../../../../components/Header/Header';
import './addCustomer.css';
import { Plus, X } from 'react-feather';

// ---------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------
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
        salutation: string;
        firstName: string;
        lastName: string;
        companyName: string;
        displayName: string;
        emailAddress: string;
        countryCode: string;
        phoneNumber: string;
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
        fax: string;
    };
    contactPersons: ContactPerson[];
    remarks: string;
}


// ---------------------------------------------
// 2. Dropdown Data
// ---------------------------------------------
const salutations = ['Mr.', 'Ms.', 'Mrs.', 'Dr.', 'Sir', 'Madam'];
const currencies = ['USD - US Dollar', 'EUR - Euro', 'INR - Indian Rupee'];
const paymentTerms = ['Net 15', 'Net 30', 'Due on Receipt', 'Custom'];
const languages = ['English', 'Spanish', 'French', 'German'];

// ---------------------------------------------
// 3. Icon Component
// ---------------------------------------------
const FeatherUpload = ({ className = 'text-muted', size = 32 }: { className?: string; size?: number }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`feather feather-upload ${className}`}
    >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="17 8 12 3 7 8"></polyline>
        <line x1="12" y1="3" x2="12" y2="15"></line>
    </svg>
);

// ---------------------------------------------
// 4. Main Component
// ---------------------------------------------
const App = () => {
    const [customerType, setCustomerType] = useState<'Business' | 'Individual'>('Business');

    // ---------------------------------------------
    // 5. FORM STATE (UPDATED INCLUDING ADDRESS)
    // ---------------------------------------------
    const [formData, setFormData] = useState<FormData>({
        customer: {
            salutation: "",
            firstName: "",
            lastName: "",
            companyName: "",
            displayName: "",
            emailAddress: "",
            countryCode: "",
            phoneNumber: "",
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
            fax: "",
        },
        contactPersons: [
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
        remarks: "",
    });




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
        const updatedContacts = formData.contactPersons.filter(
            (_, i) => i !== index
        );
        setFormData({ ...formData, contactPersons: updatedContacts });
    };


    const handleContactChange = (
        index: number,
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const updatedContacts = [...formData.contactPersons];
        updatedContacts[index] = {
            ...updatedContacts[index],
            [e.target.name]: e.target.value,
        };

        setFormData({ ...formData, contactPersons: updatedContacts });
    };




    const tabs = ['Other Details', 'Address', 'Contact Persons', 'Remarks'];
    const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const tabsContainerRef = useRef<HTMLDivElement>(null);

    const [activeTab, setActiveTab] = useState(tabs[0]);
    const [indicatorStyle, setIndicatorStyle] = useState({});

    // ---------------------------------------------
    // 6. Animated Indicator
    // ---------------------------------------------
    const calculateIndicatorPosition = () => {
        const activeIndex = tabs.indexOf(activeTab);
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

    // ---------------------------------------------
    // 7. Handle Field Change
    // ---------------------------------------------
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target; // e.g. "customer.firstName"
        const keys = name.split(".");     // ["customer", "firstName"]

        setFormData((prev) => {
            const updated = { ...prev };
            let ref: any = updated;

            for (let i = 0; i < keys.length - 1; i++) {
                ref[keys[i]] = { ...ref[keys[i]] };
                ref = ref[keys[i]];
            }

            ref[keys[keys.length - 1]] = value;
            return updated;
        });
    };


    // ---------------------------------------------
    // 8. Submit Form
    // ---------------------------------------------
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        console.log('Form Submitted:', formData);
        alert('Form submitted, check console!');
    };


    // ---------------------------------------------
    // 9. Render Other Details TAB
    // ---------------------------------------------
    const renderOtherDetailsTab = () => (
        <>
            <div className="row align-items-center mb-3">
                <label className="col-sm-2 col-form-label">PAN:</label>
                <div className="col-sm-6">
                    <input
                        type="text"
                        name="pan"
                        className="form-control form-control-sm"
                        value={formData.pan}
                        onChange={handleChange}
                    />
                </div>
            </div>

            {/* Currency */}
            <div className="row align-items-center mb-3">
                <label className="col-sm-2 col-form-label">Currency:</label>
                <div className="col-sm-6">
                    <select
                        name="currency"
                        value={formData.currency}
                        onChange={handleChange}
                        className="form-select form-select-sm"
                    >
                        {currencies.map((c, i) => (
                            <option key={i} value={c}>{c}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Payment Terms */}
            <div className="row align-items-center mb-3">
                <label className="col-sm-2 col-form-label">Payment Terms:</label>
                <div className="col-sm-6">
                    <select
                        name="paymentTerms"
                        value={formData.paymentTerms}
                        onChange={handleChange}
                        className="form-select form-select-sm"
                    >
                        {paymentTerms.map((p, i) => (
                            <option key={i} value={p}>{p}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Portal Language */}
            <div className="row align-items-center mb-4">
                <label className="col-sm-2 col-form-label">Portal Language:</label>
                <div className="col-sm-6">
                    <select
                        name="portalLanguage"
                        value={formData.portalLanguage}
                        onChange={handleChange}
                        className="form-select form-select-sm"
                    >
                        {languages.map((l, i) => (
                            <option key={i} value={l}>{l}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Upload Box */}
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

                        {/* Hidden file input */}
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


    // ---------------------------------------------
    // 10. Render Address TAB
    // ---------------------------------------------
    const renderAddressTab = () => (
        <>
            {/* Attention */}
            <div className="row align-items-center mb-3">
                <label className="col-sm-2 col-form-label">Attention:</label>
                <div className="col-sm-6">
                    <input
                        type="text"
                        name="attention"
                        value={formData.attention}
                        onChange={handleChange}
                        className="form-control form-control-sm"
                        placeholder="Enter attention name"
                    />
                </div>
            </div>

            {/* Country */}
            <div className="row align-items-center mb-3">
                <label className="col-sm-2 col-form-label">Country / Region:</label>
                <div className="col-sm-6">
                    <select
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="form-select form-select-sm text-muted"
                    >
                        <option value="" disabled hidden>Select Country</option>
                        <option value="India">India</option>
                        <option value="USA">United States</option>
                        <option value="UK">United Kingdom</option>
                        <option value="Germany">Germany</option>
                    </select>
                </div>
            </div>

            {/* Address Line 1 */}
            <div className="row align-items-center mb-3">
                <label className="col-sm-2 col-form-label">Address Line 1:</label>
                <div className="col-sm-6">
                    <input
                        type="text"
                        name="address1"
                        value={formData.address1}
                        onChange={handleChange}
                        className="form-control form-control-sm"
                        placeholder="Enter address line 1"
                    />
                </div>
            </div>

            {/* Address Line 2 */}
            <div className="row align-items-center mb-3">
                <label className="col-sm-2 col-form-label">Address Line 2:</label>
                <div className="col-sm-6">
                    <input
                        type="text"
                        name="address2"
                        value={formData.address2}
                        onChange={handleChange}
                        className="form-control form-control-sm"
                        placeholder="Enter address line 2"
                    />
                </div>
            </div>

            {/* City */}
            <div className="row align-items-center mb-3">
                <label className="col-sm-2 col-form-label">City:</label>
                <div className="col-sm-6">
                    <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="form-control form-control-sm"
                        placeholder="Enter city"
                    />
                </div>
            </div>

            {/* State */}
            <div className="row align-items-center mb-3">
                <label className="col-sm-2 col-form-label">State / Province:</label>
                <div className="col-sm-6">
                    <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="form-control form-control-sm"
                        placeholder="Enter state"
                    />
                </div>
            </div>

            {/* ZIP */}
            <div className="row align-items-center mb-3">
                <label className="col-sm-2 col-form-label">ZIP / Postal Code:</label>
                <div className="col-sm-6">
                    <input
                        type="text"
                        name="zip"
                        value={formData.zip}
                        onChange={handleChange}
                        className="form-control form-control-sm"
                        placeholder="Enter ZIP / Postal Code"
                    />
                </div>
            </div>

            {/* Fax */}
            <div className="row align-items-center mb-4">
                <label className="col-sm-2 col-form-label">Fax:</label>
                <div className="col-sm-6">
                    <input
                        type="text"
                        name="fax"
                        value={formData.fax}
                        onChange={handleChange}
                        className="form-control form-control-sm"
                        placeholder="Enter fax number"
                    />
                </div>
            </div>

            {/* Phone */}
            <div className="row align-items-center mb-3">
                <label className="col-sm-1 col-form-label">Phone:</label>
                <div className="col-sm-1">
                    <input
                        type="text"
                        name="countryCode"
                        placeholder="+1"
                        className="form-control form-control-sm"
                        value={formData.countryCode}
                        onChange={handleChange}
                    />
                </div>
                <div className="col-sm-4">
                    <input
                        type="tel"
                        name="phoneNumber"
                        className="form-control form-control-sm"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                    />
                </div>
            </div>
        </>
    );
    // ---------------------------------------------
    // 11. Render Contact Persons TAB
    // ---------------------------------------------
    const renderContactPersons = () => (
        <> <table className="table table-bordered table-sm align-middle"> <thead className="bg-light">
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
                            <select
                                name="salutation"
                                className="form-select form-select-sm"
                                value={person.salutation}
                                onChange={(e) => handleContactChange(index, e)}
                            >
                                <option value="">Select</option>
                                <option value="Mr.">Mr.</option>
                                <option value="Mrs.">Mrs.</option>
                                <option value="Ms.">Ms.</option>
                                <option value="Dr.">Dr.</option>
                            </select>
                        </td>

                        <td>
                            <input
                                type="text"
                                name="firstName"
                                className="form-control form-control-sm"
                                value={person.firstName}
                                onChange={(e) => handleContactChange(index, e)}
                            />
                        </td>

                        <td>
                            <input
                                type="text"
                                name="lastName"
                                className="form-control form-control-sm"
                                value={person.lastName}
                                onChange={(e) => handleContactChange(index, e)}
                            />
                        </td>

                        <td>
                            <input
                                type="email"
                                name="email"
                                className="form-control form-control-sm"
                                value={person.email}
                                onChange={(e) => handleContactChange(index, e)}
                            />
                        </td>

                        <td>
                            <input
                                type="text"
                                name="phone"
                                className="form-control form-control-sm"
                                value={person.phone}
                                onChange={(e) => handleContactChange(index, e)}
                            />
                        </td>

                        <td>
                            <input
                                type="text"
                                name="designation"
                                className="form-control form-control-sm"
                                value={person.designation}
                                onChange={(e) => handleContactChange(index, e)}
                            />
                        </td>

                        <td>
                            <input
                                type="text"
                                name="department"
                                className="form-control form-control-sm"
                                value={person.department}
                                onChange={(e) => handleContactChange(index, e)}
                            />
                        </td>

                        <td className="text-center">
                            <button
                                type='button'
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => removeContactPerson(index)}
                                title="Remove"
                            >
                                <X size={16} />
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>

            <button
                className="btn btn-outline-primary btn-sm mt-2 d-flex align-items-center gap-1"
                type='button'
                onClick={addContactPerson}
                title="Add Contact Person"
            >
                <Plus size={16} /> Add Contact Person
            </button>
        </>
    );
    // ---------------------------------------------
    // 12. Render Contact Persons TAB
    // ---------------------------------------------
    const renderRemarks = () => (
        <>
            <label className="col-form-label pt-0">
                Remarks <span className="text-muted">(For Internal Use)</span>
            </label>

            <textarea
                name="remarks"
                rows={4}
                className="form-control"
                value={formData.remarks}
                onChange={handleChange}
            />
        </>
    );





    // ---------------------------------------------
    // 10. TAB CONTENT SWITCH
    // ---------------------------------------------
    const renderTabContent = () => {
        switch (activeTab) {
            case 'Other Details':
                return renderOtherDetailsTab();
            case 'Address':
                return renderAddressTab();
            case 'Contact Persons':
                return renderContactPersons();
            case 'Remarks':
                return renderRemarks();
            default:
                return (
                    <div className="p-4 bg-light border rounded text-center text-muted">
                        <strong>{activeTab}</strong> content coming soon.
                    </div>
                );
        }
    };

    // ---------------------------------------------
    // 11. MAIN RETURN
    // ---------------------------------------------
    return (
        <>
            <Header />

            <div style={{ marginLeft: 80, paddingRight: 160 }}>
                <h1 className="h4 text-dark mb-4 pb-1">New Customer</h1>

                {/* MAIN FORM */}

                <form onSubmit={handleSubmit} className="mt-4">

                    {/* Customer Type */}
                    <div className="row align-items-center mb-4">
                        <label className="col-sm-2 col-form-label fw-semibold text-secondary">
                            Customer Type:
                        </label>
                        <div className="col-sm-6 d-flex align-items-center">
                            <div className="form-check me-4">
                                <input
                                    type="radio"
                                    id="typeBusiness"
                                    name="customerType"
                                    value="Business"
                                    checked={customerType === 'Business'}
                                    onChange={() => setCustomerType('Business')}
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
                                    name="customerType"
                                    value="Individual"
                                    checked={customerType === 'Individual'}
                                    onChange={() => setCustomerType('Individual')}
                                    className="form-check-input"
                                />
                                <label htmlFor="typeIndividual" className="form-check-label">
                                    Individual
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Salutation / First Name / Last Name */}
                    <div className="row mb-3 align-items-center">
                        <label className="col-sm-2 col-form-label">Primary Contact: </label>
                        <div className="col-sm-2">
                            <select
                                name="salutation"
                                value={formData.salutation}
                                onChange={handleChange}
                                className="form-select form-select-sm"
                            >
                                <option value="" disabled hidden>
                                    Salutation                                </option>
                                {salutations.map((s, i) => (
                                    <option key={i} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>

                        {/* <label className="col-sm-2 col-form-label">First Name:</label> */}
                        <div className="col-sm-3">
                            <input
                                type="text"
                                name="firstName"
                                className="form-control form-control-sm"
                                placeholder='First Name'
                                value={formData.firstName}
                                onChange={handleChange}
                            />
                        </div>

                        {/* <label className="col-sm-1 col-form-label">Last:</label> */}
                        <div className="col-sm-2">
                            <input
                                type="text"
                                name="lastName"
                                placeholder='Last name'
                                className="form-control form-control-sm"
                                value={formData.lastName}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Company Name */}
                    <div className="row align-items-center mb-3">
                        <label className="col-sm-2 col-form-label">Company Name:</label>
                        <div className="col-sm-6">
                            <input
                                type="text"
                                name="companyName"
                                className="form-control form-control-sm"
                                value={formData.companyName}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Display Name */}
                    <div className="row align-items-center mb-3">
                        <label className="col-sm-2 col-form-label">Display Name:</label>
                        <div className="col-sm-6">
                            <input
                                type="text"
                                name="displayName"
                                className="form-control form-control-sm"
                                value={formData.displayName}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="row align-items-center mb-3">
                        <label className="col-sm-2 col-form-label">Email Address:</label>
                        <div className="col-sm-6">
                            <input
                                type="email"
                                name="emailAddress"
                                className="form-control form-control-sm"
                                value={formData.emailAddress}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="row align-items-center mb-3">
                        <label className="col-sm-2 col-form-label">Phone:</label>
                        <div className="col-sm-2">
                            <input
                                type="text"
                                name="countryCode"
                                placeholder="+1"
                                className="form-control form-control-sm"
                                value={formData.countryCode}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-sm-4">
                            <input
                                type="tel"
                                name="phoneNumber"
                                className="form-control form-control-sm"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* ————— TABS ————— */}
                    <div className="mt-4 border-bottom nav-tabs-container" ref={tabsContainerRef}>
                        <ul className="nav nav-tabs border-0">
                            {tabs.map((tab, index) => (
                                <li key={tab} className="nav-item">
                                    <button
                                        ref={(el) => { tabRefs.current[index] = el; }}
                                        type="button"
                                        className={`nav-link ${activeTab === tab ? 'active' : ''}`}
                                        onClick={() => setActiveTab(tab)}
                                    >
                                        {tab}
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <div className="tab-indicator" style={indicatorStyle}></div>
                    </div>

                    {/* TAB CONTENT */}
                    <div className="pt-4">{renderTabContent()}</div>

                    {/* Submit Buttons */}
                    <div className="d-flex justify-content-center mt-4 pt-4 border-top">
                        <button type="button" className="btn btn-outline-secondary me-3 px-4">
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary px-4">
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default App;
