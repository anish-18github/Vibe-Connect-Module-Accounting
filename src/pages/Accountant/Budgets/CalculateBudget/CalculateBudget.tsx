import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../../../components/Header/Header";
import Tabs from "../../../../components/Tab/Tabs";
import './calculateBudget.css'

type BudgetPeriod = "monthly" | "quarterly" | "half-yearly" | "yearly";

interface LocationState {
    name: string;
    fiscalYear: string;
    period: BudgetPeriod | "";
    incomeAccounts: string[];
    expenseAccounts: string[];
    assetAccounts: string[];
    liabilityAccounts: string[];
    equityAccounts: string[];
}

interface RowBudget {
    [monthKey: string]: number;
}

const getMonthsForPeriod = (period: BudgetPeriod | ""): string[] => {
    switch (period) {
        case "quarterly":
            // labels for each quarter of your fiscal year
            return ["Q1 2025", "Q2 2025", "Q3 2025", "Q4 2025"];
        case "half-yearly":
            return ["H1 2025", "H2 2025"];
        case "yearly":
            return ["FY 2025-2026"];
        case "monthly":
        default:
            return [
                "Apr 2025",
                "May 2025",
                "Jun 2025",
                "Jul 2025",
                "Aug 2025",
                "Sep 2025",
                "Oct 2025",
                "Nov 2025",
                "Dec 2025",
                "Jan 2026",
                "Feb 2026",
                "Mar 2026",
            ];
    }
};


