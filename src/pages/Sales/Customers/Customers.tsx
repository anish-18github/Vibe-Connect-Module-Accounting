import { useEffect, useState } from 'react';
import Header from '../../../components/Header/Header';
import Navbar from '../../../components/Navbar/NavBar';
import DynamicTable from '../../../components/Table/DynamicTable';
import { dashboardTabs } from '../../Dashboard/dashboard';
import useFormSuccess from '../../../components/Toast/useFormSuccess';
import { Toast } from '../../../components/Toast/Toast';
import { useGlobalToast } from '../../../components/Toast/ToastContext';

import './customers.css';
import { useNavigate } from 'react-router-dom';

export const salesTabs = [
  { label: 'Customers', path: '/sales/customers' },
  { label: 'Quotes', path: '/sales/quotes' },
  { label: 'Sales Orders', path: '/sales/sales-orders' },
  { label: 'Delivery Challans', path: '/sales/delivery-challans' },
  { label: 'Invoices', path: '/sales/invoices' },
  { label: 'Payment Received', path: '/sales/payment-received' },
  { label: 'Payment Invoices', path: '/sales/payment-invoices' },
  { label: 'Credit Notes', path: '/sales/credit-notes' },
];

const columns = [
  { key: 'customerId', label: 'Customer ID' },
  { key: 'name', label: 'Name' },
  { key: 'customerType', label: 'Customer Type' },
  { key: 'createdOn', label: 'Created On' },
  { key: 'createdBy', label: 'Created By' },
];

function Customer() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<any[]>([]);
  const { toast, setToast } = useGlobalToast();
  useFormSuccess();

  // INFUTURE HERE'S GET API CALL
  // Load from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('customers') || '[]');
    setCustomers(stored);
  }, []);

  return (
    <>
      <Toast toast={toast} setToast={setToast} />
      <Header />

      <div style={{ padding: '56px 0px 0px' }}>
        <Navbar tabs={dashboardTabs} />
        <Navbar tabs={salesTabs} />

        <div className=" mt-3">
          <DynamicTable
            columns={columns}
            data={customers}
            actions={true}
            rowsPerPage={10}
            onAdd={() => navigate('/sales/add-customer')} //May be change it latter. "/add-customer"
            onView={(row) => navigate(`/sales/view-customer/${row.customerId}`)}
          />
        </div>
      </div>
    </>
  );
}

export default Customer;
