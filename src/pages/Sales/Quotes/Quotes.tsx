import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header/Header";
import DynamicTable from "../../../components/Table/DynamicTable";
import { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar/NavBar";
import { salesTabs } from "../Customers/Customers";
import { dashboardTabs } from "../../Dashboard/dashboard";

const Quotes = () => {

    const columns = [
        { key: "name", label: "Name" },
        { key: "quote", label: "Quote" },
        { key: "createdOn", label: "Created On" },
        { key: "expiredOn", label: "Expire On" },
        { key: "createdBy", label: "Created By" }
    ];

    const navigate = useNavigate();
    const [customers, setCustomers] = useState<any[]>([]);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("customers") || "[]");
        setCustomers(stored);
    }, []);


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
                    onAdd={() => navigate("/add-quotes")}
                    onView={(row) => navigate(`/view-customer/${row.customerId}`)} />
            </div>

        </>
    );
}

export default Quotes;