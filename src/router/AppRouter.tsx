import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard/dashboard";
import Customers from "../pages/Sales/Customers/Customers";
import AddCustomer from "../pages/Sales/Customers/AddCustomer/Add";
import ViewCustomer from "../pages/Sales/Customers/ViewCustomer/View";
import Quotes from "../pages/Sales/Quotes/Quotes";
import NotFound from "../components/NotFound/NotFound";
import AddQuotes from "../pages/Sales/Quotes/AddQuotes/AddQuotes";
import SalesOrders from "../pages/Sales/SalesOrders/salesOrders";
import AddSalesOrder from "../pages/Sales/SalesOrders/AddOrderSales/AddSalesOrders";
import DeliveryChallans from "../pages/Sales/DeliveryChallans/DeliveryChallans";
import AddDeliveryChallan from "../pages/Sales/DeliveryChallans/AddDeliveryChallan/AddDeliveryChallan";
import Invoices from "../pages/Sales/Invoices/Invoices";
import AddInvoice from "../pages/Sales/Invoices/AddInvoice/AddInvoice";

function AppRouter() {
    return (
        <Routes>
            <Route path="*" element={<NotFound />} />

            <Route path="/" element={<Dashboard />} />



            {/*SALES ROUTES  */}
            <Route path="/sales" element={<Customers />} />
            <Route path="/sales/customers" element={<Customers />} />
            {/* <Route path="/sales/quotes" element={<Quotes />} /> */}
            <Route path="/add-customer" element={<AddCustomer />} />
            <Route path="/view-customer/:id" element={<ViewCustomer />} />

            <Route path="/sales/quotes" element={<Quotes />} />
            <Route path="/sales/add-quotes" element={<AddQuotes />} />

            <Route path="/sales/sales-orders" element={<SalesOrders />} />
            <Route path="/sales/add-salesOrders" element={<AddSalesOrder />} />


            <Route path="/sales/delivery-challans" element={<DeliveryChallans />} />
            <Route path="/sales/add-deliveryChallans" element={<AddDeliveryChallan />} />
            
            <Route path="/sales/invoices" element={<Invoices />} />
            <Route path="/sales/add-invoice" element={<AddInvoice />} />



        </Routes>

    );
}

export default AppRouter;