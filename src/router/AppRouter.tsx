import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard/dashboard';
import Customers from '../pages/Sales/Customers/Customers';
import AddCustomer from '../pages/Sales/Customers/AddCustomer/Add';
import ViewCustomer from '../pages/Sales/Customers/ViewCustomer/View';
import Quotes from '../pages/Sales/Quotes/Quotes';
import NotFound from '../components/NotFound/NotFound';
import AddQuotes from '../pages/Sales/Quotes/AddQuotes/AddQuotes';
import SalesOrders from '../pages/Sales/SalesOrders/salesOrders';
import AddSalesOrder from '../pages/Sales/SalesOrders/AddOrderSales/AddSalesOrders';
import DeliveryChallans from '../pages/Sales/DeliveryChallans/DeliveryChallans';
import AddDeliveryChallan from '../pages/Sales/DeliveryChallans/AddDeliveryChallan/AddDeliveryChallan';
import Invoices from '../pages/Sales/Invoices/Invoices';
import AddInvoice from '../pages/Sales/Invoices/AddInvoice/AddInvoice';
import PaymentReceived from '../pages/Sales/PaymentReceived/PaymentReceived';
// import AddRecurringInvoices from '../pages/Sales/PaymentInvoices/AddRecurringInvoive/AddRecurringInvoice';
import PaymentInvoices from '../pages/Sales/PaymentInvoices/PaymentInvoices';
import CreditNote from '../pages/Sales/CreditNotes/CreditNotes';
import AddCreditNote from '../pages/Sales/CreditNotes/AddCreditNotes/AddCreditNote';
import RecordPayment from '../pages/Sales/PaymentReceived/RecordPayment/RecordPayment';
import AddVendor from '../pages/Purcheses/Vendors/AddVendor/AddVendor';
import Vendors from '../pages/Purcheses/Vendors/Vendors';
import ViewVendor from '../pages/Purcheses/Vendors/ViewVendor/ViewVerndor';
import ManualJournal from '../pages/Accountant/ManualJournal/ManualJournal';
import AddJournal from '../pages/Accountant/ManualJournal/AddManualJournal/AddJournal';
import ViewJournal from '../pages/Accountant/ManualJournal/ViewJournal/ViewJournal';
import CurrencyAdjustments from '../pages/Accountant/CurrencyAdjustments/CurrencyAdjustment';
import ChartsOfAccounts from '../pages/Accountant/ChartsOfAccounts/ChartsOfAccounts';
import BulkUpdate from '../pages/Accountant/BulkUpdate/BulkUpdate';
import Budgets from '../pages/Accountant/Budgets/Budgets';
import AddBudget from '../pages/Accountant/Budgets/AddBudget.tsx/AddBudget';
import CalculateBudget from '../pages/Accountant/Budgets/CalculateBudget/CalculateBudget';
import TransactionLocking from '../pages/Accountant/TransactionLocking/TransactionLocking';
import Expenses from '../pages/Purcheses/Expenses/Expenses';
import AddExpense from '../pages/Purcheses/Expenses/AddExpense/AddExpense';
import RecurringExpenses from '../pages/Purcheses/RecurringExpenses/RecurringExpenses';
import AddRecurringExpense from '../pages/Purcheses/RecurringExpenses/AddRecurringExpenses/AddRecurringExpense';
import PurchaseOrders from '../pages/Purcheses/PurchaseOrders/PurchaseOrders';
import AddPurchaseOrder from '../pages/Purcheses/PurchaseOrders/AddPurchaseorder/AddPurchaseOrder';
import Bills from '../pages/Purcheses/Bills/Bills';
import AddBill from '../pages/Purcheses/Bills/AddBill/AddBill';
import RecurringBills from '../pages/Purcheses/RecurringBills/RecurringBills';
import AddrecurringBill from '../pages/Purcheses/RecurringBills/AddRecurringBills/AddRecurringBill';
import PaymentMade from '../pages/Purcheses/PaymentsMade/PaymentsMade';
import AddPaymentMade from '../pages/Purcheses/PaymentsMade/AddPaymentMade/AddPaymentMade';
import VendorCredit from '../pages/Purcheses/VendorCredit/VendorCredit';
import AddVendorCredit from '../pages/Purcheses/VendorCredit/AddVendorCredit/AddVendorCredit';
// import MasterSetup from '../pages/Society/MasterSetup';
import AddRecurringInvoices from '../pages/Sales/PaymentInvoices/AddRecurringInvoive/AddRecurringInvoice';
import AddMasterSetup from '../pages/Society/MasterSetup/AddMasterSetup/AddMasterSetup';
import MasterSetup from '../pages/Society/MasterSetup/MasterSetup';
import MemeberManagement from '../pages/Society/MemberManagement/MemberManagement';
import MemberManagementForm from '../pages/Society/MemberManagement/MemberManagementForm/MemberManagementform';
import MaintenanceManagement from '../pages/Society/MaintenanceManagement/MaintenanceManagement';
import MaintenanceManagementForm from '../pages/Society/MaintenanceManagement/MaintenanceManagementForm/MaintenanceManagementform';
import Budgeting from '../pages/Society/Budgeting/Budgeting';
import AddBudgeting from '../pages/Society/Budgeting/AddBudgeting/AddBudgeting';
import ReportsAndAnalytics from '../pages/Society/ReportsAndAnalytics/ReportsAndAnalytics';
import AddReportAndAnalytics from '../pages/Society/ReportsAndAnalytics/AddReportAndAnalytics/AddReportAndAnalytics';
import Reporting from '../pages/Reporting/Reporting';
import CreateReport from '../pages/Reporting/CreateReport/CreateReport';
import CreateCustomReport from '../pages/Reporting/CreateReport/CreateCustomReport';

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

      {/* PURCHESES ROUTES */}

      <Route path="/purchases" element={<Navigate to="/purchases/vendors" replace />} />
      <Route path="/purchases/vendors" element={<Vendors />} />

      <Route path="/purchases/add-vendor" element={<AddVendor />} />
      <Route path="/purchases/view-vendor" element={<ViewVendor />} />

      <Route path="/purchases/expense" element={<Expenses />} />
      <Route path="/purchases/add-expense" element={<AddExpense />} />

      <Route path="/purchases/recurring-expenses" element={<RecurringExpenses />} />
      <Route path="/purchases/add-recurringExpenses" element={<AddRecurringExpense />} />

      <Route path="/purchases/PurchaseOrders" element={<PurchaseOrders />} />
      <Route path="/purchases/add-purchaseOrders" element={<AddPurchaseOrder />} />

      <Route path="/purchases/bills" element={<Bills />} />
      <Route path="/purchases/add-bill" element={<AddBill />} />

      <Route path="/purchases/payment-made" element={<PaymentMade />} />
      <Route path="/purchases/add-paymentMade" element={<AddPaymentMade />} />

      <Route path="/purchases/recurringBills" element={<RecurringBills />} />
      <Route path="/purchases/add-recurringBill" element={<AddrecurringBill />} />

      <Route path="/purchases/vendor-credit" element={<VendorCredit />} />
      <Route path="/purchases/add-vendorCredit" element={<AddVendorCredit />} />

      {/* ACCOUNTANT ROUTES */}
      <Route path="/accountant" element={<Navigate to="/accountant/manual-journal" replace />} />
      <Route path="/accountant/manual-journal" element={<ManualJournal />} />
      <Route path="/accountant/add-manualJournal" element={<AddJournal />} />

      <Route path="/accountant/view-journal/:id" element={<ViewJournal />} />

      <Route path="/accountant/bulk-update" element={<BulkUpdate />} />

      <Route path="/accountant/currency-adjustments" element={<CurrencyAdjustments />} />

      <Route path="/accountant/charts-of-accounts" element={<ChartsOfAccounts />} />

      <Route path="/accountant/budgets" element={<Budgets />} />
      <Route path="/accountant/add-budgets" element={<AddBudget />} />
      <Route path="/accountant/calculate-budget" element={<CalculateBudget />} />

      <Route path="/accountant/transaction-locking" element={<TransactionLocking />} />



      {/* SOCIETY */}

      <Route path="/society" element={<Navigate to="/society/master-setup" replace />} />

      <Route path="/society/master-setup" element={<MasterSetup />} />
      <Route path="/society/add-masteSetup" element={<AddMasterSetup />} />

      <Route path="/society/member-management" element={<MemeberManagement />} />
      <Route path="/society/member-management-form" element={<MemberManagementForm />} />

      <Route path="/society/maintenance-management" element={<MaintenanceManagement />} />
      <Route path="/society/maintenance-management-form" element={<MaintenanceManagementForm />} />

      <Route path="/society/budgeting" element={<Budgeting />} />
      <Route path="/society/add-budgeting" element={<AddBudgeting />} />

      <Route path="/society/Reports-Analytics" element={<ReportsAndAnalytics />} />
      <Route path="/society/add-reportAnalytics" element={<AddReportAndAnalytics />} />

      {/* REPORTING */}
      <Route path="/reporting" element={<Reporting />} />
      <Route path="/reporting/create-report" element={<CreateReport />} />
      <Route path="/reporting/create-custom-report/profitloss" element={<CreateCustomReport />} />



    </Routes>
  );
}

export default AppRouter;
