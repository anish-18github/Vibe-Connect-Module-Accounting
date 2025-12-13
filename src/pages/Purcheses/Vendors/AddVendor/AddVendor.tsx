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
        openingBalance: string;  // ✅ Add this
        currency: string;
        tds: string;             // ✅ Add this
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
    bankDetails: {
        accountHolderName: string;
        bankName: string;
        accountNumber: string;
        confirmAccountNumber: string;
        ifsc: string;
    };
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
            openingBalance: "",
            currency: "",
            tds: "",
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
        bankDetails: {
            accountHolderName: "",
            bankName: "",
            accountNumber: "",
            confirmAccountNumber: "",
            ifsc: "",
        },
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
        <div className="mx-5">
            <div className="row g-3 three-column-form">
                {/* COLUMN 1: 2 fields */}
                <div className="col-lg-4">
                    <div className="so-form-group mb-4">
                        <label className="so-label text-sm text-muted-foreground fw-bold">
                            PAN:
                        </label>
                        <input
                            type="text"
                            name="otherDetails.pan"
                            className="form-control so-control"
                            value={formData.otherDetails.pan}
                            onChange={handleChange}
                            placeholder="Enter PAN number"
                        />
                    </div>

                    <div className="so-form-group mb-4">
                        <label className="so-label text-sm text-muted-foreground fw-bold">
                            Opening Balance:
                        </label>
                        <input
                            type="number"
                            name="otherDetails.openingBalance"
                            className="form-control so-control"
                            value={formData.otherDetails.openingBalance || ""}
                            onChange={handleChange}
                        />

                    </div>
                </div>

                {/* COLUMN 2: 2 fields */}
                <div className="col-lg-4">
                    <div className="so-form-group mb-4">
                        <label className="so-label text-sm text-muted-foreground fw-bold">
                            Currency:
                        </label>
                        <select
                            name="otherDetails.currency"
                            className="form-select so-control"
                            value={formData.otherDetails.currency}
                            onChange={handleChange}
                            style={{ color: formData.otherDetails.currency ? "#000" : "#9b9b9b" }}
                        >
                            <option value="">Select Currency</option>
                            {currencies.map((c, i) => (
                                <option key={i} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                    <div className="so-form-group mb-4">
                        <label className="so-label text-sm text-muted-foreground fw-bold">
                            TDS:
                        </label>
                        <select
                            name="otherDetails.tds"
                            className="form-select so-control"
                            value={formData.otherDetails.tds}
                            onChange={handleChange}
                            style={{ color: formData.otherDetails.tds ? "#000" : "#9b9b9b" }}
                        >
                            <option value="">Select TDS</option>
                            <option value="1%">1%</option>
                            <option value="2%">2%</option>
                            <option value="5%">5%</option>
                            <option value="10%">10%</option>
                        </select>
                    </div>
                </div>

                {/* COLUMN 3: 2 fields */}
                <div className="col-lg-4">
                    <div className="so-form-group mb-4">
                        <label className="so-label text-sm text-muted-foreground fw-bold">
                            Payment Terms:
                        </label>
                        <select
                            name="otherDetails.paymentTerms"
                            className="form-select so-control"
                            value={formData.otherDetails.paymentTerms}
                            onChange={handleChange}
                            style={{ color: formData.otherDetails.paymentTerms ? "#000" : "#9b9b9b" }}
                        >
                            <option value="">Select Payment Terms</option>
                            {paymentTerms.map((p, i) => (
                                <option key={i} value={p}>{p}</option>
                            ))}
                        </select>
                    </div>

                    <div className="so-form-group mb-4">
                        <label className="so-label text-sm text-muted-foreground fw-bold">
                            Portal Language:
                        </label>
                        <select
                            name="otherDetails.portalLanguage"
                            className="form-select so-control"
                            value={formData.otherDetails.portalLanguage}
                            onChange={handleChange}
                            style={{ color: formData.otherDetails.portalLanguage ? "#000" : "#9b9b9b" }}
                        >
                            <option value="">Select Language</option>
                            {languages.map((l, i) => (
                                <option key={i} value={l}>{l}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Documents Upload - Full width */}
            <div className="row mb-4 mt-4 align-items-start">
                <label className="so-label text-sm text-muted-foreground fw-bold mb-2">
                    Documents:
                </label>
                <div className="col-12">
                    <div
                        className="doc-upload-box"
                        onClick={() => document.getElementById("fileUploadInput")?.click()}
                    >
                        <FeatherUpload size={28} className="text-muted mb-2" />
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



    // ---------------------------------------------
    // 10. Render Address TAB
    // ---------------------------------------------
    const renderAddressTab = () => (
        <div className="mx-5">
            <div className="row g-3 three-column-form">
                {/* COLUMN 1: 3 fields */}
                <div className="col-lg-4">
                    <div className="so-form-group mb-4">
                        <label className="so-label text-sm text-muted-foreground fw-bold">
                            Attention:
                        </label>
                        <input
                            type="text"
                            name="address.attention"
                            className="form-control so-control"
                            value={formData.address.attention}
                            onChange={handleChange}
                            placeholder="Enter attention name"
                        />
                    </div>

                    <div className="so-form-group mb-4">
                        <label className="so-label text-sm text-muted-foreground fw-bold">
                            Country / Region:
                        </label>
                        <select
                            name="address.country"
                            className="form-select so-control"
                            value={formData.address.country}
                            onChange={handleChange}
                            style={{ color: formData.address.country ? "#000" : "#9b9b9b" }}
                        >
                            <option value="">Select Country</option>
                            {countries.map((cu, i) => (
                                <option key={i} value={cu}>{cu}</option>
                            ))}
                        </select>
                    </div>

                    <div className="so-form-group mb-4">
                        <label className="so-label text-sm text-muted-foreground fw-bold">
                            Address Line 1:
                        </label>
                        <input
                            type="text"
                            name="address.address1"
                            className="form-control so-control"
                            value={formData.address.address1}
                            onChange={handleChange}
                            placeholder="Enter address line 1"
                        />
                    </div>
                </div>

                {/* COLUMN 2: 3 fields */}
                <div className="col-lg-4">
                    <div className="so-form-group mb-4">
                        <label className="so-label text-sm text-muted-foreground fw-bold">
                            Address Line 2:
                        </label>
                        <input
                            type="text"
                            name="address.address2"
                            className="form-control so-control"
                            value={formData.address.address2}
                            onChange={handleChange}
                            placeholder="Enter address line 2"
                        />
                    </div>

                    <div className="so-form-group mb-4">
                        <label className="so-label text-sm text-muted-foreground fw-bold">
                            City:
                        </label>
                        <input
                            type="text"
                            name="address.city"
                            className="form-control so-control"
                            value={formData.address.city}
                            onChange={handleChange}
                            placeholder="Enter city"
                        />
                    </div>

                    <div className="so-form-group mb-4">
                        <label className="so-label text-sm text-muted-foreground fw-bold">
                            State / Province:
                        </label>
                        <select
                            name="address.state"
                            className="form-select so-control"
                            value={formData.address.state}
                            onChange={handleChange}
                            style={{ color: formData.address.state ? "#000" : "#9b9b9b" }}
                        >
                            <option value="">Select State</option>
                            {states.map((st, i) => (
                                <option key={i} value={st}>{st}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* COLUMN 3: 3 fields */}
                <div className="col-lg-4">
                    <div className="so-form-group mb-4">
                        <label className="so-label text-sm text-muted-foreground fw-bold">
                            ZIP / Postal Code:
                        </label>
                        <input
                            type="text"
                            name="address.zip"
                            className="form-control so-control"
                            value={formData.address.zip}
                            onChange={handleChange}
                            placeholder="Enter ZIP / Postal Code"
                        />
                    </div>

                    <div className="so-form-group mb-4">
                        <label className="so-label text-sm text-muted-foreground fw-bold">
                            Fax:
                        </label>
                        <input
                            type="text"
                            name="address.fax"
                            className="form-control so-control"
                            value={formData.address.fax}
                            onChange={handleChange}
                            placeholder="Enter fax number"
                        />
                    </div>

                    <div className="so-form-group mb-4">
                        <label className="so-label text-sm text-muted-foreground fw-bold">
                            Phone:
                        </label>
                        <div className="row g-2">
                            <div className="col-2">
                                <input
                                    type="text"
                                    name="address.countryCode"
                                    className="form-control so-control"
                                    placeholder="+91"
                                    value={formData.address.countryCode}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-10">
                                <input
                                    type="text"
                                    name="address.phoneNumber"
                                    className="form-control so-control"
                                    value={formData.address.phoneNumber}
                                    onChange={handleChange}
                                    placeholder="Phone number"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // ---------------------------------------------
    // 11. Render Contact Persons TAB
    // ---------------------------------------------
    const renderContactPersons = () => (
        <div className="mx-5">
            <div className="item-card mb-4">
                <div className="item-card-header">
                    <span className="item-card-title">Contact Persons</span>
                </div>
                <div className="item-card-body">
                    <div className="table-responsive">
                        <table className="table table-sm align-middle item-table-inner">
                            <thead>
                                <tr>
                                    <th style={{ width: "120px" }} className="fw-medium text-dark">Salutation</th>
                                    <th className="fw-medium text-dark">First Name</th>
                                    <th className="fw-medium text-dark">Last Name</th>
                                    <th className="fw-medium text-dark">Email</th>
                                    <th className="fw-medium text-dark">Phone</th>
                                    <th className="fw-medium text-dark">Designation</th>
                                    <th className="fw-medium text-dark">Department</th>
                                    <th style={{ width: "60px" }} className="fw-medium text-dark">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {formData.contactPersons.map((person, index) => (
                                    <tr key={index}>
                                        <td>
                                            <select
                                                name={`contacts[${index}].salutation`}
                                                className="form-select form-select-sm border-0 item-input"
                                                value={person.salutation}
                                                onChange={(e) => handleContactChange(index, "salutation", e.target.value)}
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
                                                type="text"
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
                                                type="button"
                                                className="btn btn-sm p-1"
                                                onClick={() => removeContactPerson(index)}
                                                title="Remove"
                                            >
                                                <X size={16} className="text-danger" />
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

    // ---------------------------------------------
    // 12. Render Contact Persons TAB
    // ---------------------------------------------

    const renderBankDetailsTab = () => (
        <div className="mx-5">
            <div className="row g-3 three-column-form">
                {/* COLUMN 1: 2 fields */}
                <div className="col-lg-4">
                    <div className="so-form-group mb-4">
                        <label className="so-label text-sm text-muted-foreground fw-bold">
                            Account Holder Name:
                        </label>
                        <input
                            type="text"
                            name="bankDetails.accountHolderName"
                            className="form-control so-control"
                            value={formData.bankDetails.accountHolderName || ""}
                            onChange={handleChange}
                            placeholder="Enter account holder name"
                        />
                    </div>

                    <div className="so-form-group mb-4">
                        <label className="so-label text-sm text-muted-foreground fw-bold">
                            Bank Name:
                        </label>
                        <input
                            type="text"
                            name="bankDetails.bankName"
                            className="form-control so-control"
                            value={formData.bankDetails.bankName || ""}
                            onChange={handleChange}
                            placeholder="Enter bank name"
                        />
                    </div>
                </div>

                {/* COLUMN 2: 2 fields */}
                <div className="col-lg-4">
                    <div className="so-form-group mb-4">
                        <label className="so-label text-sm text-muted-foreground fw-bold">
                            Account Number:
                        </label>
                        <input
                            type="text"
                            name="bankDetails.accountNumber"
                            className="form-control so-control"
                            value={formData.bankDetails.accountNumber || ""}
                            onChange={handleChange}
                            placeholder="Enter account number"
                        />
                    </div>

                    <div className="so-form-group mb-4">
                        <label className="so-label text-sm text-muted-foreground fw-bold">
                            Re-Enter Account Number:
                        </label>
                        <input
                            type="text"
                            name="bankDetails.confirmAccountNumber"
                            className="form-control so-control"
                            value={formData.bankDetails.confirmAccountNumber || ""}
                            onChange={handleChange}
                            placeholder="Re-enter account number"
                        />
                    </div>
                </div>

                {/* COLUMN 3: 1 field */}
                <div className="col-lg-4">
                    <div className="so-form-group mb-4">
                        <label className="so-label text-sm text-muted-foreground fw-bold">
                            IFSC:
                        </label>
                        <input
                            type="text"
                            name="bankDetails.ifsc"
                            className="form-control so-control"
                            value={formData.bankDetails.ifsc || ""}
                            onChange={handleChange}
                            placeholder="Enter IFSC code"
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    const renderRemarks = () => (
        <div className="mx-5">
            <div className="so-form-group mb-4">
                <label className="so-label text-sm text-muted-foreground fw-bold">
                    Remarks <span className="text-muted small">(For Internal Use)</span>
                </label>
                <textarea
                    name="remarks"
                    className="form-control so-control textarea"
                    rows={4}
                    value={formData.remarks || ""}
                    onChange={handleChange}
                    placeholder="Enter remarks for internal use..."
                    style={{ resize: "none" }}
                />
            </div>
        </div>
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

            <div className="sales-orders-page">
                <form onSubmit={handleSubmit} className="sales-order-form">
                    {/* TOP DETAILS CARD */}
                    <div className="so-details-card mx-5 mb-4">
                        <h1 className="sales-order-title mb-4">New Vendor</h1>

                        <div className="row g-3 three-column-form">
                            {/* COLUMN 1: 2 fields */}
                            <div className="col-lg-4">
                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Primary Contact:
                                    </label>
                                    <select
                                        name="vendor.salutation"
                                        className="form-select so-control"
                                        value={formData.vendor.salutation}
                                        onChange={handleChange}
                                        style={{ color: formData.vendor.salutation ? "#000" : "#9b9b9b" }}
                                    >
                                        <option value="">Select Salutation</option>
                                        {salutations.map((s, i) => (
                                            <option key={i} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Company Name:
                                    </label>
                                    <input
                                        type="text"
                                        name="vendor.companyName"
                                        className="form-control so-control"
                                        value={formData.vendor.companyName}
                                        onChange={handleChange}
                                        placeholder="Enter company name"
                                    />
                                </div>
                            </div>

                            {/* COLUMN 2: 2 fields */}
                            <div className="col-lg-4">
                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Display Name:
                                    </label>
                                    <input
                                        type="text"
                                        name="vendor.displayName"
                                        className="form-control so-control"
                                        value={formData.vendor.displayName}
                                        onChange={handleChange}
                                        placeholder="Enter display name"
                                    />
                                </div>

                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Email Address:
                                    </label>
                                    <input
                                        type="email"
                                        name="vendor.emailAddress"
                                        className="form-control so-control"
                                        value={formData.vendor.emailAddress}
                                        onChange={handleChange}
                                        placeholder="vendor@example.com"
                                    />
                                </div>
                            </div>

                            {/* COLUMN 3: 1 field (Phone with country code) */}
                            <div className="col-lg-4">
                                <div className="so-form-group mb-4">
                                    <label className="so-label text-sm text-muted-foreground fw-bold">
                                        Phone:
                                    </label>
                                    <div className="row g-2">
                                        <div className="col-2">
                                            <input
                                                type="tel"
                                                name="vendor.countryCode"
                                                className="form-control so-control"
                                                placeholder="+91"
                                                value={formData.vendor.countryCode}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="col-9">
                                            <input
                                                type="tel"
                                                name="vendor.phoneNumber"
                                                className="form-control so-control"
                                                value={formData.vendor.phoneNumber}
                                                onChange={handleChange}
                                                placeholder="Phone number"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* OUTSIDE CARD - TABS + CONTENT */}
                    <div className="mx-5">
                        {/* TABS */}
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
                                style={{ background: "#7991BB", color: "#FFF" }}
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

export default AddVendor;
