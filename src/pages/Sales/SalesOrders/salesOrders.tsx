import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header/Header";
import Navbar from "../../../components/Navbar/NavBar";
import { dashboardTabs } from "../../Dashboard/dashboard";
import { salesTabs } from "../Customers/Customers";
import { useEffect, useState } from "react";
import DynamicTable from "../../../components/Table/DynamicTable";

const SalesOrders = () => {

    const columns = [
        { key: "name", label: "Name" },
        { key: "anc", label: "ABC" },
        { key: "createdOn", label: "Created On" },
        { key: "expiryOn", label: "Expiry On" },
        { key: "createdBy", label: "Created By" }
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
                    onAdd={() => navigate("/sales/add-salesOrders")}
                    onView={(row) => navigate(`/view-customer/${row.customerId}`)} />
            </div>

        </>
    )
}

export default SalesOrders;