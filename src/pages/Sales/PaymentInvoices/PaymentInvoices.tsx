import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header/Header";
import Navbar from "../../../components/Navbar/NavBar";
import { dashboardTabs } from "../../Dashboard/dashboard";
import { salesTabs } from "../Customers/Customers";
import DynamicTable from "../../../components/Table/DynamicTable";

const PaymentInvoices = () => {
    const columns = [
        { key: "invoice", label: "Invoice" },
        { key: "orderNumber", label: "Oreder Number" },
        { key: "customerName", label: "Customer Name" },
        { key: "status", label: "Status" },
        { key: "amount", label: "Amount" },
        { key: "balanceDue", label: "Balance Due" }
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

            <div style={{ padding: "56px 0px 0px" }}>



                <Navbar tabs={dashboardTabs} />
                <Navbar tabs={salesTabs} />


                <div className=" mt-3">
                    <DynamicTable
                        columns={columns}
                        data={customers}
                        actions={true}
                        rowsPerPage={10}
                        onAdd={() => navigate("/sales/add-recurringInvoice")} //May be change it latter. "/add-customer"
                        onView={(row) => navigate(`/view-customer/${row.customerId}`)} />
                </div>
            </div>


        </>
    )

}

export default PaymentInvoices;