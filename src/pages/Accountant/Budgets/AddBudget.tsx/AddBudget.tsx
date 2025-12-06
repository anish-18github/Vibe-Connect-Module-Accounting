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

            alert("Budget created successfully!");
            navigate("/accountant/calculate-budget");
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
                                        onChange={handleChange}
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
                                        onChange={handleChange}
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
                                        onChange={handleChange}
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
        </>
    );
}
