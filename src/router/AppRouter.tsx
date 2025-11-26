import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard/dashboard";
import Customers from "../pages/Sales/Customers/Customers";
import AddCustomer from "../pages/Sales/Customers/AddCustomer/Add";
import ViewCustomer from "../pages/Sales/Customers/ViewCustomer/View";

function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/sales/customers" element={<Customers />} />
            <Route path="/add-customer" element={<AddCustomer />} />
            <Route path="/view-customer/:id" element={<ViewCustomer />} />

            {/* <Route path="/sales/quotes" element={<Quotes />} /> */}
        </Routes>

    );
}

export default AppRouter;
