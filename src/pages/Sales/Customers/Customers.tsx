import Header from "../../../components/Header/Header";
import Navbar from "../../../components/Navbar/NavBar";
import { dashboardTabs } from "../../Dashboard/dashboard";
import "./customers.css"

const salesTabs = [
    { label: "Customers", path: "/sales/customers" },
    { label: "Quotes", path: "/quotes" },
    { label: "Sales Orders", path: "/sales-orders" },
    { label: "Delivery Challans", path: "/delivery-challans" },
    { label: "Invoices", path: "/invoices" },
    { label: "Payment Received", path: "/payment-received" },
    { label: "Payment Invoices", path: "/payment-invoices" },
    { label: "Credit Notes", path: "/credit-notes" },
];



function Sales() {
    return (
        <>
            <Header />
            <Navbar tabs={dashboardTabs} />
            <Navbar tabs={salesTabs} />

            
        </>
    )
}

export default Sales;