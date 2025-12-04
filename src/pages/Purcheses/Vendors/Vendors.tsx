import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header/Header";
import Navbar from "../../../components/Navbar/NavBar";
import DynamicTable from "../../../components/Table/DynamicTable";
import { dashboardTabs } from "../../Dashboard/dashboard";

export const parchasesTabs = [
    { label: "Vender", path: "/purchases/vendors" },
    { label: "Expenses", path: "/sales/quotes" },
    { label: "Recurring Expenses", path: "/sales/sales-orders" },
    { label: "Purchase Orders", path: "/sales/delivery-challans" },
    { label: "Bills", path: "/sales/invoices" },
    { label: "Payment Made", path: "/sales/payment-received" },
    { label: "Recurring Bills", path: "/sales/payment-invoices" },
    { label: "Vender Credits", path: "/sales/credit-notes" },
];

export const columns = [
    { key: "vendorId", label: "Vendor Id" },
    { key: "name", label: "Name" },
    { key: "paymentDuePeriod", label: "Customer Type" },
    { key: "createdOn", label: "Created On" },
    { key: "createdBy", label: "Created By" }
];

const Vendors = () => {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState<any[]>([]);




    // INFUTURE HERE'S GET API CALL
    // Load from localStorage
    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("customers") || "[]");
        setCustomers(stored);
    }, []);

    return (
        <>
            <Header />
            <Navbar tabs={dashboardTabs} />
            <Navbar tabs={parchasesTabs} />

            <div className=" mt-3">
                <DynamicTable
                    columns={columns}
                    data={customers}
                    actions={true}
                    rowsPerPage={10}
                    onAdd={() => navigate("/purchases/add-vendor")} //May be change it latter. "/add-customer"
                    onView={(row) => navigate(`/purchases/view-vendor`)} />
            </div>

        </>
    );
}

export default Vendors; 