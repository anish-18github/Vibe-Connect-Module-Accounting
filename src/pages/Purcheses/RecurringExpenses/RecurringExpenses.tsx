import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header/Header";
import Navbar from "../../../components/Navbar/NavBar";
import DynamicTable from "../../../components/Table/DynamicTable";
import { dashboardTabs } from "../../Dashboard/dashboard";
import { parchasesTabs } from "../Vendors/Vendors";
import { useState, useEffect } from "react";


const columns = [
    { key: "vendorId", label: "Vendor Id" },
    { key: "name", label: "Name" },
    { key: "paymentDuePeriod", label: "Customer Type" },
    { key: "createdOn", label: "Created On" },
    { key: "createdBy", label: "Created By" }
];

const RecurringExpenses = () => {

    const navigate = useNavigate();
    const [recurringExpenses, setRecurringExpenses] = useState<any[]>([]);




    // INFUTURE HERE'S GET API CALL
    // Load from localStorage
    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("recurringExpenses") || "[]");
        setRecurringExpenses(stored);
    }, []);

    return (
        <>
            <Header />

            <Navbar tabs={dashboardTabs} />
            <Navbar tabs={parchasesTabs} />

            <div className=" mt-3">
                <DynamicTable
                    columns={columns}
                    data={recurringExpenses}
                    actions={true}
                    rowsPerPage={10}
                    onAdd={() => navigate("/purchases/add-recurringExpenses")} //May be change it latter. "/add-customer"
                    onView={(row) => navigate(`/purchases/view-vendor`)} />
            </div>
        </>
    )
}

export default RecurringExpenses;