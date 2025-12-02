import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header/Header";
import Navbar from "../../../components/Navbar/NavBar";
import DynamicTable from "../../../components/Table/DynamicTable";
import { dashboardTabs } from "../../Dashboard/dashboard";
import { salesTabs } from "../Customers/Customers";

const Invoices = () => {
    const columns = [
        { key: "name", label: "Name" },
        { key: "deliveryChallanNo", label: "Delivery Challan No." },
        { key: "type", label: "Type" },
        { key: "date", label: "Date" },
        { key: "reference", label: "Reference" }
    ];

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
            <Navbar tabs={salesTabs} />


            <div className=" mt-3">
                <DynamicTable
                    columns={columns}
                    data={customers}
                    actions={true}
                    rowsPerPage={10}
                    onAdd={() => navigate("/sales/add-invoice")} //May be change it latter. "/add-customer"
                    onView={(row) => navigate(`/view-customer/${row.customerId}`)} />
            </div>

        </>
    )
}

export default Invoices;