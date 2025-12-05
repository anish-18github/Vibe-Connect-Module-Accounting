import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header/Header";
import Navbar from "../../../components/Navbar/NavBar";
import DynamicTable from "../../../components/Table/DynamicTable";
import { dashboardTabs } from "../../Dashboard/dashboard";
import { BookOpen } from "react-feather";


export const accountantTabs = [
    { label: "Manual Journal", path: "/accountant/manual-journal" },
    { label: "Bulk Update", path: "/sales/quotes" },
    { label: "Currency Adjustments", path: "/sales/sales-orders" },
    { label: "Chart of accounts", path: "/sales/delivery-challans" },
    { label: "Budgets", path: "/sales/invoices" },
    { label: "Transaction Locking", path: "/sales/payment-received" },
];

const columns = [
    { key: "journal", label: "Journal" },
    { key: "referenceNo", label: "Reference No" },
    { key: "status", label: "Status" },
    { key: "notes", label: "Notes" },
    { key: "amount", label: "Amount" },
    { key: "createdOn", label: "Created On" },
    { key: "createdBy", label: "Created By" }
];

const ManualJournal = () => {

    const navigate = useNavigate();
    const [journals, setJournals] = useState<any[]>([]);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("journals") || "[]");

        const mapped = stored.map((j: any) => ({
            ...j,
            // if you still want to show text, wrap it next to the icon
            notes: (
                <span className="d-inline-flex align-items-center gap-1">
                    <BookOpen size={14} className="text-primary" />
                    <span>{j.notes || ""}</span>
                </span>
            ),
        }));

        setJournals(mapped);
    }, []);


    return (
        <>
            <Header />
            <Navbar tabs={dashboardTabs} />
            <Navbar tabs={accountantTabs} />

            <div className=" mt-3">
                <DynamicTable
                    columns={columns}
                    data={journals}
                    actions={true}
                    rowsPerPage={10}
                    onAdd={() => navigate("/accountant/add-manualJournal")}
                    onView={(row) => navigate(`/sales/view-customer/${row.customerId}`)} />
            </div>

        </>
    );
}



export default ManualJournal;