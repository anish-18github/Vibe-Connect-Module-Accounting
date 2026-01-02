type Crumb =
    | string
    | ((state?: any) => string);

export const breadcrumbMap: Record<string, Crumb> = {
    "/": "Dashboard",

    // SALES
    "/sales": "Sales",
    "/sales/customers": "Customers",
    "/sales/add-customer": "Add Customer",
    "/sales/view-customer/:id": (state) =>  
        state?.customerName || "Customer Details",

    "/sales/quotes": "Quotes",
    "/sales/add-quotes": "Add Quote",

    "/sales/sales-orders": "Sales Orders",
    "/sales/add-salesOrders": "Add Sales Order",

    "/sales/delivery-challans": "Delivery Challans",
    "/sales/add-deliveryChallans": "Add Delivery Challan",

    "/sales/invoices": "Invoices",
    "/sales/add-invoice": "Add Invoice",

    // PURCHASES
    "/purchases": "Purchases",
    "/purchases/vendors": "Vendors",
    "/purchases/add-vendor": "Add Vendor",

    // ACCOUNTANT
    "/accountant": "Accountant",
    "/accountant/manual-journal": "Manual Journal",
    "/accountant/add-manualJournal": "Add Journal",
    "/accountant/view-journal/:id": "View Journal",

    // SOCIETY
    "/society": "Society",
    "/society/master-setup": "Master Setup",
    "/society/add-masteSetup": "Add Master Setup",

    // REPORTING
    "/reporting": "Reporting",
    "/reporting/create-custom-report/profitloss": "Create Report",
    "/reporting/final-report": "Final Report",
};
