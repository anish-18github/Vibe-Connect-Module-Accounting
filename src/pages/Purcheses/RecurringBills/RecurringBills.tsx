import { useNavigate } from 'react-router-dom';
import Header from '../../../components/Header/Header';
import { useState, useEffect } from 'react';
import Navbar from '../../../components/Navbar/NavBar';
import DynamicTable from '../../../components/Table/DynamicTable';
import { dashboardTabs } from '../../Dashboard/dashboard';
import { parchasesTabs } from '../Vendors/Vendors';
import useFormSuccess from '../../../components/Toast/useFormSuccess';
import { Toast } from '../../../components/Toast/Toast';
import { useGlobalToast } from '../../../components/Toast/ToastContext';

const columns = [
  { key: 'vendorName', label: 'Vendor Name' },
  { key: 'profileName', label: 'Profile Name' },
  { key: 'frequency', label: 'Frequency' },
  { key: 'lastExpenseDate', label: 'Last Expense Date' },
  { key: 'nextExpenseDate', label: 'Next Expense Date' },
  { key: 'status', label: 'Status' },
  { key: 'amount', label: 'Amount' },
];

const RecurringBills = () => {
  const { toast, setToast } = useGlobalToast();
  useFormSuccess();
  const navigate = useNavigate();
  const [recurringBills, setRecurringBills] = useState<any[]>([]);

  // INFUTURE HERE'S GET API CALL
  // Load from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('recurringBills') || '[]');
    setRecurringBills(stored);
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
            data={recurringBills}
            actions={true}
            rowsPerPage={10}
            onAdd={() => navigate('/purchases/add-recurringBill')} //May be change it latter. "/add-customer"
            onView={(row) => navigate(`/purchases/view-vendor`)}
          />
        </div>
      </div>
    </>
  );
};

export default RecurringBills;
