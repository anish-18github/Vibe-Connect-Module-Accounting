// import IncomeExpenseChart from "../../components/Charts/IncomeExpenseChart";
import Header from "../../components/Header/Header";
import Navbar from "../../components/Navbar/NavBar";
import Card from "../../components/Cards/Card";
import "./dashboard.css";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

import chartData from "../../data/incomeExpense.json";
import topExpenses from "../../data/topExpenses.json";
import cashFlow from "../../data/cashFlow.json";

// import { data } from "react-router-dom";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement);





export const dashboardTabs = [
    { label: "Dashboard", path: "/" },
    { label: "Sales", path: "/sales" },
    { label: "Purchases", path: "/purchases" },
    { label: "Accountant", path: "/accountant" },
    { label: "Society", path: "/society" },
    { label: "Reporting", path: "/reporting" },
];


interface ChartEntry {
    Income: { Label: string; value: number };
    Expense: { Label: string; value: number };
}

interface TopExpenseEntry {
    Category: string;
    Amount: number;
}

interface CashFlowEntry {
    month: string;
    incoming: number;
    outgoing: number;
}



const chartDataTyped: ChartEntry[] = chartData as ChartEntry[];
const topExpensesTyped: TopExpenseEntry[] = topExpenses as TopExpenseEntry[];
const cashFlowTyped: CashFlowEntry[] = cashFlow as CashFlowEntry[];




function Dashboard() {

    const formattedIncomeExpense = {
        labels: chartDataTyped.map(i => i.Income.Label),
        datasets: [
            {
                label: "Income",
                data: chartDataTyped.map(i => i.Income.value),
                backgroundColor: "rgba(75, 192, 192, 0.6)"
            },
            {
                label: "Expense",
                data: chartDataTyped.map(i => i.Expense.value),
                backgroundColor: "rgba(255, 99, 132, 0.6)"
            }
        ]
    };

    const formattedTopExpenses = {
        labels: topExpensesTyped.map(item => item.Category),

        datasets: [
            {
                label: "Top Expenses",
                data: topExpensesTyped.map(item => item.Amount),
                backgroundColor: "rgba(255, 159, 64, 0.6)"
            }
        ]
    };

    const formattedCashFlow = {
        labels: cashFlowTyped.map(i => i.month),

        datasets: [
            {
                label: "Incoming",
                data: cashFlowTyped.map(i => i.incoming),
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 2,
                tension: 0.4,
                fill: false
            },
            {
                label: "Outgoing",
                data: cashFlowTyped.map(i => i.outgoing),
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 2,
                tension: 0.4,
                fill: false
            }
        ]
    };




    return (
        <>
            <Header />
            <div style={{ padding: "56px 0px 0px" }}>

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

                        <div className="dataCard customerCard">
                            <Bar data={formattedIncomeExpense} />
                        </div>



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
                        <div className="dataCard customerCard">
                            <Bar data={formattedTopExpenses} />
                        </div>
                    </Card>


                    {/* Cash Flow (WITH DATA) */}
                    <Card title="Cash Flow" selectable className="wide-card">

                        <div className="cashflow-content">
                            <Line data={formattedCashFlow} />

                            <div className="cashflow-summary">
                                <div className="summary-item">
                                    <h3>Cash as on 01/04/2025</h3>
                                    <h2>₹0.00</h2>
                                </div>

                                <div className="summary-item">

                                    <h3 style={{ color: "red" }}>Incoming</h3>
                                    <h2>₹0.00 +</h2>
                                </div>

                                <div className="summary-item">
                                    <h3 >Outgoing</h3>
                                    <h2>₹0.00 -</h2>
                                </div>

                                <div className="summary-item">
                                    <h3>Cash as on 01/04/2025</h3>
                                    <h2>₹0.00 =</h2>
                                </div>
                            </div>
                        </div>

                    </Card>


                </div>

            </div>

        </>
    );


}

export default Dashboard;
