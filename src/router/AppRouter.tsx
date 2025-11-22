import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard/dashboard";
import Customers from "../pages/Sales/Customers/Customers";
function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/sales/customers" element={<Customers />} />
            {/* <Route path="/sales/quotes" element={<Quotes />} /> */}
        </Routes>

    );
}

export default AppRouter;
