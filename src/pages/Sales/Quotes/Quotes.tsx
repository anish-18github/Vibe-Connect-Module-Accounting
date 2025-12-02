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
    const [quotes, setQuotes] = useState<any[]>([]);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("quotes") || "[]");

        const formatted = stored.map((q: any) => ({
            name: q.customerName,
            quote: q.quote?.quoteNumber || "N/A",
            createdOn: q.quoteDate,
            expiredOn: q.expiryDate,
            createdBy: q.salesPerson,
            customerId: q.customerId
        }));

        setQuotes(formatted);
    }, []);



    return (
        <>

            <Header />
            <Navbar tabs={dashboardTabs} />
            <Navbar tabs={salesTabs} />

            <div className="mt-3">
                <DynamicTable
                    columns={columns}
                    data={quotes}
                    actions={true}
                    rowsPerPage={10}
                    onAdd={() => navigate("/sales/add-quotes")}
                    onView={(row) => navigate(`/view-customer/${row.customerId}`)} />
            </div>

        </>
    );
}

export default Quotes;