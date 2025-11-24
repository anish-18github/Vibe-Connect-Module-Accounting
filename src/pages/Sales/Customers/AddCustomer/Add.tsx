import React, { useState, useRef, useEffect } from 'react';
import type { ChangeEvent, FormEvent, RefObject } from 'react';
import Header from '../../../../components/Header/Header';
import './addCustomer.css'

// --- 1. Interface Definitions for Type Safety ---

interface FormData {
    salutation: string;
    firstName: string;
    lastName: string;
    companyName: string;
    displayName: string;
    emailAddress: string;
    countryCode: string;
    phoneNumber: string;
    pan: string;
    currency: string;
    paymentTerms: string;
    portalLanguage: string;
}

interface LabeledFieldProps {
    label: string;
    name: keyof FormData;
    value: string;
    type?: string;
    options?: string[];
    required?: boolean;
    isSelect?: boolean;
}

interface PhoneInputProps {
    countryCode: string;
    phoneNumber: string;
}

// Mock data for dropdowns
const salutations = ['Mr.', 'Ms.', 'Mrs.', 'Dr.', 'Sir', 'Madam'];
const currencies = ['USD - US Dollar', 'EUR - Euro', 'INR - Indian Rupee'];
const paymentTerms = ['Net 15', 'Net 30', 'Due on Receipt', 'Custom'];
const languages = ['English', 'Spanish', 'French', 'German'];

