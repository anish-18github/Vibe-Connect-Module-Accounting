import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard/dashboard";
import Customers from "../pages/Sales/Customers/Customers";
import AddCustomer from "../pages/Sales/Customers/AddCustomer/Add";
import ViewCustomer from "../pages/Sales/Customers/ViewCustomer/View";
import Quotes from "../pages/Sales/Quotes/Quotes";
import NotFound from "../components/NotFound/NotFound";
import AddQuotes from "../pages/Sales/Quotes/AddQuotes/AddQuotes";

function AppRouter() {
    return (
        <Routes>
            <Route path="*" element={<NotFound />} />

            <Route path="/" element={<Dashboard />} />
            
            <Route path="/sales" element={<Customers />} /> 
             
            <Route path="/sales/customers" element={<Customers />} />
            {/* <Route path="/sales/quotes" element={<Quotes />} /> */}
            <Route path="/add-customer" element={<AddCustomer />} />
            <Route path="/view-customer/:id" element={<ViewCustomer />} />

            <Route path="/sales/quotes" element={<Quotes />} />
            <Route path="/add-quotes" element={<AddQuotes />} />



        </Routes>

    );
}

export default AppRouter;
