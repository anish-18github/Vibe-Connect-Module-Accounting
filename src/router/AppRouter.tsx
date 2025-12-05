import { Routes, Route, Navigate } from "react-router-dom";
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
import PaymentReceived from "../pages/Sales/PaymentReceived/PaymentReceived";
import AddRecurringInvoices from "../pages/Sales/PaymentInvoices/AddRecurringInvoive/AddRecurringInvoice";
import PaymentInvoices from "../pages/Sales/PaymentInvoices/PaymentInvoices";
import CreditNote from "../pages/Sales/CreditNotes/CreditNotes";
import AddCreditNote from "../pages/Sales/CreditNotes/AddCreditNotes/AddCreditNote";
import RecordPayment from "../pages/Sales/PaymentReceived/RecordPayment/RecordPayment";
import AddVendor from "../pages/Purcheses/Vendors/AddVender/AddVendor";
import Vendors from "../pages/Purcheses/Vendors/Vendors";
import ViewVendor from "../pages/Purcheses/Vendors/ViewVender/ViewVernder";
import ManualJournal from "../pages/Accountant/ManualJournal/ManualJournal";
import AddJournal from "../pages/Accountant/ManualJournal/AddManualJournal/AddJournal";
import ViewJournal from "../pages/Accountant/ManualJournal/ViewJournal/ViewJournal";
import CurrencyAdjustments from "../pages/Accountant/CurrencyAdjustments/CurrencyAdjustment";
import ChartsOfAccounts from "../pages/Accountant/ChartsOfAccounts/ChartsOfAccounts";
import BulkUpdate from "../pages/Accountant/BulkUpdate/BulkUpdate";

function AppRouter() {
    return (
        <Routes>
            <Route path="*" element={<NotFound />} />

            <Route path="/" element={<Dashboard />} />

            {/* SALES ROUTES */}

            {/* Redirect /sales → /sales/customers */}
            <Route path="/sales" element={<Navigate to="/sales/customers" replace />} />

            <Route path="/sales/customers" element={<Customers />} />
            <Route path="/sales/add-customer" element={<AddCustomer />} />
            <Route path="/sales/view-customer/:id" element={<ViewCustomer />} />

            <Route path="/sales/quotes" element={<Quotes />} />
            <Route path="/sales/add-quotes" element={<AddQuotes />} />

            <Route path="/sales/sales-orders" element={<SalesOrders />} />
            <Route path="/sales/add-salesOrders" element={<AddSalesOrder />} />

            <Route path="/sales/delivery-challans" element={<DeliveryChallans />} />
            <Route path="/sales/add-deliveryChallans" element={<AddDeliveryChallan />} />

            <Route path="/sales/invoices" element={<Invoices />} />
            <Route path="/sales/add-invoice" element={<AddInvoice />} />

            <Route path="/sales/payment-received" element={<PaymentReceived />} />
            <Route path="/sales/record-payment" element={<RecordPayment />} />

            <Route path="/sales/payment-invoices" element={<PaymentInvoices />} />
            <Route path="/sales/add-recurringInvoice" element={<AddRecurringInvoices />} />

            <Route path="/sales/credit-notes" element={<CreditNote />} />
            <Route path="/sales/add-creditNote" element={<AddCreditNote />} />

            <Route path="/purchases" element={<Navigate to="/purchases/vendors" replace />} />
            <Route path="/purchases/vendors" element={<Vendors />} />

            <Route path="/purchases/add-vendor" element={<AddVendor />} />

            <Route path="/purchases/view-vendor" element={<ViewVendor />} />

            {/* ACCOUNTANT ROUTES */}
            <Route path="/accountant" element={<Navigate to="/accountant/manual-journal" replace />} />
            <Route path="/accountant/manual-journal" element={<ManualJournal />} />
            <Route path="/accountant/add-manualJournal" element={<AddJournal />} />

            <Route path="/accountant/view-journal/:id" element={<ViewJournal />} />

            <Route path="/accountant/bulk-update" element={<BulkUpdate />} />

            <Route path="/accountant/currency-adjustments" element={<CurrencyAdjustments />} />

            <Route path="/accountant/charts-of-accounts" element={<ChartsOfAccounts />} />

        </Routes>
    );
}

export default AppRouter;
