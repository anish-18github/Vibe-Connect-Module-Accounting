import React, { useState, useRef, useEffect } from 'react';
import Header from '../../../../components/Header/Header';
import { useNavigate } from 'react-router-dom';
import { Plus, X } from 'react-feather';
import './addVendor.css'; // you may keep a separate CSS or reuse addCustomer.css
import { FeatherUpload } from '../../../Sales/Customers/AddCustomer/Add';



// Interfaces (renamed customer to vendor)
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
    vendor: {
        vendorType: string;
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
        countryCode: string;
        phoneNumber: string;
        fax: string;
    };
    contactPersons: ContactPerson[];
    remarks: string;
}

// Dropdown data (reuse or customize)
const salutations = ['Mr.', 'Ms.', 'Mrs.', 'Dr.', 'Sir', 'Madam'];
const currencies = ['USD - US Dollar', 'EUR - Euro', 'INR - Indian Rupee'];
const paymentTerms = ['Net 15', 'Net 30', 'Due on Receipt', 'Custom'];
const languages = ['English', 'Spanish', 'French', 'German'];
const countries = ['India', 'United States', 'United Kingdom', 'Canada', 'Australia'];
const states = ['Maharashtra', 'Gujarat', 'Karnataka', 'Tamil Nadu', 'Uttar Pradesh'];