// Feather Upload Icon as a React Component (SVG)
const FeatherUpload = ({ className = 'text-muted', size = 32 }: { className?: string, size?: number }) => (
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

// Main Application Component
const App = () => {
    // --- Form State ---
    const [customerType, setCustomerType] = useState<'Business' | 'Individual'>('Business');
    const [formData, setFormData] = useState<FormData>({
        // Basic Info
        salutation: 'Mr.',
        firstName: '',
        lastName: '',
        companyName: '',
        displayName: '',
        emailAddress: '',
        countryCode: '+1',
        phoneNumber: '',
        // Other Details Tab
        pan: '',
        currency: currencies[0],
        paymentTerms: paymentTerms[1],
        portalLanguage: languages[0],
    });

    // --- Tab State & Animation Logic ---
    const tabs = ['Other Details', 'Address', 'Contact Persons', 'Remarks'];
    // Using an array of RefObject<HTMLButtonElement | null> for tab references
    const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const tabsContainerRef = useRef<HTMLDivElement>(null);
    // const buttonRef = useRef<HTMLButtonElement | null>(null);

    const [activeTab, setActiveTab] = useState(tabs[0]);
    const [indicatorStyle, setIndicatorStyle] = useState({});


    // Function to calculate the indicator position
    const calculateIndicatorPosition = () => {
        const activeIndex = tabs.indexOf(activeTab);
        const activeTabElement = tabRefs.current[activeIndex];
        const container = tabsContainerRef.current;

        // FIX 1: Add null checks for activeTabElement and container
        if (activeTabElement && container) {
            const tabRect = activeTabElement.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();

            setIndicatorStyle({
                width: `${tabRect.width}px`,
                transform: `translateX(${tabRect.left - containerRect.left}px)`,
            });
        }
    };

    // Recalculates indicator position on tab change and window resize
    useEffect(() => {
        calculateIndicatorPosition();
        window.addEventListener('resize', calculateIndicatorPosition);
        return () => {
            window.removeEventListener('resize', calculateIndicatorPosition);
        };
    }, [activeTab]);

    // Handle input changes
    // FIX 2: Explicitly type the event argument
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        // Type assertion to ensure name is a valid key of FormData
        setFormData(prev => ({ ...prev, [name as keyof FormData]: value }));
    };

    // Handle form submission
    // FIX 3: Explicitly type the event argument
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        console.log("Form Data Submitted:", formData);
        const message = `Form data submitted successfully! Check console for details.
      Customer: ${formData.displayName || formData.firstName} ${formData.lastName}
      Type: ${customerType}`;
        console.info(message);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // --- Utility Components (Stacked Labels to match the image) ---

    // Standard Stacked Input/Select component
    // FIX 4: Use interface for props
    const LabeledFieldStacked: React.FC<LabeledFieldProps> = ({
        label,
        name,
        value,
        type = 'text',
        options = [], // FIX 5: Provide default empty array for options
        required = false,
        isSelect = false
    }) => (
        <div className="mb-3">
            <label htmlFor={name as string} className="form-label text-sm fw-medium text-secondary">
                {label}
            </label>
            {isSelect ? (
                <select
                    id={name as string}
                    name={name as string}
                    value={value}
                    onChange={handleChange}
                    required={required}
                    className="form-select form-select-sm"
                >
                    {/* FIX 6: Explicitly type parameters in map */}
                    {options.map((option: string, index: number) => (
                        <option key={index} value={option}>{option}</option>
                    ))}
                </select>
            ) : (
                <input
                    type={type}
                    id={name as string}
                    name={name as string}
                    value={value}
                    onChange={handleChange}
                    required={required}
                    className="form-control form-control-sm"
                />
            )}
        </div>
    );

    // Custom Phone Input to match the visual split in the image
    // FIX 7: Use interface for props
    const PhoneInputStacked: React.FC<PhoneInputProps> = ({ countryCode, phoneNumber }) => (
        <div className="mb-3">
            <label className="form-label text-sm fw-medium text-secondary">
                Phone:
            </label>
            <div className="row g-2">
                {/* Input 1 (left side) - width col-6 */}
                <div className="col-6">
                    <input
                        type="text"
                        id="countryCode"
                        name="countryCode"
                        value={countryCode}
                        onChange={handleChange}
                        className="form-control form-control-sm"
                        placeholder="Country Code"
                    />
                </div>
                {/* Input 2 (right side) - width col-6 */}
                <div className="col-6">
                    <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={phoneNumber}
                        onChange={handleChange}
                        className="form-control form-control-sm"
                        placeholder="Phone Number"
                    />
                </div>
            </div>
        </div>
    );

    // --- Tab Content Renderers ---

    const renderOtherDetailsTab = () => (
        <div className="row g-3 mt-2">
            {/* All fields are full width (col-12) as per the image */}
            <div className="col-12">
                <LabeledFieldStacked
                    label="PAN:"
                    name="pan"
                    value={formData.pan}
                />
            </div>
            <div className="col-12">
                <LabeledFieldStacked
                    label="Currency:"
                    name="currency"
                    value={formData.currency}
                    options={currencies}
                    isSelect
                />
            </div>
            <div className="col-12">
                <LabeledFieldStacked
                    label="Payment Terms:"
                    name="paymentTerms"
                    value={formData.paymentTerms}
                    options={paymentTerms}
                    isSelect
                />
            </div>
            <div className="col-12">
                <LabeledFieldStacked
                    label="Portal Language:"
                    name="portalLanguage"
                    value={formData.portalLanguage}
                    options={languages}
                    isSelect
                />
            </div>

            <div className="col-12 mt-4">
                <label className="form-label text-sm fw-medium text-secondary">Documents:</label>
                {/* Plain border style to match the image */}
                <div className="d-flex align-items-center justify-content-center w-100 p-5 border border-secondary-subtle rounded-3 bg-light text-center cursor-pointer hover-shadow"
                    style={{ minHeight: '150px' }}>
                    <div className="d-flex flex-column align-items-center">
                        <FeatherUpload size={32} className="text-muted mb-2" />
                        <span className="text-sm text-secondary">Click to Upload</span>
                    </div>
                    <input type="file" className="d-none" multiple />
                </div>
            </div>
        </div>
    );

    // FIX 8: Explicitly type the name parameter
    const renderPlaceholderTab = (name: string) => (
        <div className="p-4 p-md-5 mt-4 bg-light rounded-3 text-center text-muted border border-dashed border-secondary-subtle">
            <p className="lead fw-bold text-secondary">Tab: {name}</p>
            <p className="mb-0">This section is a placeholder for **{name}**-related fields and configurations.</p>
        </div>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Other Details':
                return renderOtherDetailsTab();
            case 'Address':
            case 'Contact Persons':
            case 'Remarks':
                return renderPlaceholderTab(activeTab);
            default:
                return null;
        }
    };


    // Custom styles for the animated indicator (simplified)
    //     const customStyles = `
    //     .nav-tabs-container {
    //       position: relative;
    //     }
    //     .tab-indicator {
    //       position: absolute;
    //       bottom: 0;
    //       height: 2px;
    //       background-color: var(--bs-primary);
    //       transition: transform 0.3s ease-in-out, width 0.3s ease-in-out;
    //       border-radius: 999px;
    //     }
    //     .nav-link {
    //         padding: 0.5rem 0.1rem;
    //         margin-right: 1.5rem;
    //         border: none !important;
    //         border-bottom: 2px solid transparent !important;
    //         color: var(--bs-gray-600);
    //         font-weight: 500;
    //         cursor: pointer;
    //     }
    //     .nav-link.active, .nav-link:focus, .nav-link:hover {
    //         color: var(--bs-primary);
    //         background-color: transparent !important;
    //     }
    //     /* Simple form label appearance to match the image */
    //     .form-label {
    //         margin-bottom: 0.2rem;
    //     }
    //   `;

    // --- Main Render ---
    return (
        <>
            {/* Bootstrap CSS CDN link */}
            <link
                rel="stylesheet"
                href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
                integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
                crossOrigin="anonymous"
            />

            <Header />


            <div style={{ marginLeft: 80, paddingRight: 160 }} >
                <h1 className="h4 text-dark mb-4 pb-1">New Customer</h1>

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

                    {/* Primary Contact Title */}
                    {/* <div className="mb-2 fw-semibold text-secondary">
                        Primary Contact:
                    </div> */}

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

                    {/* TABS */}
                    <div className="mt-4 border-bottom nav-tabs-container" ref={tabsContainerRef}>
                        <ul className="nav nav-tabs border-0">
                            {tabs.map((tab, index) => (
                                <li className="nav-item" key={tab}>
                                    <button
                                        ref={(el) => { tabRefs.current[index] = el; }}
                                        className={`nav-link ${activeTab === tab ? "active" : ""}`}
                                        onClick={() => setActiveTab(tab)}
                                        type="button"
                                    >
                                        {tab}
                                    </button>
                                </li>
                            ))}
                        </ul>

                        {/* Blue line under active tab */}
                        <div className="tab-indicator" style={indicatorStyle}></div>
                    </div>

                    {/* TAB CONTENT */}
                    <div className="pt-4">
                        {activeTab === "Other Details" && (
                            <>
                                {/* PAN */}
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
                        )}

                        {(activeTab === "Address" ||
                            activeTab === "Contact Persons" ||
                            activeTab === "Remarks") && (
                                <div className="p-4 bg-light border rounded text-center text-muted">
                                    <strong>{activeTab}</strong> content coming soon.
                                </div>
                            )}
                    </div>

                    {/* Buttons */}
                    <div className="d-flex justify-content-center mt-4 pt-4 border-top">
                        <button
                            type="button"
                            className="btn btn-outline-secondary me-3 px-4"
                            onClick={() => console.log("Cancel pressed")}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary px-4"
                        >
                            Save
                        </button>
                    </div>
                </form>

            </div>
        </>
    );
};

export default App;