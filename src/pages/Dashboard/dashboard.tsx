import IncomeExpenseChart from "../../components/Charts/IncomeExpenseChart";
import CashFlowBar from "../../components/Charts/CashFlowBar";
import Header from "../../components/Header/Header";
import Navbar from "../../components/Navbar/NavBar";
import Card from "../../components/Cards/Card";
import "./dashboard.css";


// Sample data for charts
const incomeExpenseData = [
    { month: "Jan", income: 5000, expense: 3500 },
    { month: "Feb", income: 6000, expense: 4200 },
    { month: "Mar", income: 5500, expense: 3000 },
    { month: "Apr", income: 6500, expense: 5000 },
];

const cashFlowData = [
    { month: "Jan", incoming: 1200, outgoing: 800 },
    { month: "Feb", incoming: 1800, outgoing: 900 },
    { month: "Mar", incoming: 1500, outgoing: 1300 },
    { month: "Apr", incoming: 2000, outgoing: 1000 },
];

export const dashboardTabs = [
    { label: "Dashboard", path: "/" },
    { label: "Sales", path: "/sales/customers" },
    { label: "Purchases", path: "/purchases" },
    { label: "Accountant", path: "/accountant" },
    { label: "Society", path: "/society" },
    { label: "Reporting", path: "/reporting" },
];




function Dashboard() {
    return (
        <>
            <Header />
            <Navbar tabs={dashboardTabs} />

            <div className="dashboard-container">

                {/* Total Receivables */}
                <Card title="Total Receivables" actions>
                    <p>Total Unpaid Invoice <span>₹ 0.00</span></p>
                    <div className="bar"></div>
                    <div className="row-values">
                        <h2>
                            Current <span>₹ 0.00</span>
                        </h2>
                        <h2>
                            Overdue <span>₹ 0.00</span>
                        </h2>
                    </div>

                </Card>

                {/* Total Payables */}
                <Card title="Total Payables" actions>
                    <p>Total Unpaid Invoice <span>₹ 0.00</span></p>
                    <div className="bar"></div>
                    <div className="row-values">
                        <h2>
                            Current <span>₹ 0.00</span>
                        </h2>
                        <h2>
                            Overdue <span>₹ 0.00</span>
                        </h2>
                    </div>

                </Card>

                <Card title="Income and Expense" selectable>
                    {/* Toggle buttons */}
                    <div className="chart-toggle">
                        <button className="toggle-btn accrual active">Accrual</button>
                        <button className="toggle-btn cash ">Cash</button>
                    </div>

                    {/* Chart */}
                    <IncomeExpenseChart data={incomeExpenseData} />

                    {/* Summary section */}
                    <div className="chart-summary">
                        <div className="summary-item">
                            <span className="dot income"></span> Income
                            <h3>Total Income</h3>
                            <h2>₹0.00</h2>
                        </div>

                        <div className="summary-item">
                            <span className="dot expense"></span> Expense
                            <h3>Total Expenses</h3>
                            <h2>₹0.00</h2>
                        </div>
                    </div>

                    {/* Footer note */}
                    <p className="chart-note">
                        * Income and expense values displayed are exclusive of taxes.
                    </p>
                </Card>


                {/* Top Expenses (NO CHART) */}
                <Card title="Top Expenses" selectable>
                    <div className="placeholder">
                        <p>No data available</p>
                    </div>
                </Card>

                {/* Cash Flow (WITH DATA) */}
                <Card title="Cash Flow" selectable className="wide-card">

                    <div className="cashflow-content">
                        <CashFlowBar data={cashFlowData} />

                        <div className="cashflow-summary">
                            <div className="summary-item">
                                <span className="dot income"></span> Income
                                <h3>Total Income</h3>
                                <h2>₹0.00</h2>
                            </div>

                            <div className="summary-item">
                                <span className="dot expense"></span> Expense
                                <h3>Total Expenses</h3>
                                <h2>₹0.00</h2>
                            </div>

                            <div className="summary-item">
                                <span className="dot income"></span> Income
                                <h3>Total Income</h3>
                                <h2>₹0.00</h2>
                            </div>

                            <div className="summary-item">
                                <span className="dot expense"></span> Expense
                                <h3>Total Expenses</h3>
                                <h2>₹0.00</h2>
                            </div>
                        </div>
                    </div>

                </Card>


            </div>
        </>
    );


}

export default Dashboard;
