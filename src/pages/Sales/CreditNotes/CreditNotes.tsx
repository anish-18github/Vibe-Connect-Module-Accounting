import { useNavigate } from 'react-router-dom';
import DynamicTable from '../../../components/Table/DynamicTable';
import { useState, useEffect } from 'react';
import Header from '../../../components/Header/Header';
import Navbar from '../../../components/Navbar/NavBar';
import { dashboardTabs } from '../../Dashboard/dashboard';
import { salesTabs } from '../Customers/Customers';
import useFormSuccess from '../../../components/Toast/useFormSuccess';
import { Toast } from '../../../components/Toast/Toast';
import { useGlobalToast } from '../../../components/Toast/ToastContext';

const CreditNote = () => {
  const { toast, setToast } = useGlobalToast();
  useFormSuccess();
  const columns = [
    { key: 'date', label: 'Date' },
    { key: 'reference', label: 'reference' },
    { key: 'customerName', label: 'Customer Name' },
    { key: 'invoice', label: 'Invoice' },
    { key: 'status', label: 'Status' },
    { key: 'amount', label: 'Amount' },
    { key: 'balance', label: 'Balance' },
  ];

  const navigate = useNavigate();
  const [customers, setCustomers] = useState<any[]>([]);

  // INFUTURE HERE'S GET API CALL
  // Load from localStorage
  // useEffect(() => {
  //   const stored = JSON.parse(localStorage.getItem('customers') || '[]');
  //   setCustomers(stored);
  // }, []);

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
            actions={false}
            rowsPerPage={10}
            onAdd={() => navigate('/sales/add-creditNote')} //May be change it latter. "/add-customer"
            onView={(row) => navigate(`/view-customer/${row.customerId}`)}
          />
        </div>
      </div>
    </>
  );
};

export default CreditNote;
