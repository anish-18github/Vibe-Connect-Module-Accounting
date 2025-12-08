import React, { useState } from "react";
import { Check, X } from "react-feather";
import { useNavigate } from "react-router-dom";
import Header from "../../../../components/Header/Header";

type BudgetPeriod = "monthly" | "quarterly" | "half-yearly" | "yearly";

interface BudgetForm {
    name: string;
    fiscalYear: string;
    period: BudgetPeriod | "";
    incomeAccount: string;
    expenseAccount: string;
    assetAccount: string;
    liabilityAccount: string;
    equityAccount: string;
}

interface AssetOption {
    label: string;
    value: string;
}

interface AssetGroup {
    key: string;
    label: string;
    children?: AssetGroup[];
    items?: AssetOption[];
}

interface LiabilityOption {
    label: string;
    value: string;
}

interface LiabilityGroup {
    key: string;
    label: string;
    items?: LiabilityOption[];
    children?: LiabilityGroup[]; // for future nesting if needed
}

const incomeOptions: string[] = [
    "Discount",
    "General Income",
    "Interest Income",
    "Late Fee Income",
    "Other Charges",
    "Sales",
    "Shipping Charge",
];

const expenseOptions: string[] = [
    "Advertising And Marketing",
    "Automobile Expense",
    "Bad Debt",
    "Bank Fees and Charges",
];

const costOfGoodsSoldOptions: string[] = [
    "Job Costing",
    "Labour",
    "Materials",
    "Subcontractor",
];

const equityOptions: string[] = [
    "Capital Stock",
    "Current Year Earnings",
    "Distributions",
    "Dividends Paid",
    "Drawings",
    "Investments",
    "Opening Balance Offset",
    "Owner's Equity",
    "Retained Earnings",
];


