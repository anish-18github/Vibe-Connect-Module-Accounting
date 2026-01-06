import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/Header/Header';
import Navbar from '../../../components/Navbar/NavBar';
import DynamicTable from '../../../components/Table/DynamicTable';
import { dashboardTabs } from '../../Dashboard/dashboard';
import useFormSuccess from '../../../components/Toast/useFormSuccess';
import { Toast } from '../../../components/Toast/Toast';
import { useGlobalToast } from '../../../components/Toast/ToastContext';

export const parchasesTabs = [
  { label: 'Vendor', path: '/purchases/vendors' },
  { label: 'Expenses', path: '/purchases/expense' },
  { label: 'Recurring Expenses', path: '/purchases/recurring-expenses' },
  { label: 'Purchase Orders', path: '/purchases/PurchaseOrders' },
  { label: 'Bills', path: '/purchases/bills' },
  { label: 'Recurring Bills', path: '/purchases/recurringBills' },
  { label: 'Payment Made', path: '/purchases/payment-made' }, //yet to be done
  { label: 'Vender Credits', path: '/purchases/vendor-credit' },
];

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'companyName', label: 'Company Name' },
  { key: 'email', label: 'Email' },
  { key: 'workPhone', label: 'work Phone' },
  { key: 'createdOn', label: 'Created On' },
  { key: 'createdBy', label: 'Created By' },
];

const Vendors = () => {
  const { toast, setToast } = useGlobalToast();
  useFormSuccess();
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<any[]>([]);

  // INFUTURE HERE'S GET API CALL
  // Load from localStorage
  useEffect(() => {
    // const stored = JSON.parse(localStorage.getItem('customers') || '[]');
    // setCustomers(stored);
  }, []);

  return (
    <>
      <Toast toast={toast} setToast={setToast} />
      <Header />
      <div style={{ padding: '56px 0px 0px' }}>
        <Navbar tabs={dashboardTabs} />
        <Navbar tabs={parchasesTabs} />

        <div className=" mt-3">
          <DynamicTable
            columns={columns}
            data={customers}
            actions={true}
            rowsPerPage={10}
            onAdd={() => navigate('/purchases/add-vendor')} //May be change it latter. "/add-customer"
            onView={(row) => navigate(`/purchases/view-vendor`)}
          />
        </div>
      </div>
    </>
  );
};

export default Vendors;
