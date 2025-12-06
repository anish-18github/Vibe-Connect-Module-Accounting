import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header/Header";
import Navbar from "../../../components/Navbar/NavBar";
import DynamicTable from "../../../components/Table/DynamicTable";
import { dashboardTabs } from "../../Dashboard/dashboard";
import { accountantTabs } from "../ManualJournal/ManualJournal";

const columns = [
    { key: "name", label: "Name" },
    { key: "fiscalYear", label: "Fiscal Year" },
    { key: "budgetPeriod", label: "Budget Period" },
];

const Budgets = () => {

    const navigate = useNavigate();
    const [budgets, setBudgets] = useState<any[]>([]);




    // INFUTURE HERE'S GET API CALL
    // Load from localStorage
    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("budgets") || "[]");
        setBudgets(stored);
    }, []);

    return (
        <>

            <Header />

            <Navbar tabs={dashboardTabs} />
            <Navbar tabs={accountantTabs} />

            <div className=" mt-3">
                <DynamicTable
                    columns={columns}
                    data={budgets}
                    actions={true}
                    rowsPerPage={10}
                    onAdd={() => navigate("/accountant/add-budgets")} //May be change it latter. "/add-customer"
                    onView={(row) => navigate(`/purchases/view-vendor/${row.customerId}`)} />
            </div>

        </>
    )
}

export default Budgets;