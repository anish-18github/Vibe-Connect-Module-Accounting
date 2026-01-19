import { useEffect, useState } from 'react';
import Header from '../../../components/Header/Header';
import Navbar from '../../../components/Navbar/NavBar';
import DynamicTable from '../../../components/Table/DynamicTable';
import { dashboardTabs } from '../../Dashboard/dashboard';
import { Toast } from '../../../components/Toast/Toast';
import { useGlobalToast } from '../../../components/Toast/ToastContext';
import { useNavigate } from 'react-router-dom';

import './customers.css';
import type { Customer } from '../../../types/customer';
import api from '../../../services/api/apiConfig';

export const salesTabs = [
  { label: 'Customers', path: '/sales/customers' },
  { label: 'Quotes', path: '/sales/quotes' },
  { label: 'Sales Orders', path: '/sales/sales-orders' },
  { label: 'Invoices', path: '/sales/invoices' },
  { label: 'Recurring Invoices', path: '/sales/payment-invoices' },
  { label: 'Delivery Challans', path: '/sales/delivery-challans' },
  { label: 'Payment Received', path: '/sales/payment-received' },
  { label: 'Credit Notes', path: '/sales/credit-notes' },
];

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'companyName', label: 'Company Name' },
  { key: 'email', label: 'Email' },
  { key: 'customerType', label: 'Customer Type' },
  { key: 'createdOn', label: 'Created On' },
  { key: 'createdBy', label: 'Created By' },
];


function Customers() {
  const navigate = useNavigate();
  const { toast, setToast } = useGlobalToast();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ View handler (IMPORTANT)
  const handleViewCustomer = (row: Customer) => {
    navigate(`/sales/view-customer/${row.customerId}`, {
      state: {
        customerName: row.name,
      },
    });
  };

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await api.get<Customer[]>('customers/');
        setCustomers(response.data);
      } catch (error: any) {
        setToast({
          stage: 'enter',
          type: 'error',
          message:
            error.response?.data?.detail || 'Unable to load customers',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  return (
    <>
      <Toast toast={toast} setToast={setToast} />
      <Header />

      <div style={{ padding: '56px 0px 0px' }}>
        <Navbar tabs={dashboardTabs} />
        <Navbar tabs={salesTabs} />

        <div className="mt-3">
          <DynamicTable
            columns={columns}
            data={customers}
            loading={loading}
            actions
            rowsPerPage={10}
            onAdd={() => navigate('/sales/add-customer')}
            onView={handleViewCustomer}
          />
        </div>
      </div>
    </>
  );
}

export default Customers;