// Component
const AddVendor = () => {
    const [formData, setFormData] = useState<FormData>({
        vendor: {
            vendorType: "",
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
            countryCode: "",
            phoneNumber: "",
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

    // The rest of the handlers (addContactPerson, removeContactPerson, handleContactChange, handleChange, handleSubmit) 
    // follow the exact same logic but adjust field names from customer -> vendor accordingly.


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


    const handleContactChange = (index: number, field: string, value: string) => {
        const updated = [...formData.contactPersons];
        updated[index] = { ...updated[index], [field]: value };
        setFormData({ ...formData, contactPersons: updated });
    };





    const tabs = ['Other Details', 'Address', 'Contact Persons', 'Bank Details', 'Remarks'];
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
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name } = e.target;   // e.g. "customer.firstName"
        let value = e.target.value;

        const keys = name.split(".");       // ["customer", "firstName"]

        // Sanitize numbers only
        if (name === "address.phoneNumber" || name === "address.countryCode") {
            value = value.replace(/\D/g, "");
        }

        setFormData((prev) => {
            const updated = { ...prev };
            let ref: any = updated;

            // Navigate through object based on name keys
            for (let i = 0; i < keys.length - 1; i++) {
                ref[keys[i]] = { ...ref[keys[i]] };
                ref = ref[keys[i]];
            }


            // Set final nested property
            ref[keys[keys.length - 1]] = value;

            return updated;
        });

    };


    // Example: customerType → vendorType, customer → vendor (in the form data and UI)

    // For brevity, you can copy & replace all logic with vendor-related field names.

    // UseNavigate hook for navigation
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const { vendor } = formData;
        const vendorId = Math.floor(100000 + Math.random() * 900000);
        const createdOn = new Date().toISOString().split("T")[0];

        const finalPayload = {
            vendorId,
            name: `${vendor.firstName} ${vendor.lastName}`,
            vendorType: vendor.vendorType,
            createdOn,
            createdBy: "Admin",
            ...formData,
        };

        const existing = JSON.parse(localStorage.getItem("vendors") || "[]");
        existing.push(finalPayload);
        localStorage.setItem("vendors", JSON.stringify(existing));
        console.log("Final Payload:", finalPayload);

        navigate("/sales/vendors");
    };


    // RENDER OTHER DETAILS

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

            {/* Currency */}
            <div className="row align-items-center mb-3">
                <label className="col-sm-2 col-form-label">Openning Balance:</label>
                <div className="col-sm-6">
                    <select
                        name="otherDetails.currency"
                        value={formData.otherDetails.currency}
                        onChange={handleChange}
                        className="form-select form-select-sm border"
                        style={{ color: formData.otherDetails.currency ? "#000" : "#9b9b9b" }}
                    >
                        <option value="" disabled hidden >
                            -- Select Country --</option>
                        {currencies.map((c, i) => (
                            <option key={i} value={c}>{c}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="row align-items-center mb-3">
                <label className="col-sm-2 col-form-label">Currency:</label>
                <div className="col-sm-6">
                    <select
                        name="otherDetails.currency"
                        value={formData.otherDetails.currency}
                        onChange={handleChange}
                        className="form-select form-select-sm"
                        style={{ color: formData.otherDetails.currency ? "#000" : "#9b9b9b" }}
                    >
                        <option value="" disabled hidden >
                            -- Select Country --</option>
                        {currencies.map((c, i) => (
                            <option key={i} value={c}>{c}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="row align-items-center mb-3">
                <label className="col-sm-2 col-form-label">TDS:</label>
                <div className="col-sm-6">
                    <select
                        name="otherDetails.currency"
                        value={formData.otherDetails.currency}
                        onChange={handleChange}
                        className="form-select form-select-sm"
                        style={{ color: formData.otherDetails.currency ? "#000" : "#9b9b9b" }}
                    >
                        <option value="" disabled hidden >
                            -- Select Country --</option>
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
                        name="otherDetails.paymentTerms"
                        value={formData.otherDetails.paymentTerms}
                        onChange={handleChange}
                        className="form-select form-select-sm"
                        style={{ color: formData.otherDetails.paymentTerms ? "#000" : "#9b9b9b" }}
                    >

                        <option value="" disabled hidden >
                            -- Select Payment term --</option>
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
                        name="otherDetails.portalLanguage"
                        value={formData.otherDetails.portalLanguage}
                        onChange={handleChange}
                        className="form-select form-select-sm"
                        style={{ color: formData.otherDetails.portalLanguage ? "#000" : "#9b9b9b" }}
                    >

                        <option value="" disabled hidden >
                            -- Select Languages --</option>
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
                        name="address.attention"
                        value={formData.address.attention}
                        onChange={handleChange}
                        className="form-control form-control-sm border"
                        placeholder="Enter attention name"
                    />
                </div>
            </div>

            {/* Country */}
            <div className="row align-items-center mb-3">
                <label className="col-sm-2 col-form-label">Country / Region:</label>
                <div className="col-sm-6">
                    <select
                        name="address.country"
                        value={formData.address.country}
                        onChange={handleChange}
                        className="form-select form-select-sm"
                        style={{
                            color: formData.address.country ? "#000" : "#9b9b9b"
                        }}
                    >
                        <option value="" disabled hidden>
                            -- Select --
                        </option>

                        {countries.map((cu, i) => (
                            <option key={i} value={cu}>
                                {cu}
                            </option>
                        ))}
                    </select>
                </div>
            </div>


            {/* Address Line 1 */}
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

            {/* Address Line 2 */}
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

            {/* City */}
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

            {/* State */}
            <div className="row align-items-center mb-3">
                <label className="col-sm-2 col-form-label">State / Province:</label>
                <div className="col-sm-6">
                    <select
                        name="address.state"
                        value={formData.address.state}
                        onChange={handleChange}
                        className="form-select form-select-sm"
                        style={{
                            color: formData.address.state ? "#000" : "#9b9b9b"
                        }}
                    >
                        <option value="" disabled hidden>
                            -- Select State --
                        </option>
                        {states.map((st, i) => (
                            <option key={i} value={st}>
                                {st}
                            </option>
                        ))}
                    </select>

                </div>
            </div>

            {/* ZIP */}
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

            {/* Fax */}
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

            {/* Phone */}
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
    // ---------------------------------------------
    // 11. Render Contact Persons TAB
    // ---------------------------------------------
    const renderContactPersons = () => (
        <>
            <table className="table table-bordered table-sm align-middle table-rounded">
                <thead className="bg-light">
                    <tr>
                        <th style={{ width: "120px", color: "#5E5E5E", fontWeight: "400" }}>Salutation</th>
                        <th style={{ color: "#5E5E5E", fontWeight: "400" }}>First Name</th>
                        <th style={{ color: "#5E5E5E", fontWeight: "400" }}>Last Name</th>
                        <th style={{ color: "#5E5E5E", fontWeight: "400" }}>Email Address</th>
                        <th style={{ color: "#5E5E5E", fontWeight: "400" }}>Phone No.</th>
                        <th style={{ color: "#5E5E5E", fontWeight: "400" }}>Designation</th>
                        <th style={{ color: "#5E5E5E", fontWeight: "400" }}>Department</th>
                        <th style={{ width: "60px", color: "#5E5E5E", fontWeight: "400" }}>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {formData.contactPersons.map((person, index) => (
                        <tr key={index}>
                            <td>
                                <select
                                    name={`contacts[${index}].salutation`}
                                    className="form-select form-select-sm border-0"
                                    value={person.salutation}
                                    onChange={(e) => handleContactChange(index, "salutation", e.target.value)}
                                >
                                    <option value="" disabled hidden >Select</option>
                                    <option value="Mr.">Mr.</option>
                                    <option value="Mrs.">Mrs.</option>
                                    <option value="Ms.">Ms.</option>
                                    <option value="Dr.">Dr.</option>
                                </select>
                            </td>

                            <td>
                                <input
                                    type="text"
                                    name={`contacts[${index}].firstName`}
                                    className="form-control form-control-sm border-0"
                                    value={person.firstName}
                                    onChange={(e) => handleContactChange(index, "firstName", e.target.value)}
                                />
                            </td>

                            <td>
                                <input
                                    type="text"
                                    name={`contacts[${index}].lastName`}
                                    className="form-control form-control-sm border-0"
                                    value={person.lastName}
                                    onChange={(e) => handleContactChange(index, "lastName", e.target.value)}
                                />
                            </td>

                            <td>
                                <input
                                    type="email"
                                    name={`contacts[${index}].email`}
                                    className="form-control form-control-sm border-0"
                                    value={person.email}
                                    onChange={(e) => handleContactChange(index, "email", e.target.value)}
                                />
                            </td>

                            <td>
                                <input
                                    type="text"
                                    name={`contacts[${index}].phone`}
                                    className="form-control form-control-sm border-0"
                                    value={person.phone}
                                    onChange={(e) => handleContactChange(index, "phone", e.target.value)}
                                />
                            </td>

                            <td>
                                <input
                                    type="text"
                                    name={`contacts[${index}].designation`}
                                    className="form-control form-control-sm border-0"
                                    value={person.designation}
                                    onChange={(e) => handleContactChange(index, "designation", e.target.value)}
                                />
                            </td>

                            <td>
                                <input
                                    type="text"
                                    name={`contacts[${index}].department`}
                                    className="form-control form-control-sm border-0"
                                    value={person.department}
                                    onChange={(e) => handleContactChange(index, "department", e.target.value)}
                                />
                            </td>

                            <td className="text-center">
                                <button
                                    type='button'
                                    className="btn btn-sm border-0"
                                    onClick={() => removeContactPerson(index)}
                                    title="Remove"
                                >
                                    <X size={16} style={{ color: "red" }} />
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
                className="form-control border"
                contentEditable="true"
                value={formData.remarks}
                onChange={handleChange}
                style={{
                    resize: "none"
                }}
            />
        </>
    );

    const renderBankDetailsTab = () => (
        <>
            <div className="row align-items-center mb-3">
                <label className="col-sm-2 col-form-label">Account Holder Name:</label>
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
            <div className="row align-items-center mb-3">
                <label className="col-sm-2 col-form-label">Bank Name:</label>
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
            <div className="row align-items-center mb-3">
                <label className="col-sm-2 col-form-label">Account Number:</label>
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
            <div className="row align-items-center mb-3">
                <label className="col-sm-2 col-form-label">Re-Enter Account Number:</label>
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
            <div className="row align-items-center mb-3">
                <label className="col-sm-2 col-form-label">IFSC:</label>
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
        </>
    )




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
            case 'Bank Details':
                return renderBankDetailsTab();
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

    return (
        <>
            <Header />

            <div style={{ padding: "69px 1.8rem 0 1.8rem" }}> {/* Updated for header + breadcrumb */}
                <h1 className="h4 text-dark mb-4 pb-1">New Vendor</h1>

                <form onSubmit={handleSubmit} className="mt-4" style={{ color: "#5E5E5E" }}>

                    <div className="row mb-4">
                        {/* COLUMN 1: Primary Contact + Company Name */}
                        <div className="col-lg-4">
                            {/* Primary Contact */}
                            <div className="row mb-2 align-items-center">
                                <label className="col-sm-5 col-form-label">Primary Contact:</label>
                                <div className="col-sm-4">
                                    <select
                                        name="vendor.salutation"  // Fixed: vendor.*
                                        value={formData.vendor.salutation}
                                        onChange={handleChange}
                                        className="form-select form-select-sm border"
                                        style={{ color: formData.vendor.salutation ? "#000" : "#9b9b9b" }}
                                    >
                                        <option value="" disabled hidden>Salutation</option>
                                        {salutations.map((s, i) => (
                                            <option key={i} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Company Name */}
                            <div className="row align-items-center mb-2">
                                <label className="col-sm-5 col-form-label">Company Name:</label>
                                <div className="col-sm-7">
                                    <input
                                        type="text"
                                        name="vendor.companyName"  // Fixed: vendor.*
                                        value={formData.vendor.companyName}
                                        onChange={handleChange}
                                        className="form-control form-control-sm border"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* COLUMN 2: Display Name + Email */}
                        <div className="col-lg-4">
                            {/* Display Name */}
                            <div className="row align-items-center mb-2">
                                <label className="col-sm-4 col-form-label">Display Name:</label>
                                <div className="col-sm-7">
                                    <input
                                        type="text"
                                        name="vendor.displayName"  // Fixed: vendor.*
                                        value={formData.vendor.displayName}
                                        onChange={handleChange}
                                        className="form-control form-control-sm border"
                                    />
                                </div>
                            </div>

                            {/* Email Address */}
                            <div className="row align-items-center mb-2">
                                <label className="col-sm-4 col-form-label">Email Address:</label>
                                <div className="col-sm-7">
                                    <input
                                        type="email"
                                        name="vendor.emailAddress"  // Fixed: vendor.*
                                        value={formData.vendor.emailAddress}
                                        onChange={handleChange}
                                        className="form-control form-control-sm border"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* COLUMN 3: Phone (country code + number) */}
                        <div className="col-lg-4">
                            <div className="row align-items-center mb-2">
                                <label className="col-sm-2 col-form-label">Phone:</label>
                                <div className="col-sm-8">
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <input
                                                type="number"
                                                name="vendor.countryCode"  // Fixed: vendor.*
                                                placeholder="+91"
                                                className="form-control form-control-sm border"
                                                value={formData.vendor.countryCode}
                                                onChange={handleChange}
                                                pattern="[0-9]*"
                                            />
                                        </div>
                                        <div className="col-sm-8">
                                            <input
                                                type="text"
                                                name="vendor.phoneNumber"  // Fixed: vendor.phoneNumber (not phone)
                                                className="form-control form-control-sm border"
                                                value={formData.vendor.phoneNumber}
                                                onChange={handleChange}
                                                inputMode="numeric"
                                                pattern="[0-9]*"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>



                    {/* ————— TABS ————— (unchanged) */}
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

                    {/* TAB CONTENT (unchanged) */}
                    <div className="pt-4">{renderTabContent()}</div>

                    {/* Submit Buttons (unchanged) */}
                    <div className="d-flex justify-content-center mt-4 pt-4 border-top">
                        <button
                            type="button"
                            className="btn border me-3 px-4"
                            onClick={() => navigate(-1)}
                        >
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

export default AddVendor;
