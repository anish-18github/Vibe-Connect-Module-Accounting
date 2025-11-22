import Header from "../../../components/Header/Header";
import Navbar from "../../../components/Navbar/NavBar";
import DynamicTable from "../../../components/Table/DynamicTable";
import { dashboardTabs } from "../../Dashboard/dashboard";


import "./customers.css"
import { useNavigate } from "react-router-dom";

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

const columns = [
    { key: "customerId", label: "Customer ID" },
    { key: "name", label: "Name" },
    { key: "customerType", label: "Customer Type" },
    { key: "createdOn", label: "Created On" },
    { key: "createdBy", label: "Created By" }
];

const customers = [
    {
        customerId: "CUST1",
        name: "John Doe",
        customerType: "Retail",
        createdOn: "01/01/2025",
        createdBy: "Admin"
    },
    {
        customerId: "CUST1",
        name: "John Doe",
        customerType: "Retail",
        createdOn: "01/01/2025",
        createdBy: "Admin"
    },
    {
        customerId: "CUST1",
        name: "John Doe",
        customerType: "Retail",
        createdOn: "01/01/2025",
        createdBy: "Admin"
    },
    {
        customerId: "CUST1",
        name: "John Doe",
        customerType: "Retail",
        createdOn: "01/01/2025",
        createdBy: "Admin"
    },
    {
        customerId: "CUST1",
        name: "John Doe",
        customerType: "Retail",
        createdOn: "01/01/2025",
        createdBy: "Admin"
    },
    {
        customerId: "CUST1",
        name: "John Doe",
        customerType: "Retail",
        createdOn: "01/01/2025",
        createdBy: "Admin"
    },
    {
        customerId: "CUST1",
        name: "John Doe",
        customerType: "Retail",
        createdOn: "01/01/2025",
        createdBy: "Admin"
    },
    {
        customerId: "CUST1",
        name: "John Doe",
        customerType: "Retail",
        createdOn: "01/01/2025",
        createdBy: "Admin"
    },
    {
        customerId: "CUST1",
        name: "John Doe",
        customerType: "Retail",
        createdOn: "01/01/2025",
        createdBy: "Admin"
    },
    {
        customerId: "CUST1",
        name: "John Doe",
        customerType: "Retail",
        createdOn: "01/01/2025",
        createdBy: "Admin"
    },
    {
        customerId: "CUST1",
        name: "John Doe",
        customerType: "Retail",
        createdOn: "01/01/2025",
        createdBy: "Admin"
    },
    {
        customerId: "CUST1",
        name: "John Doe",
        customerType: "Retail",
        createdOn: "01/01/2025",
        createdBy: "Admin"
    },
    {
        customerId: "CUST1",
        name: "John Doe",
        customerType: "Retail",
        createdOn: "01/01/2025",
        createdBy: "Admin"
    },
    {
        customerId: "CUST1",
        name: "John Doe",
        customerType: "Retail",
        createdOn: "01/01/2025",
        createdBy: "Admin"
    },
    {
        customerId: "CUST1",
        name: "John Doe",
        customerType: "Retail",
        createdOn: "01/01/2025",
        createdBy: "Admin"
    },
    {
        customerId: "CUST1",
        name: "John Doe",
        customerType: "Retail",
        createdOn: "01/01/2025",
        createdBy: "Admin"
    },
    {
        customerId: "CUST1",
        name: "John Doe",
        customerType: "Retail",
        createdOn: "01/01/2025",
        createdBy: "Admin"
    },
    {
        customerId: "CUST1",
        name: "John Doe",
        customerType: "Retail",
        createdOn: "01/01/2025",
        createdBy: "Admin"
    },
    {
        customerId: "CUST1",
        name: "John Doe",
        customerType: "Retail",
        createdOn: "01/01/2025",
        createdBy: "Admin"
    },
    {
        customerId: "CUST1",
        name: "John Doe",
        customerType: "Retail",
        createdOn: "01/01/2025",
        createdBy: "Admin"
    },
    {
        customerId: "CUST1",
        name: "John Doe",
        customerType: "Retail",
        createdOn: "01/01/2025",
        createdBy: "Admin"
    },
    {
        customerId: "CUST1",
        name: "John Doe",
        customerType: "Retail",
        createdOn: "01/01/2025",
        createdBy: "Admin"
    },
    {
        customerId: "CUST1",
        name: "John Doe",
        customerType: "Retail",
        createdOn: "01/01/2025",
        createdBy: "Admin"
    },
    {
        customerId: "CUST1",
        name: "John Doe",
        customerType: "Retail",
        createdOn: "01/01/2025",
        createdBy: "Admin"
    },
    {
        customerId: "CUST1",
        name: "John Doe",
        customerType: "Retail",
        createdOn: "01/01/2025",
        createdBy: "Admin"
    },
    {
        customerId: "CUST1",
        name: "John Doe",
        customerType: "Retail",
        createdOn: "01/01/2025",
        createdBy: "Admin"
    },
    {
        customerId: "CUST1",
        name: "John Doe",
        customerType: "Retail",
        createdOn: "01/01/2025",
        createdBy: "Admin"
    },
    {
        customerId: "CUST1",
        name: "John Doe",
        customerType: "Retail",
        createdOn: "01/01/2025",
        createdBy: "Admin"
    },
    {
        customerId: "CUST1",
        name: "John Doe",
        customerType: "Retail",
        createdOn: "01/01/2025",
        createdBy: "Admin"
    },
    {
        customerId: "CUST1",
        name: "John Doe",
        customerType: "Retail",
        createdOn: "01/01/2025",
        createdBy: "Admin"
    },
    {
        customerId: "CUST1",
        name: "John Doe",
        customerType: "Retail",
        createdOn: "01/01/2025",
        createdBy: "Admin"
    },
    {
        customerId: "CUST1",
        name: "John Doe",
        customerType: "Retail",
        createdOn: "01/01/2025",
        createdBy: "Admin"
    },
    {
        customerId: "CUST1",
        name: "John Doe",
        customerType: "Retail",
        createdOn: "01/01/2025",
        createdBy: "Admin"
    },
    {
        customerId: "CUST1",
        name: "John Doe",
        customerType: "Retail",
        createdOn: "01/01/2025",
        createdBy: "Admin"
    },
    {
        customerId: "CUST1",
        name: "John Doe",
        customerType: "Retail",
        createdOn: "01/01/2025",
        createdBy: "Admin"
    },
    {
        customerId: "CUST1",
        name: "John Doe",
        customerType: "Retail",
        createdOn: "01/01/2025",
        createdBy: "Admin"
    },
    {
        customerId: "CUST1",
        name: "John Doe",
        customerType: "Retail",
        createdOn: "01/01/2025",
        createdBy: "Admin"
    },
    {
        customerId: "CUST1",
        name: "John Doe",
        customerType: "Retail",
        createdOn: "01/01/2025",
        createdBy: "Admin"
    },
    {
        customerId: "CUST1",
        name: "John Doe",
        customerType: "Retail",
        createdOn: "01/01/2025",
        createdBy: "Admin"
    },
    {
        customerId: "CUST1",
        name: "John Doe",
        customerType: "Retail",
        createdOn: "01/01/2025",
        createdBy: "Admin"
    },
    {
        customerId: "CUST1",
        name: "John Doe",
        customerType: "Retail",
        createdOn: "01/01/2025",
        createdBy: "Admin"
    },
    {
        customerId: "CUST1",
        name: "John Doe",
        customerType: "Retail",
        createdOn: "01/01/2025",
        createdBy: "Admin"
    },
    {
        customerId: "CUST1",
        name: "John Doe",
        customerType: "Retail",
        createdOn: "01/01/2025",
        createdBy: "Admin"
    },
    {
        customerId: "CUST1",
        name: "John Doe",
        customerType: "Retail",
        createdOn: "01/01/2025",
        createdBy: "Admin"
    },
    {
        customerId: "CUST1",
        name: "John Doe",
        customerType: "Retail",
        createdOn: "01/01/2025",
        createdBy: "Admin"
    },
    {
        customerId: "CUST1",
        name: "John Doe",
        customerType: "Retail",
        createdOn: "01/01/2025",
        createdBy: "Admin"
    },
    {
        customerId: "CUST1",
        name: "John Doe",
        customerType: "Retail",
        createdOn: "01/01/2025",
        createdBy: "Admin"
    },
    {
        customerId: "CUST1",
        name: "John Doe",
        customerType: "Retail",
        createdOn: "01/01/2025",
        createdBy: "Admin"
    },
];



function Customer() {

    const navigate = useNavigate();
    

    return (
        <>
            <Header />
            <Navbar tabs={dashboardTabs} />
            <Navbar tabs={salesTabs} />

            <div className="container mt-3">
                <DynamicTable
                    columns={columns}
                    data={customers}
                    actions={true}
                    rowsPerPage={10}
                    onAdd={() => navigate("/add-customer")}
                />
            </div>

        </>
    )
}

export default Customer;