const CalculateBudget: React.FC = () => {

    const [activeTab, setActiveTab] = useState<string>("income-expense");


    const navigate = useNavigate();
    const location = useLocation();
    const state = (location.state || {}) as LocationState;

    const name = state.name ?? "";
    const fiscalYear = state.fiscalYear ?? "";
    const period = state.period ?? "";
    const incomeAccounts = state.incomeAccounts ?? [];
    const expenseAccounts = state.expenseAccounts ?? [];

    const assetAccounts = state.assetAccounts ?? [];
    const liabilityAccounts = state.liabilityAccounts ?? [];
    const equityAccounts = state.equityAccounts ?? [];

    // INCOME, EXPENSE SHOW STATE

    const [showIncomeRows, setShowIncomeRows] = useState(true);
    const [showExpenseRows, setShowExpenseRows] = useState(true);

    // ASSET, LIABILITY AND EQUITY AHOW STATE

    const [showAssetRows, setShowAssetRows] = useState(true);
    const [showLiabilityRows, setShowLiabilityRows] = useState(true);
    const [showEquityRows, setShowEquityRows] = useState(true);


    const months = useMemo(
        () => getMonthsForPeriod(period as BudgetPeriod | ""),
        [period]
    );

    const incomeRows = useMemo(
        () => incomeAccounts,
        [incomeAccounts]
    );

    const expenseRows = useMemo(
        () => expenseAccounts,
        [expenseAccounts]
    );

    const assetRows = useMemo(() => assetAccounts, [assetAccounts]);
    const liabilityRows = useMemo(() => liabilityAccounts, [liabilityAccounts]);
    const equityRows = useMemo(() => equityAccounts, [equityAccounts]);

    const accountRows = useMemo(
        () => [...incomeRows, ...expenseRows],
        [incomeRows, expenseRows]
    );

    const aleRows = useMemo(
        () => [...assetAccounts, ...liabilityAccounts, ...equityAccounts],
        [assetAccounts, liabilityAccounts, equityAccounts]
    );

    const allRows = useMemo(
        () => [...incomeRows, ...expenseRows, ...aleRows],
        [incomeRows, expenseRows, aleRows]
    );

    const getAleBalance = (): number =>
        getAssetTotal() - getLiabilityTotal() - getEquityTotal();



    const [values, setValues] = useState<Record<string, RowBudget>>(() => {
        const initial: Record<string, RowBudget> = {};
        allRows.forEach((acc) => {
            initial[acc] = {};
            months.forEach((m) => {
                initial[acc][m] = 0;
            });
        });
        return initial;
    });




    const handleCellChange = (
        account: string,
        month: string,
        v: string
    ) => {
        const num = Number(v) || 0;
        setValues((prev) => ({
            ...prev,
            [account]: {
                ...prev[account],
                [month]: num,
            },
        }));
    };

    const getRowTotal = (account: string): number =>
        months.reduce((sum, m) => sum + (values[account]?.[m] || 0), 0);

    const getColumnTotal = (month: string): number =>
        accountRows.reduce(
            (sum, acc) => sum + (values[acc]?.[month] || 0),
            0
        );


    const getIncomeTotal = (): number =>
        incomeRows.reduce((sum, acc) => sum + getRowTotal(acc), 0);

    const getExpenseTotal = (): number =>
        expenseRows.reduce((sum, acc) => sum + getRowTotal(acc), 0);

    const getProfitOrLoss = (): number =>
        getIncomeTotal() - getExpenseTotal();

    const getAssetTotal = (): number =>
        assetRows.reduce((sum, acc) => sum + getRowTotal(acc), 0);

    const getLiabilityTotal = (): number =>
        liabilityRows.reduce((sum, acc) => sum + getRowTotal(acc), 0);

    const getEquityTotal = (): number =>
        equityRows.reduce((sum, acc) => sum + getRowTotal(acc), 0);




    // const activeContent = tabs.find((t) => t.key === activeKey)?.content;

    const incomeExpenseContent = (
        <>
            <div className="item-card mb-4">
                <div className="item-card-header">
                    <span className="item-card-title">Income & Expense Accounts</span>
                </div>

                <div className="item-card-body">
                    <div className="table-responsive">
                        <table className="table table-sm align-middle item-table-inner">
                            <thead>
                                <tr>
                                    <th
                                        className="fw-medium text-dark"
                                        style={{ minWidth: 220 }}
                                    >
                                        Account
                                    </th>
                                    {months.map((m) => (
                                        <th
                                            key={m}
                                            className="fw-medium text-dark text-end"
                                            style={{ width: 110 }}
                                        >
                                            {m}
                                        </th>
                                    ))}
                                    <th
                                        className="fw-medium text-dark text-end"
                                        style={{ width: 110 }}
                                    >
                                        Total
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {/* Income section */}
                                {incomeRows.length > 0 && (
                                    <>
                                        {/* Income header row with +/- icon */}
                                        <tr className="table-light">
                                            <td
                                                colSpan={months.length + 2}
                                                className="fw-semibold text-dark"
                                                style={{ cursor: "pointer" }}
                                                onClick={() => setShowIncomeRows((prev) => !prev)}
                                            >
                                                <span
                                                    style={{
                                                        display: "inline-flex",
                                                        alignItems: "center",
                                                        marginRight: 8,
                                                        width: 16,
                                                        height: 16,
                                                        borderRadius: 2,
                                                        border: "1px solid #4a7cc2",
                                                        fontSize: 11,
                                                        justifyContent: "center",
                                                    }}
                                                >
                                                    {showIncomeRows ? "−" : "+"}
                                                </span>
                                                Income
                                            </td>
                                        </tr>

                                        {/* Income child rows */}
                                        {showIncomeRows &&
                                            incomeRows.map((acc) => (
                                                <tr key={`income-${acc}`}>
                                                    <td style={{ paddingLeft: 28 }}>{acc}</td>
                                                    {months.map((m) => (
                                                        <td key={m} className="text-end align-middle">
                                                            <input
                                                                type="number"
                                                                className="form-control form-control-sm border-0 text-end no-spinner p-0"
                                                                value={values[acc]?.[m] ?? 0}
                                                                onChange={(e) =>
                                                                    handleCellChange(acc, m, e.target.value)
                                                                }
                                                            />
                                                        </td>
                                                    ))}
                                                    <td className="text-end fw-semibold align-middle">
                                                        {getRowTotal(acc)}
                                                    </td>
                                                </tr>
                                            ))}

                                        {/* Income total row */}
                                        <tr className="table-light">
                                            <td className="fw-semibold text-dark">Total Income</td>
                                            {months.map((m) => (
                                                <td key={m} className="text-end align-middle">
                                                    {incomeRows.reduce(
                                                        (sum, acc) => sum + (values[acc]?.[m] || 0),
                                                        0
                                                    )}
                                                </td>
                                            ))}
                                            <td className="text-end fw-semibold align-middle">
                                                {getIncomeTotal()}
                                            </td>
                                        </tr>
                                    </>
                                )}

                                {/* Expense section */}
                                {expenseRows.length > 0 && (
                                    <>
                                        {/* Expense header row with +/- icon */}
                                        <tr className="table-light">
                                            <td
                                                colSpan={months.length + 2}
                                                className="fw-semibold text-dark"
                                                style={{ cursor: "pointer" }}
                                                onClick={() => setShowExpenseRows((prev) => !prev)}
                                            >
                                                <span
                                                    style={{
                                                        display: "inline-flex",
                                                        alignItems: "center",
                                                        marginRight: 8,
                                                        width: 16,
                                                        height: 16,
                                                        borderRadius: 2,
                                                        border: "1px solid #4a7cc2",
                                                        fontSize: 11,
                                                        justifyContent: "center",
                                                    }}
                                                >
                                                    {showExpenseRows ? "−" : "+"}
                                                </span>
                                                Expense
                                            </td>
                                        </tr>

                                        {/* Expense child rows */}
                                        {showExpenseRows &&
                                            expenseRows.map((acc) => (
                                                <tr key={`expense-${acc}`}>
                                                    <td style={{ paddingLeft: 28 }}>{acc}</td>
                                                    {months.map((m) => (
                                                        <td key={m} className="text-end align-middle">
                                                            <input
                                                                type="number"
                                                                className="form-control form-control-sm border-0 text-end no-spinner p-0"
                                                                value={values[acc]?.[m] ?? 0}
                                                                onChange={(e) =>
                                                                    handleCellChange(acc, m, e.target.value)
                                                                }
                                                            />
                                                        </td>
                                                    ))}
                                                    <td className="text-end fw-semibold align-middle">
                                                        {getRowTotal(acc)}
                                                    </td>
                                                </tr>
                                            ))}

                                        {/* Expense total row */}
                                        <tr className="table-light">
                                            <td className="fw-semibold text-dark">Total Expense</td>
                                            {months.map((m) => (
                                                <td key={m} className="text-end align-middle">
                                                    {expenseRows.reduce(
                                                        (sum, acc) => sum + (values[acc]?.[m] || 0),
                                                        0
                                                    )}
                                                </td>
                                            ))}
                                            <td className="text-end fw-semibold align-middle">
                                                {getExpenseTotal()}
                                            </td>
                                        </tr>
                                    </>
                                )}
                            </tbody>

                            <tfoot>
                                <tr className="table-light">
                                    <th className="fw-medium text-dark">Profit / Loss</th>
                                    {months.map((m) => {
                                        const incomeMonthTotal = incomeRows.reduce(
                                            (sum, acc) => sum + (values[acc]?.[m] || 0),
                                            0
                                        );
                                        const expenseMonthTotal = expenseRows.reduce(
                                            (sum, acc) => sum + (values[acc]?.[m] || 0),
                                            0
                                        );
                                        const diff = incomeMonthTotal - expenseMonthTotal;
                                        const color =
                                            diff > 0 ? "#4a7cc2" : diff < 0 ? "#d9534f" : "inherit";

                                        return (
                                            <th
                                                key={m}
                                                className="text-end fw-medium align-middle"
                                                style={{ color }}
                                            >
                                                {diff}
                                            </th>
                                        );
                                    })}
                                    <th
                                        className="text-end fw-medium align-middle"
                                        style={{
                                            color:
                                                getProfitOrLoss() > 0
                                                    ? "#4a7cc2"
                                                    : getProfitOrLoss() < 0
                                                        ? "#d9534f"
                                                        : "inherit",
                                        }}
                                    >
                                        {getProfitOrLoss()}
                                    </th>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>

            <div className="mx-5 form-actions">
                <button className="btn btn-outline-secondary me-3 px-4 btn-sm">
                    Cancel
                </button>
                <button
                    className="btn px-4 btn-sm"
                    style={{ background: "#7991BB", color: "#FFF" }}
                >
                    Save
                </button>
            </div>
        </>

    );



    const aleContent = (
        <div className="item-card mx-2">
            <div className="item-card-header">
                <span className="item-card-title">Account Level Estimates</span>
            </div>

            <div className="item-card-body">
                <div className="ale-table-wrapper">

                    <table className="table table-sm align-middle item-table-inner ale-table">
                        <thead>
                            <tr>
                                <th style={{ minWidth: 220 }}>Account</th>
                                {months.map((m) => (
                                    <th key={m} className="text-center">
                                        {m}
                                    </th>
                                ))}
                                <th className="text-center">Total</th>
                            </tr>
                        </thead>

                        <tbody>
                            {/* Assets */}
                            {assetRows.length > 0 && (
                                <>
                                    <tr className="table-light">
                                        <td
                                            colSpan={months.length + 2}
                                            className="fw-semibold"
                                            style={{ cursor: "pointer" }}
                                            onClick={() => setShowAssetRows((prev) => !prev)}
                                        >
                                            <span
                                                style={{
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    marginRight: 8,
                                                    width: 16,
                                                    height: 16,
                                                    borderRadius: 2,
                                                    border: "1px solid #4a7cc2",
                                                    fontSize: 11,
                                                    justifyContent: "center",
                                                }}
                                            >
                                                {showAssetRows ? "−" : "+"}
                                            </span>
                                            Assets
                                        </td>
                                    </tr>

                                    {showAssetRows &&
                                        assetRows.map((acc) => (
                                            <tr key={`asset-${acc}`}>
                                                <td style={{ paddingLeft: 28 }}>{acc}</td>
                                                {months.map((m) => (
                                                    <td key={m}>
                                                        <input
                                                            type="number"
                                                            className="form-control form-control-sm text-end item-input border"
                                                            value={values[acc]?.[m] ?? 0}
                                                            onChange={(e) =>
                                                                handleCellChange(acc, m, e.target.value)
                                                            }
                                                        />
                                                    </td>
                                                ))}
                                                <td className="text-end fw-semibold">
                                                    {getRowTotal(acc)}
                                                </td>
                                            </tr>
                                        ))}

                                    <tr className="table-light">
                                        <td className="fw-semibold">Total Assets</td>
                                        {months.map((m) => (
                                            <td key={m} className="text-end">
                                                {assetRows.reduce(
                                                    (sum, acc) => sum + (values[acc]?.[m] || 0),
                                                    0
                                                )}
                                            </td>
                                        ))}
                                        <td className="text-end fw-semibold">
                                            {getAssetTotal()}
                                        </td>
                                    </tr>
                                </>
                            )}

                            {/* Liabilities */}
                            {liabilityRows.length > 0 && (
                                <>
                                    <tr className="table-light">
                                        <td
                                            colSpan={months.length + 2}
                                            className="fw-semibold"
                                            style={{ cursor: "pointer" }}
                                            onClick={() => setShowLiabilityRows((prev) => !prev)}
                                        >
                                            <span
                                                style={{
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    marginRight: 8,
                                                    width: 16,
                                                    height: 16,
                                                    borderRadius: 2,
                                                    border: "1px solid #4a7cc2",
                                                    fontSize: 11,
                                                    justifyContent: "center",
                                                }}
                                            >
                                                {showLiabilityRows ? "−" : "+"}
                                            </span>
                                            Liabilities
                                        </td>
                                    </tr>

                                    {showLiabilityRows &&
                                        liabilityRows.map((acc) => (
                                            <tr key={`liability-${acc}`}>
                                                <td style={{ paddingLeft: 28 }}>{acc}</td>
                                                {months.map((m) => (
                                                    <td key={m}>
                                                        <input
                                                            type="number"
                                                            className="form-control form-control-sm text-end item-input border"
                                                            value={values[acc]?.[m] ?? 0}
                                                            onChange={(e) =>
                                                                handleCellChange(acc, m, e.target.value)
                                                            }
                                                        />
                                                    </td>
                                                ))}
                                                <td className="text-end fw-semibold">
                                                    {getRowTotal(acc)}
                                                </td>
                                            </tr>
                                        ))}

                                    <tr className="table-light">
                                        <td className="fw-semibold">Total Liabilities</td>
                                        {months.map((m) => (
                                            <td key={m} className="text-end">
                                                {liabilityRows.reduce(
                                                    (sum, acc) => sum + (values[acc]?.[m] || 0),
                                                    0
                                                )}
                                            </td>
                                        ))}
                                        <td className="text-end fw-semibold">
                                            {getLiabilityTotal()}
                                        </td>
                                    </tr>
                                </>
                            )}

                            {/* Equity */}
                            {equityRows.length > 0 && (
                                <>
                                    <tr className="table-light">
                                        <td
                                            colSpan={months.length + 2}
                                            className="fw-semibold"
                                            style={{ cursor: "pointer" }}
                                            onClick={() => setShowEquityRows((prev) => !prev)}
                                        >
                                            <span
                                                style={{
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    marginRight: 8,
                                                    width: 16,
                                                    height: 16,
                                                    borderRadius: 2,
                                                    border: "1px solid #4a7cc2",
                                                    fontSize: 11,
                                                    justifyContent: "center",
                                                }}
                                            >
                                                {showEquityRows ? "−" : "+"}
                                            </span>
                                            Equity
                                        </td>
                                    </tr>

                                    {showEquityRows &&
                                        equityRows.map((acc) => (
                                            <tr key={`equity-${acc}`}>
                                                <td style={{ paddingLeft: 28 }}>{acc}</td>
                                                {months.map((m) => (
                                                    <td key={m}>
                                                        <input
                                                            type="number"
                                                            className="form-control form-control-sm text-end item-input border"
                                                            value={values[acc]?.[m] ?? 0}
                                                            onChange={(e) =>
                                                                handleCellChange(acc, m, e.target.value)
                                                            }
                                                        />
                                                    </td>
                                                ))}
                                                <td className="text-end fw-semibold">
                                                    {getRowTotal(acc)}
                                                </td>
                                            </tr>
                                        ))}

                                    <tr className="table-light">
                                        <td className="fw-semibold">Total Equity</td>
                                        {months.map((m) => (
                                            <td key={m} className="text-end">
                                                {equityRows.reduce(
                                                    (sum, acc) => sum + (values[acc]?.[m] || 0),
                                                    0
                                                )}
                                            </td>
                                        ))}
                                        <td className="text-end fw-semibold">
                                            {getEquityTotal()}
                                        </td>
                                    </tr>
                                </>
                            )}
                        </tbody>

                        <tfoot>
                            <tr className="table-light">
                                <th>Assets − (Liabilities + Equity)</th>
                                {months.map((m) => {
                                    const assetMonth = assetRows.reduce(
                                        (sum, acc) => sum + (values[acc]?.[m] || 0),
                                        0
                                    );
                                    const liabilityMonth = liabilityRows.reduce(
                                        (sum, acc) => sum + (values[acc]?.[m] || 0),
                                        0
                                    );
                                    const equityMonth = equityRows.reduce(
                                        (sum, acc) => sum + (values[acc]?.[m] || 0),
                                        0
                                    );
                                    const diff = assetMonth - (liabilityMonth + equityMonth);
                                    const color =
                                        diff === 0 ? "#4a7cc2" : diff > 0 ? "#5cb85c" : "#d9534f";

                                    return (
                                        <th key={m} className="text-end" style={{ color }}>
                                            {diff}
                                        </th>
                                    );
                                })}
                                <th
                                    className="text-end"
                                    style={{
                                        color:
                                            getAleBalance() === 0
                                                ? "#4a7cc2"
                                                : getAleBalance() > 0
                                                    ? "#5cb85c"
                                                    : "#d9534f",
                                    }}
                                >
                                    {getAleBalance()}
                                </th>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <div className="mt-3 d-flex justify-content-end gap-2 px-3">
                    <button type="submit" className="btn px-4" style={{ background: "#7991BB", color: "#FFF" }}
                    >Save</button>
                    <button type="button" className="btn border me-3 px-4"  onClick={() => navigate(-1)}>Cancel</button>
                </div>
            </div>
        </div>
    );





    const tabs = [
        {
            key: "income-expense",
            label: "Income & Expense Accounts",
            content: incomeExpenseContent,
        },
        {
            key: "ale",
            label: "Asset, Liability & Equity Accounts",
            content: aleContent,
        },
    ];



    return (
        <>
            <Header />
            <div style={{ padding: "69px 1.8rem 0 1.8rem" }}>
                <h1 className="h4 text-dark mb-2">Calculate Budget</h1>
                <p className="text-muted mb-3" style={{ fontSize: "0.9rem" }}>
                    Budget: {state.name || "-"} | Fiscal Year: {state.fiscalYear || "-"} | Period: {state.period || "-"}
                </p>

                {/* Tabs header */}
                <Tabs
                    tabs={tabs}
                    defaultActiveKey="income-expense"
                    onChange={(key) => setActiveTab(key)}
                />

                {/* Tabs body – render content for active tab */}
                <div className="mt-3">
                    {tabs.find((t) => t.key === activeTab)?.content}
                </div>
            </div>
        </>
    );

};

export default CalculateBudget;