export default function AddBudget() {

    const navigate = useNavigate();

    const [form, setForm] = useState<BudgetForm>({
        name: "",
        fiscalYear: "",
        period: "",
        incomeAccount: "",
        expenseAccount: "",
        assetAccount: "",
        liabilityAccount: "",
        equityAccount: "",
    });

    // Main form states
    const [showAle, setShowAle] = useState(false);

    // Separate modals for income and expense
    const [showIncomeModal, setShowIncomeModal] = useState(false);
    const [showExpenseModal, setShowExpenseModal] = useState(false);

    // Income modal states
    const [showIncomeGroup, setShowIncomeGroup] = useState(true);
    const [showOtherIncomeGroup, setShowOtherIncomeGroup] = useState(false);
    const [selectedIncomeOptions, setSelectedIncomeOptions] = useState<string[]>([]);

    // Expense modal states
    const [showExpenseGroup, setShowExpenseGroup] = useState(true);
    const [showOtherExpenseGroup, setShowOtherExpenseGroup] = useState(false);
    const [selectedExpenseOptions, setSelectedExpenseOptions] = useState<string[]>([]);

    // Asset modal
    const [showAssetModal, setShowAssetModal] = useState(false);
    const [expandedAssetGroups, setExpandedAssetGroups] = useState<string[]>([]);
    const [selectedAssetOptions, setSelectedAssetOptions] = useState<string[]>([]);

    // Liability modal
    const [showLiabilityModal, setShowLiabilityModal] = useState(false);
    const [expandedLiabilityGroups, setExpandedLiabilityGroups] = useState<string[]>([]);
    const [selectedLiabilityOptions, setSelectedLiabilityOptions] = useState<string[]>([]);

    // Equity modal
    const [showEquityModal, setShowEquityModal] = useState(false);
    const [selectedEquityOptions, setSelectedEquityOptions] = useState<string[]>([]);
    const [showEquityGroup, setShowEquityGroup] = useState(true);





    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Budget form:", form);

        try {
            // Replace with your actual API call
            // const response = await fetch('/api/budgets', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(form)
            // });

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // inside handleSubmit, just before navigate(...)
            const incomeAccounts = form.incomeAccount
                ? form.incomeAccount.split(",").map(s => s.trim()).filter(Boolean)
                : [];

            const expenseAccounts = form.expenseAccount
                ? form.expenseAccount.split(",").map(s => s.trim()).filter(Boolean)
                : [];

            const assetAccounts = form.assetAccount
                ? form.assetAccount.split(",").map(s => s.trim()).filter(Boolean)
                : [];
            const liabilityAccounts = form.liabilityAccount
                ? form.liabilityAccount.split(",").map(s => s.trim()).filter(Boolean)
                : [];
            const equityAccounts = form.equityAccount
                ? form.equityAccount.split(",").map(s => s.trim()).filter(Boolean)
                : [];

            navigate("/accountant/calculate-budget", {
                state: {
                    name: form.name,
                    fiscalYear: form.fiscalYear,
                    period: form.period,
                    incomeAccounts,
                    expenseAccounts,
                    assetAccounts,     
                    liabilityAccounts,   
                    equityAccounts,
                },
            });


            // alert("Budget created successfully!");
            // navigate("/accountant/calculate-budget");
        } catch (error) {
            console.error("Failed to create budget:", error);
            alert("Failed to create budget. Please try again.");
        }
    };


    // INCOME MODAL FUNCTIONS
    const toggleIncomeSelection = (name: string) => {
        setSelectedIncomeOptions((prev) =>
            prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
        );
    };

    const applyIncomeSelection = () => {
        setForm((prev) => ({
            ...prev,
            incomeAccount: selectedIncomeOptions.join(", "),
        }));
    };

    const closeIncomeModal = () => {
        applyIncomeSelection();
        setShowIncomeModal(false);
    };

    // EXPENSE MODAL FUNCTIONS
    const toggleExpenseSelection = (name: string) => {
        setSelectedExpenseOptions((prev) =>
            prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
        );
    };

    const applyExpenseSelection = () => {
        setForm((prev) => ({
            ...prev,
            expenseAccount: selectedExpenseOptions.join(", "),
        }));
    };

    const closeExpenseModal = () => {
        applyExpenseSelection();
        setShowExpenseModal(false);
    };

    // ASSET TREE

    const assetTree: AssetGroup[] = [
        {
            key: "current-assets",
            label: "Current Assets",
            children: [
                {
                    key: "accounts-receivable",
                    label: "Accounts Receivable",
                    items: [
                        { label: "Accounts Receivable", value: "Accounts Receivable" },
                    ],
                },
                {
                    key: "other-current-assets",
                    label: "Other Current Assets",
                    items: [
                        { label: "Advance Tax", value: "Advance Tax" },
                        { label: "Employee Advance", value: "Employee Advance" },
                        { label: "Inventory Asset", value: "Inventory Asset" },
                        { label: "Prepaid Expenses", value: "Prepaid Expenses" },
                        { label: "TCS Receivable", value: "TCS Receivable" },
                        { label: "TDS Receivable", value: "TDS Receivable" },
                    ],
                },
            ],
        },
        {
            key: "cash-equivalent",
            label: "Cash and Cash Equivalent",
            items: [
                { label: "Petty Cash", value: "Petty Cash" },
                { label: "Undeposited Funds", value: "Undeposited Funds" },
            ],
        },
        {
            key: "other-assets",
            label: "Other Assets",
            // no items yet
        },
        {
            key: "fixed-assets",
            label: "Fixed Assets",
            items: [
                { label: "Furniture and Equipment", value: "Furniture and Equipment" },
            ],
        },
    ];

    const toggleAssetGroup = (key: string) => {
        setExpandedAssetGroups(prev =>
            prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
        );
    };

    const toggleAssetSelection = (value: string) => {
        setSelectedAssetOptions(prev =>
            prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
        );
    };

    const applyAssetSelection = () => {
        setForm(prev => ({
            ...prev,
            assetAccount: selectedAssetOptions.join(", "),
        }));
    };

    const closeAssetModal = () => {
        applyAssetSelection();
        setShowAssetModal(false);
    };

    // LIABILITY TREE
    const liabilityTree: LiabilityGroup[] = [
        {
            key: "current-liabilities",
            label: "Current Liabilities",
            items: [
                { label: "Accounts Payable", value: "Accounts Payable" },
                { label: "Employee Reimbursements", value: "Employee Reimbursements" },
                {
                    label: "Opening Balance Adjustments",
                    value: "Opening Balance Adjustments",
                },
                { label: "Tax Payable", value: "Tax Payable" },
                { label: "TCS Payable", value: "TCS Payable" },
                { label: "TDS Payable", value: "TDS Payable" },
                { label: "Unearned Revenue", value: "Unearned Revenue" },
            ],
        },
        {
            key: "long-term-liabilities",
            label: "Long Term Liabilities",
            items: [
                { label: "Construction Loans", value: "Construction Loans" },
                { label: "Mortgages", value: "Mortgages" },
            ],
        },
        {
            key: "other-liabilities",
            label: "Other Liabilities",
            // no items yet
        },
    ];

    const toggleLiabilityGroup = (key: string) => {
        setExpandedLiabilityGroups(prev =>
            prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
        );
    };

    const toggleLiabilitySelection = (value: string) => {
        setSelectedLiabilityOptions(prev =>
            prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
        );
    };

    const applyLiabilitySelection = () => {
        setForm(prev => ({
            ...prev,
            liabilityAccount: selectedLiabilityOptions.join(", "),
        }));
    };

    const closeLiabilityModal = () => {
        applyLiabilitySelection();
        setShowLiabilityModal(false);
    };

    // EQUITY Toggle + apply functions

    const toggleEquitySelection = (name: string) => {
        setSelectedEquityOptions(prev =>
            prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
        );
    };

    const applyEquitySelection = () => {
        setForm(prev => ({
            ...prev,
            equityAccount: selectedEquityOptions.join(", "),
        }));
    };

    const closeEquityModal = () => {
        applyEquitySelection();
        setShowEquityModal(false);
    };



    return (
        <>
            <Header />

            <div style={{ padding: "0 1.8rem" }}>
                <h1 className="h4 text-dark mb-4 pb-1">New Budget</h1>

                <form onSubmit={handleSubmit} className="mt-4" style={{ color: "#5E5E5E" }}>
                    {/* Name */}
                    <div className="row align-items-center mb-3">
                        <label className="col-sm-2 col-form-label">
                            Name:<span className="text-danger"> *</span>
                        </label>
                        <div className="col-sm-4">
                            <input
                                type="text"
                                name="name"
                                className="form-control form-control-sm border"
                                value={form.name}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Fiscal Year */}
                    <div className="row align-items-center mb-3">
                        <label className="col-sm-2 col-form-label">Fiscal Year:</label>
                        <div className="col-sm-4">
                            <select
                                name="fiscalYear"
                                className="form-select form-control-sm border"
                                value={form.fiscalYear}
                                onChange={handleChange}
                                style={{ color: form.fiscalYear ? "#000000" : "#9b9b9b" }}
                            >
                                <option value="" disabled>
                                    -- Select Fiscal Year --
                                </option>
                                <option value="2024-2025">2024-2025</option>
                                <option value="2025-2026">2025-2026</option>
                                <option value="2026-2027">2026-2027</option>
                            </select>
                        </div>
                    </div>

                    {/* Budget Period */}
                    <div className="row align-items-center mb-3">
                        <label className="col-sm-2 col-form-label">Budget Period:</label>
                        <div className="col-sm-4">
                            <select
                                name="period"
                                className="form-select form-control-sm border"
                                value={form.period}
                                onChange={handleChange}
                                style={{ color: form.period ? "#000000" : "#9b9b9b" }}
                            >
                                <option value="" disabled>
                                    -- Select Budget Period --
                                </option>
                                <option value="monthly">Monthly</option>
                                <option value="quarterly">Quarterly</option>
                                <option value="half-yearly">Half-yearly</option>
                                <option value="yearly">Yearly</option>
                            </select>
                        </div>
                    </div>

                    {/* Section title */}
                    <div className="row mb-2">
                        <div className="col-sm-8 offset-sm-0" style={{ color: "#757575" }}>
                            <h4>Income And Expense Accounts</h4>
                        </div>
                    </div>

                    {/* Income Account */}
                    <div className="row align-items-center mb-3">
                        <label className="col-sm-2 col-form-label">Income Account:</label>
                        <div className="col-sm-4">
                            <input
                                type="text"
                                name="incomeAccount"
                                className="form-control form-control-sm border"
                                value={form.incomeAccount}
                                readOnly
                                onClick={() => {
                                    setSelectedIncomeOptions([]);
                                    setShowIncomeModal(true);
                                }}
                            />
                        </div>
                    </div>

                    {/* Expense Accounts */}
                    <div className="row align-items-center mb-3">
                        <label className="col-sm-2 col-form-label">Expense Accounts:</label>
                        <div className="col-sm-4">
                            <input
                                type="text"
                                name="expenseAccount"
                                className="form-control form-control-sm border"
                                value={form.expenseAccount}
                                readOnly
                                onClick={() => {
                                    setSelectedExpenseOptions([]);
                                    setShowExpenseModal(true);
                                }}
                            />
                        </div>
                    </div>

                    {/* + Include Asset, Liability, Equity */}
                    <div className="row align-items-center mb-3">
                        <div className="col-sm-8">
                            <button
                                type="button"
                                className="btn btn-link p-0 d-flex align-items-center"
                                onClick={() => setShowAle((prev) => !prev)}
                                style={{ textDecoration: "none", color: "#5E5E5E" }}
                            >
                                <span
                                    className="d-inline-flex align-items-center justify-content-center me-2"
                                    style={{
                                        width: 16,
                                        height: 16,
                                        borderRadius: 2,
                                        border: "1px solid #4a7cc2",
                                        fontSize: 12,
                                        lineHeight: 1,
                                    }}
                                >
                                    {showAle ? "−" : "+"}
                                </span>
                                Include Asset, Liability, and Equity Account in Budget
                            </button>
                        </div>
                    </div>

                    {/* Extra fields appear when plus is clicked */}
                    {showAle && (
                        <>
                            <div className="row align-items-center mb-3">
                                <label className="col-sm-2 col-form-label">Asset Accounts:</label>
                                <div className="col-sm-4">
                                    <input
                                        type="text"
                                        name="assetAccount"
                                        className="form-control form-control-sm border"
                                        value={form.assetAccount}
                                        readOnly
                                        onClick={() => {
                                            setSelectedAssetOptions(
                                                form.assetAccount
                                                    ? form.assetAccount.split(",").map(s => s.trim()).filter(Boolean)
                                                    : []
                                            );
                                            setShowAssetModal(true);
                                        }}
                                    />

                                </div>
                            </div>

                            <div className="row align-items-center mb-3">
                                <label className="col-sm-2 col-form-label">Liability Accounts:</label>
                                <div className="col-sm-4">
                                    <input
                                        type="text"
                                        name="liabilityAccount"
                                        className="form-control form-control-sm border"
                                        value={form.liabilityAccount}
                                        readOnly
                                        onClick={() => {
                                            setSelectedLiabilityOptions(
                                                form.liabilityAccount
                                                    ? form.liabilityAccount.split(",").map(s => s.trim()).filter(Boolean)
                                                    : []
                                            );
                                            setShowLiabilityModal(true);
                                        }}
                                    />

                                </div>
                            </div>

                            <div className="row align-items-center mb-4">
                                <label className="col-sm-2 col-form-label">Equity Accounts:</label>
                                <div className="col-sm-4">
                                    <input
                                        type="text"
                                        name="equityAccount"
                                        className="form-control form-control-sm border"
                                        value={form.equityAccount}
                                        readOnly
                                        onClick={() => {
                                            setSelectedEquityOptions(
                                                form.equityAccount
                                                    ? form.equityAccount.split(",").map(s => s.trim()).filter(Boolean)
                                                    : []
                                            );
                                            setShowEquityModal(true);
                                        }}
                                    />

                                </div>
                            </div>
                        </>
                    )}

                    {/* Buttons */}
                    <div className="d-flex justify-content-center mt-4 pt-4 border-top">
                        <button
                            type="submit"
                            className="btn px-4 me-3"
                            style={{ background: "#7991BB", color: "#FFF" }}
                        >
                            Create Budget
                        </button>
                        <button type="button" className="btn border px-4">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>

            {/* INCOME MODAL - Only Income categories */}
            {showIncomeModal && (
                <div
                    className="d-flex align-items-center justify-content-center"
                    style={{
                        position: "fixed",
                        inset: 0,
                        backgroundColor: "rgba(0,0,0,0.35)",
                        zIndex: 1050,
                    }}
                >
                    <div
                        className="bg-white"
                        style={{
                            width: "520px",
                            maxWidth: "90%",
                            borderRadius: "6px",
                            boxShadow: "0 4px 18px rgba(0,0,0,0.15)",
                        }}
                    >
                        {/* Header */}
                        <div
                            className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom"
                            style={{ backgroundColor: "#f5f5f5" }}
                        >
                            <h6 className="mb-0">Select Income Accounts</h6>
                            <button
                                type="button"
                                className="btn btn-sm border-0 text-danger"
                                onClick={closeIncomeModal}
                            >
                                <X />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-3" style={{ fontSize: "0.9rem", color: "#5E5E5E" }}>
                            {/* Search bar */}
                            <div className="mb-3">
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    placeholder="Search account"
                                />
                            </div>

                            {/* Income group */}
                            <div className="mb-2">
                                <button
                                    type="button"
                                    className="btn btn-link p-0 d-flex align-items-center w-100 text-start"
                                    onClick={() => setShowIncomeGroup((prev) => !prev)}
                                    style={{ textDecoration: "none", color: "#5E5E5E" }}
                                >
                                    <span
                                        className="d-inline-flex align-items-center justify-content-center me-2"
                                        style={{
                                            width: 16,
                                            height: 16,
                                            borderRadius: 2,
                                            border: "1px solid #4a7cc2",
                                            fontSize: 12,
                                            lineHeight: 1,
                                        }}
                                    >
                                        {showIncomeGroup ? "−" : "+"}
                                    </span>
                                    <strong>Income</strong>
                                </button>
                                {showIncomeGroup && (
                                    <ul className="list-unstyled ms-4 mt-2 mb-2">
                                        {incomeOptions.map((name: string) => {
                                            const isSelected = selectedIncomeOptions.includes(name);
                                            return (
                                                <li key={name} className="mb-1">
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm w-100 d-flex align-items-center text-start"
                                                        style={{
                                                            border: "none",
                                                            backgroundColor: "#fff",
                                                            fontSize: "0.85rem",
                                                        }}
                                                        onClick={() => toggleIncomeSelection(name)}
                                                    >
                                                        <span>{name}</span>
                                                        {isSelected && (
                                                            <Check
                                                                size={14}
                                                                color="#4a7cc2"
                                                                style={{ marginLeft: 6 }}
                                                            />
                                                        )}
                                                    </button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </div>

                            {/* Other Income group */}
                            <div className="mb-2">
                                <button
                                    type="button"
                                    className="btn btn-link p-0 d-flex align-items-center w-100 text-start"
                                    onClick={() => setShowOtherIncomeGroup((prev) => !prev)}
                                    style={{ textDecoration: "none", color: "#5E5E5E" }}
                                >
                                    <span
                                        className="d-inline-flex align-items-center justify-content-center me-2"
                                        style={{
                                            width: 16,
                                            height: 16,
                                            borderRadius: 2,
                                            border: "1px solid #4a7cc2",
                                            fontSize: 12,
                                            lineHeight: 1,
                                        }}
                                    >
                                        {showOtherIncomeGroup ? "−" : "+"}
                                    </span>
                                    <strong>Other Income</strong>
                                </button>
                                {showOtherIncomeGroup && (
                                    <ul className="list-unstyled ms-4 mt-2 mb-0">
                                        {incomeOptions.map((name: string) => {
                                            const isSelected = selectedIncomeOptions.includes(name);
                                            return (
                                                <li key={name} className="mb-1">
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm w-100 d-flex align-items-center text-start"
                                                        style={{
                                                            border: "none",
                                                            backgroundColor: "#fff",
                                                            fontSize: "0.85rem",
                                                        }}
                                                        onClick={() => toggleIncomeSelection(name)}
                                                    >
                                                        <span>{name}</span>
                                                        {isSelected && (
                                                            <Check
                                                                size={14}
                                                                color="#4a7cc2"
                                                                style={{ marginLeft: 6 }}
                                                            />
                                                        )}
                                                    </button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="d-flex justify-content-end px-3 py-2 border-top">
                            <button
                                type="button"
                                className="btn btn-sm border px-3"
                                onClick={closeIncomeModal}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* EXPENSE MODAL - Only Expense categories */}
            {showExpenseModal && (
                <div
                    className="d-flex align-items-center justify-content-center"
                    style={{
                        position: "fixed",
                        inset: 0,
                        backgroundColor: "rgba(0,0,0,0.35)",
                        zIndex: 1050,
                    }}
                >
                    <div
                        className="bg-white"
                        style={{
                            width: "520px",
                            maxWidth: "90%",
                            borderRadius: "6px",
                            boxShadow: "0 4px 18px rgba(0,0,0,0.15)",
                        }}
                    >
                        {/* Header */}
                        <div
                            className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom"
                            style={{ backgroundColor: "#f5f5f5" }}
                        >
                            <h6 className="mb-0">Select Expense Accounts</h6>
                            <button
                                type="button"
                                className="btn btn-sm border-0 text-danger"
                                onClick={closeExpenseModal}
                            >
                                <X />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-3" style={{ fontSize: "0.9rem", color: "#5E5E5E" }}>
                            {/* Search bar */}
                            <div className="mb-3">
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    placeholder="Search account"
                                />
                            </div>

                            {/* Expense group */}
                            <div className="mb-2">
                                <button
                                    type="button"
                                    className="btn btn-link p-0 d-flex align-items-center w-100 text-start"
                                    onClick={() => setShowExpenseGroup((prev) => !prev)}
                                    style={{ textDecoration: "none", color: "#5E5E5E" }}
                                >
                                    <span
                                        className="d-inline-flex align-items-center justify-content-center me-2"
                                        style={{
                                            width: 16,
                                            height: 16,
                                            borderRadius: 2,
                                            border: "1px solid #4a7cc2",
                                            fontSize: 12,
                                            lineHeight: 1,
                                        }}
                                    >
                                        {showExpenseGroup ? "−" : "+"}
                                    </span>
                                    <strong>Expense</strong>
                                </button>
                                {showExpenseGroup && (
                                    <ul className="list-unstyled ms-4 mt-2 mb-2">
                                        {/* Cost of Goods Sold */}
                                        <li className="mb-1">
                                            <strong style={{ fontSize: "0.85rem" }}>Cost of Goods Sold</strong>
                                            <ul className="list-unstyled ms-3 mt-1">
                                                {costOfGoodsSoldOptions.map((name: string) => {
                                                    const isSelected = selectedExpenseOptions.includes(name);
                                                    return (
                                                        <li key={name} className="mb-1">
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm w-100 d-flex align-items-center text-start"
                                                                style={{
                                                                    border: "none",
                                                                    backgroundColor: "#fff",
                                                                    fontSize: "0.85rem",
                                                                }}
                                                                onClick={() => toggleExpenseSelection(name)}
                                                            >
                                                                <span>{name}</span>
                                                                {isSelected && (
                                                                    <Check
                                                                        size={14}
                                                                        color="#4a7cc2"
                                                                        style={{ marginLeft: 6 }}
                                                                    />
                                                                )}
                                                            </button>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </li>

                                        {/* Plain Expense items */}
                                        {expenseOptions.map((name: string) => {
                                            const isSelected = selectedExpenseOptions.includes(name);
                                            return (
                                                <li key={name} className="mb-1">
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm w-100 d-flex align-items-center text-start"
                                                        style={{
                                                            border: "none",
                                                            backgroundColor: "#fff",
                                                            fontSize: "0.85rem",
                                                        }}
                                                        onClick={() => toggleExpenseSelection(name)}
                                                    >
                                                        <span>{name}</span>
                                                        {isSelected && (
                                                            <Check
                                                                size={14}
                                                                color="#4a7cc2"
                                                                style={{ marginLeft: 6 }}
                                                            />
                                                        )}
                                                    </button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </div>

                            {/* Other Expense group */}
                            <div className="mb-2">
                                <button
                                    type="button"
                                    className="btn btn-link p-0 d-flex align-items-center w-100 text-start"
                                    onClick={() => setShowOtherExpenseGroup((prev) => !prev)}
                                    style={{ textDecoration: "none", color: "#5E5E5E" }}
                                >
                                    <span
                                        className="d-inline-flex align-items-center justify-content-center me-2"
                                        style={{
                                            width: 16,
                                            height: 16,
                                            borderRadius: 2,
                                            border: "1px solid #4a7cc2",
                                            fontSize: 12,
                                            lineHeight: 1,
                                        }}
                                    >
                                        {showOtherExpenseGroup ? "−" : "+"}
                                    </span>
                                    <strong>Other Expense</strong>
                                </button>
                                {showOtherExpenseGroup && (
                                    <ul className="list-unstyled ms-4 mt-2 mb-0">
                                        {expenseOptions.map((name: string) => {
                                            const isSelected = selectedExpenseOptions.includes(name);
                                            return (
                                                <li key={name} className="mb-1">
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm w-100 d-flex align-items-center text-start"
                                                        style={{
                                                            border: "none",
                                                            backgroundColor: "#fff",
                                                            fontSize: "0.85rem",
                                                        }}
                                                        onClick={() => toggleExpenseSelection(name)}
                                                    >
                                                        <span>{name}</span>
                                                        {isSelected && (
                                                            <Check
                                                                size={14}
                                                                color="#4a7cc2"
                                                                style={{ marginLeft: 6 }}
                                                            />
                                                        )}
                                                    </button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="d-flex justify-content-end px-3 py-2 border-top">
                            <button
                                type="button"
                                className="btn btn-sm border px-3"
                                onClick={closeExpenseModal}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showAssetModal && (
                <div
                    className="d-flex align-items-center justify-content-center"
                    style={{
                        position: "fixed",
                        inset: 0,
                        backgroundColor: "rgba(0,0,0,0.35)",
                        zIndex: 1050,
                    }}
                >
                    <div
                        className="bg-white"
                        style={{
                            width: "520px",
                            maxWidth: "90%",
                            borderRadius: "6px",
                            boxShadow: "0 4px 18px rgba(0,0,0,0.15)",
                        }}
                    >
                        {/* Header */}
                        <div
                            className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom"
                            style={{ backgroundColor: "#f5f5f5" }}
                        >
                            <h6 className="mb-0">Select Asset Accounts</h6>
                            <button
                                type="button"
                                className="btn btn-sm border-0 text-danger"
                                onClick={closeAssetModal}
                            >
                                <X />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-3" style={{ fontSize: "0.9rem", color: "#5E5E5E" }}>
                            {/* optional search input here if you want */}

                            <ul className="list-unstyled mb-0">
                                {assetTree.map(group => {
                                    const isExpanded = expandedAssetGroups.includes(group.key);
                                    const hasChildren = group.children && group.children.length > 0;
                                    const hasItems = group.items && group.items.length > 0;

                                    return (
                                        <li key={group.key} className="mb-1">
                                            {/* top-level group row with +/- */}
                                            <button
                                                type="button"
                                                className="btn btn-link p-0 d-flex align-items-center w-100 text-start"
                                                onClick={() => toggleAssetGroup(group.key)}
                                                style={{ textDecoration: "none", color: "#5E5E5E" }}
                                            >
                                                <span
                                                    className="d-inline-flex align-items-center justify-content-center me-2"
                                                    style={{
                                                        width: 16,
                                                        height: 16,
                                                        borderRadius: 2,
                                                        border: "1px solid #4a7cc2",
                                                        fontSize: 12,
                                                        lineHeight: 1,
                                                    }}
                                                >
                                                    {isExpanded ? "−" : "+"}
                                                </span>
                                                <strong>{group.label}</strong>
                                            </button>

                                            {isExpanded && (
                                                <div className="ms-4 mt-1">
                                                    {/* direct items under this group */}
                                                    {hasItems && (
                                                        <ul className="list-unstyled mb-1">
                                                            {group.items!.map(opt => {
                                                                const selected = selectedAssetOptions.includes(
                                                                    opt.value
                                                                );
                                                                return (
                                                                    <li key={opt.value} className="mb-1">
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-sm w-100 d-flex align-items-center text-start"
                                                                            style={{
                                                                                border: "none",
                                                                                backgroundColor: "#fff",
                                                                                fontSize: "0.85rem",
                                                                            }}
                                                                            onClick={() => toggleAssetSelection(opt.value)}
                                                                        >
                                                                            <span>{opt.label}</span>
                                                                            {selected && (
                                                                                <Check
                                                                                    size={14}
                                                                                    color="#4a7cc2"
                                                                                    style={{ marginLeft: 6 }}
                                                                                />
                                                                            )}
                                                                        </button>
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>
                                                    )}

                                                    {/* nested child groups (Current Assets sub-categories) */}
                                                    {hasChildren && (
                                                        <ul className="list-unstyled mb-0">
                                                            {group.children!.map(child => {
                                                                const childExpanded = expandedAssetGroups.includes(
                                                                    child.key
                                                                );
                                                                return (
                                                                    <li key={child.key} className="mb-1">
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-link p-0 d-flex align-items-center w-100 text-start"
                                                                            onClick={() => toggleAssetGroup(child.key)}
                                                                            style={{
                                                                                textDecoration: "none",
                                                                                color: "#5E5E5E",
                                                                            }}
                                                                        >
                                                                            <span
                                                                                className="d-inline-flex align-items-center justify-content-center me-2"
                                                                                style={{
                                                                                    width: 16,
                                                                                    height: 16,
                                                                                    borderRadius: 2,
                                                                                    border: "1px solid #4a7cc2",
                                                                                    fontSize: 12,
                                                                                    lineHeight: 1,
                                                                                }}
                                                                            >
                                                                                {childExpanded ? "−" : "+"}
                                                                            </span>
                                                                            {child.label}
                                                                        </button>

                                                                        {childExpanded && child.items && (
                                                                            <ul className="list-unstyled ms-3 mt-1 mb-0">
                                                                                {child.items.map(opt => {
                                                                                    const selected =
                                                                                        selectedAssetOptions.includes(
                                                                                            opt.value
                                                                                        );
                                                                                    return (
                                                                                        <li key={opt.value} className="mb-1">
                                                                                            <button
                                                                                                type="button"
                                                                                                className="btn btn-sm w-100 d-flex align-items-center text-start"
                                                                                                style={{
                                                                                                    border: "none",
                                                                                                    backgroundColor: "#fff",
                                                                                                    fontSize: "0.85rem",
                                                                                                }}
                                                                                                onClick={() =>
                                                                                                    toggleAssetSelection(opt.value)
                                                                                                }
                                                                                            >
                                                                                                <span>{opt.label}</span>
                                                                                                {selected && (
                                                                                                    <Check
                                                                                                        size={14}
                                                                                                        color="#4a7cc2"
                                                                                                        style={{ marginLeft: 6 }}
                                                                                                    />
                                                                                                )}
                                                                                            </button>
                                                                                        </li>
                                                                                    );
                                                                                })}
                                                                            </ul>
                                                                        )}
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>
                                                    )}
                                                </div>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        {/* Footer */}
                        <div className="d-flex justify-content-end px-3 py-2 border-top">
                            <button
                                type="button"
                                className="btn btn-sm border px-3"
                                onClick={closeAssetModal}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showLiabilityModal && (
                <div
                    className="d-flex align-items-center justify-content-center"
                    style={{
                        position: "fixed",
                        inset: 0,
                        backgroundColor: "rgba(0,0,0,0.35)",
                        zIndex: 1050,
                    }}
                >
                    <div
                        className="bg-white"
                        style={{
                            width: "520px",
                            maxWidth: "90%",
                            borderRadius: "6px",
                            boxShadow: "0 4px 18px rgba(0,0,0,0.15)",
                        }}
                    >
                        {/* Header */}
                        <div
                            className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom"
                            style={{ backgroundColor: "#f5f5f5" }}
                        >
                            <h6 className="mb-0">Select Liability Accounts</h6>
                            <button
                                type="button"
                                className="btn btn-sm border-0 text-danger"
                                onClick={closeLiabilityModal}
                            >
                                <X />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-3" style={{ fontSize: "0.9rem", color: "#5E5E5E" }}>
                            <ul className="list-unstyled mb-0">
                                {liabilityTree.map(group => {
                                    const isExpanded = expandedLiabilityGroups.includes(group.key);
                                    const hasItems = group.items && group.items.length > 0;

                                    return (
                                        <li key={group.key} className="mb-1">
                                            {/* group header with +/- */}
                                            <button
                                                type="button"
                                                className="btn btn-link p-0 d-flex align-items-center w-100 text-start"
                                                onClick={() => toggleLiabilityGroup(group.key)}
                                                style={{ textDecoration: "none", color: "#5E5E5E" }}
                                            >
                                                <span
                                                    className="d-inline-flex align-items-center justify-content-center me-2"
                                                    style={{
                                                        width: 16,
                                                        height: 16,
                                                        borderRadius: 2,
                                                        border: "1px solid #4a7cc2",
                                                        fontSize: 12,
                                                        lineHeight: 1,
                                                    }}
                                                >
                                                    {isExpanded ? "−" : "+"}
                                                </span>
                                                <strong>{group.label}</strong>
                                            </button>

                                            {isExpanded && hasItems && (
                                                <ul className="list-unstyled ms-4 mt-1 mb-0">
                                                    {group.items!.map(opt => {
                                                        const selected = selectedLiabilityOptions.includes(opt.value);
                                                        return (
                                                            <li key={opt.value} className="mb-1">
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm w-100 d-flex align-items-center text-start"
                                                                    style={{
                                                                        border: "none",
                                                                        backgroundColor: "#fff",
                                                                        fontSize: "0.85rem",
                                                                    }}
                                                                    onClick={() => toggleLiabilitySelection(opt.value)}
                                                                >
                                                                    <span>{opt.label}</span>
                                                                    {selected && (
                                                                        <Check
                                                                            size={14}
                                                                            color="#4a7cc2"
                                                                            style={{ marginLeft: 6 }}
                                                                        />
                                                                    )}
                                                                </button>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        {/* Footer */}
                        <div className="d-flex justify-content-end px-3 py-2 border-top">
                            <button
                                type="button"
                                className="btn btn-sm border px-3"
                                onClick={closeLiabilityModal}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showEquityModal && (
                <div
                    className="d-flex align-items-center justify-content-center"
                    style={{
                        position: "fixed",
                        inset: 0,
                        backgroundColor: "rgba(0,0,0,0.35)",
                        zIndex: 1050,
                    }}
                >
                    <div
                        className="bg-white"
                        style={{
                            width: "520px",
                            maxWidth: "90%",
                            borderRadius: "6px",
                            boxShadow: "0 4px 18px rgba(0,0,0,0.15)",
                        }}
                    >
                        {/* Header */}
                        <div
                            className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom"
                            style={{ backgroundColor: "#f5f5f5" }}
                        >
                            <h6 className="mb-0">Select Equity Accounts</h6>
                            <button
                                type="button"
                                className="btn btn-sm border-0 text-danger"
                                onClick={closeEquityModal}
                            >
                                <X />
                            </button>
                        </div>

                        {/* Body */}
                        {/* Body */}
                        <div className="p-3" style={{ fontSize: "0.9rem", color: "#5E5E5E" }}>
                            {/* Equity category as single dropdown */}
                            <div className="mb-2">
                                <button
                                    type="button"
                                    className="btn btn-link p-0 d-flex align-items-center w-100 text-start"
                                    onClick={() => setShowEquityGroup((prev) => !prev)}
                                    style={{ textDecoration: "none", color: "#5E5E5E" }}
                                >
                                    <span
                                        className="d-inline-flex align-items-center justify-content-center me-2"
                                        style={{
                                            width: 16,
                                            height: 16,
                                            borderRadius: 2,
                                            border: "1px solid #4a7cc2",
                                            fontSize: 12,
                                            lineHeight: 1,
                                        }}
                                    >
                                        {showEquityGroup ? "−" : "+"}
                                    </span>
                                    <strong>Equity</strong>
                                </button>

                                {showEquityGroup && (
                                    <ul className="list-unstyled ms-4 mt-2 mb-0">
                                        {equityOptions.map((name) => {
                                            const isSelected = selectedEquityOptions.includes(name);
                                            return (
                                                <li key={name} className="mb-1">
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm w-100 d-flex align-items-center text-start"
                                                        style={{
                                                            border: "none",
                                                            backgroundColor: "#fff",
                                                            fontSize: "0.85rem",
                                                        }}
                                                        onClick={() => toggleEquitySelection(name)}
                                                    >
                                                        <span>{name}</span>
                                                        {isSelected && (
                                                            <Check
                                                                size={14}
                                                                color="#4a7cc2"
                                                                style={{ marginLeft: 6 }}
                                                            />
                                                        )}
                                                    </button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </div>
                        </div>


                        {/* Footer */}
                        <div className="d-flex justify-content-end px-3 py-2 border-top">
                            <button
                                type="button"
                                className="btn btn-sm border px-3"
                                onClick={closeEquityModal}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}


        </>
    );
}
