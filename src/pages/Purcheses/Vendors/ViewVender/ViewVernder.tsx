import React from "react";
import Header from "../../../../components/Header/Header";
import Tabs from "../../../../components/Tab/Tabs";
import CommentBox from "../../../../components/ViewComponents/CommentBox";
import Transactions from "../../../../components/ViewComponents/Transactions";
import MailSystem from "../../../../components/ViewComponents/MailSystem";

export default function ViewVendor() {

    // const { id } = useParams<{ id: string }>();
    const [activeKey, setActiveKey] = React.useState("overview");

    // Overview Tab
    const renderOverview = () => (
        <div>

            <div className="mb-2">
                <p style={{ color: "#5E5E5E", margin: 0, fontSize: "14px" }}>
                    Payment Due Period
                </p>
                <p style={{ margin: 0, fontSize: "15px", fontWeight: 500 }}>
                    Due on Receipt
                </p>
            </div>

            <h5 className="fw-bold">Receivables</h5>

            <table className="table mt-3 rounded-table">
                <thead className="table-light">
                    <tr>
                        <th>Currency</th>
                        <th>Outstanding Receivables</th>
                        <th>Unused Credits</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>INR - Indian Rupee</td>
                        <td>₹0.00</td>
                        <td>₹0.00</td>
                    </tr>
                </tbody>
            </table>

            <h4 className="chart-header">Enter Opening Balance</h4>

            <div className="border rounded p-3 chart-container"
                style={{ background: "#FFFFFF" }}>

                {/* ROW: Income + helper text + dropdowns */}
                <div className="d-flex justify-content-between align-items-center">

                    {/* LEFT SIDE TEXT */}
                    <div className="d-flex align-items-center gap-2">
                        <h6 className="fw-bold mb-0">Income</h6>
                        <p className="text-muted mb-0" style={{ fontSize: "13px", whiteSpace: "nowrap" }}>
                            This chart is displayed in the organization base currency.
                        </p>
                    </div>

                    {/* RIGHT SIDE DROPDOWNS */}
                    <div className="d-flex gap-2">

                        {/* Last 6 months dropdown */}
                        <select className="form-select form-select-sm" style={{
                            color: "#0D6EFD",
                            width: "150px",
                            border: "none",
                            borderRight: "1px solid #D0D0D0", // Divider line
                            paddingRight: "12px"
                        }}>
                            <option>Last 6 Months</option>
                            <option>Last 12 Months</option>
                            <option>This Year</option>
                            <option>Last Year</option>
                        </select>

                        {/* Accrual dropdown (blue text) */}
                        <select
                            className="form-select form-select-sm"
                            style={{
                                width: "120px",
                                color: "#0D6EFD",
                                fontWeight: 500,
                                border: "none",
                                paddingLeft: "12px"
                            }}
                        >
                            <option value="accrual">Accrual</option>
                            <option value="cash">Cash</option>
                        </select>
                    </div>
                </div>

                {/* CHART AREA */}
                <div className="p-4 text-center text-muted" style={{ height: 160 }}>
                    Chart Placeholder
                </div>
            </div>

            <p className="mt-3" style={{ fontSize: "15px" }}>
                Total Income (Last 6 Months): <span className="fw-semibold">₹0.00</span>
            </p>
        </div>
    );

    const renderComments = () => <CommentBox />;

    const renderTransactions = () => (

        <Transactions
            section={{
                title: "Go to Transactions",
                children: [
                    {
                        title: "Invoices",
                        columns: ["Date", "Invoice Number", "Order Number", "Amount", "Balance Due", "Status"],
                        path: "/sales/add-invoice",
                        emptyMessage: "There are no invoices",
                        // invoiceData <- new Invoice form
                        data: [
                            ["12-11-25", "INV-587346598", 52364, "45,0000", "0", "Paid"],
                            ["03-12-25", "INV-897487347", 31209, "20,000", "20,000", "Over due"],
                        ]
                    },
                    {
                        title: "Customer Payments",
                        columns: ["Date", "Payment Number", "Reffrence Number", "Payment Mode", "Amount", "Unused Amount"],
                        path: "/add-invoice",
                        emptyMessage: "No payments have been received or recorded yet.",
                        data: [

                        ]
                    },
                    {
                        title: "Quotes",
                        columns: ["Date", "Quotes", "Reference Number", "Amount", "Status"],
                        path: "/sales/add-quotes",
                        emptyMessage: "There are no quotes.",
                        data: [

                        ]
                    },
                    {
                        title: "Sales Orders",
                        columns: ["Date", "Shipment Date", "Reference Number", "Sales Order", "Amount", "Status"],
                        path: "/sales/add-salesOrders",
                        emptyMessage: "There are no Sales Orders.",
                        data: [

                        ]
                    },
                    {
                        title: "Delivery Challans",
                        columns: ["Date", "Delivery Challan", "Reference Number", "Reference Number", "Status"],
                        path: "/sales/add-deliveryChallans",
                        emptyMessage: "There are no Delivery Challans.",
                        data: [

                        ]
                    },
                    {
                        title: "Recurring Invoices",
                        columns: ["Profile Name", "Frequency", "Last Invoice Date", "Next Invoice Date", "Status"],
                        path: "/sales/add-recurringInvoice",
                        emptyMessage: "There are no recurring invoices.",
                        data: [

                        ]
                    },
                    {
                        title: "Expenses",
                        columns: ["Date", "Expense Category", "Invoice Number", "Amount", "Status"],
                        path: "/add-invoice",
                        emptyMessage: "There are no expenses.",
                        data: [

                        ]
                    },
                    {
                        title: "Recurring Expenses",
                        columns: ["Profile Name", "Expense Category", "Frequency", "Last Invoice Date", "Next Invoice Date", "Status"],
                        path: "/add-invoice",
                        emptyMessage: "There are no recurring expenses.",
                        data: [

                        ]
                    },
                    {
                        title: "Journals",
                        columns: ["Date", "Journal Number", "Reference Number", "Debit", "Credit"],
                        path: "/add-invoice",
                        emptyMessage: "There are no journals created. ",
                        data: [

                        ]
                    },
                    {
                        title: "Bills",
                        columns: ["Date", "Bill", "Order Number", "Vendor Name", "Amount", "Customer associated Line Items total", "Balance Due"],
                        path: "/add-invoice",
                        emptyMessage: "There are no Bills.",
                        data: [

                        ]
                    },
                    {
                        title: "Credit Notes",
                        columns: ["Date", "Credit Note Number", "Reference Number", "Reference Number", "Status"],
                        path: "/sales/add-creditNote",
                        emptyMessage: "There are no Credit Note created.",
                        data: [

                        ]
                    }
                ]
            }}
        />



    );

    const renderMails = () => <MailSystem />;

    const renderStatements = () => <div>Statements content…</div>;

    const tabs = [
        { key: "overview", label: "Overview", content: renderOverview() },
        { key: "comments", label: "Comments", content: renderComments() },
        { key: "transactions", label: "Transactions", content: renderTransactions() },
        { key: "mails", label: "Mails", content: renderMails() },
        { key: "statements", label: "Statements", content: renderStatements() },
    ];

    const activeContent = tabs.find((t) => t.key === activeKey)?.content;

    return (

        <>

            <Header />

            <div className="container-fluid ">

                <div style={{ padding: "0 1rem" }}>

                    {/* Tabs Header */}
                    <Tabs
                        tabs={tabs}
                        defaultActiveKey="overview"
                        onChange={(key) => setActiveKey(key)}
                    />

                    <div className="row mt-4">

                        {/* LEFT STATIC CARD */}
                        <div className="col-md-3 pe-0">
                            <div className="customer-card shadow-sm p-3">

                                <div className="text-center mb-3">
                                    <div
                                        className="rounded-circle bg-secondary"
                                        style={{ width: 70, height: 70, margin: "auto" }}
                                    ></div>
                                    <h5 className="mt-2 fw-semibold">Mr. Ram</h5>
                                </div>

                                <div className="mb-3">
                                    <div className="section-title">Address</div>

                                    <div className="section-box">
                                        <p>Billing Address: <span className="text-primary">New Address</span></p>
                                        <p>Shipping Address: <span className="text-primary">New Address</span></p>
                                    </div>
                                </div>


                                <div className="mb-3">
                                    <div className="section-title">Other Details</div>

                                    <div className="section-box">
                                        <p>Customer Type: Individual</p>
                                        <p>Default Currency: INR</p>
                                        <p>Portal Status: Disabled</p>
                                        <p>Portal Language: English</p>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <div className="section-title">Contact</div>

                                    <div className="section-box">
                                        <p className="text-muted">No contact details</p>
                                    </div>
                                </div>


                                <div className="mb-3">
                                    <div className="section-title">Record Info</div>

                                    <div className="section-box">
                                        <p>Customer ID: 34</p>
                                        <p>Created On: 23/06/2025</p>
                                        <p>Created By: Admin</p>
                                    </div>
                                </div>


                            </div>
                        </div>

                        {/* RIGHT DYNAMIC CARD */}
                        <div className="col-md-9">
                            <div className="customer-card shadow-sm" style={{ padding: activeKey === "mails" ? 0 : "1.5rem" }}>
                                {activeContent}
                            </div>

                        </div>

                    </div>
                </div>




            </div>

        </>

    )

}