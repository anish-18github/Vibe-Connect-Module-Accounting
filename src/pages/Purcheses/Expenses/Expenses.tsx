import { useNavigate } from 'react-router-dom';
import Header from '../../../components/Header/Header';
import Navbar from '../../../components/Navbar/NavBar';
import DynamicTable from '../../../components/Table/DynamicTable';
import { dashboardTabs } from '../../Dashboard/dashboard';
import { parchasesTabs } from '../Vendors/Vendors';
import { useState, useEffect } from 'react';
import useFormSuccess from '../../../components/Toast/useFormSuccess';
import { Toast } from '../../../components/Toast/Toast';
import { useGlobalToast } from '../../../components/Toast/ToastContext';

const columns = [
  { key: 'date', label: 'Date' },
  { key: 'expenseAccount', label: 'Expense Account' },
  { key: 'reference', label: 'Reference' },
  { key: 'vendorName', label: 'Vendor Name' },
  { key: 'paidThrough', label: 'Paid Through' },
  { key: 'customerName', label: 'Customer Name' },
  { key: 'status', label: 'Status' },
  { key: 'amount', label: 'Amount' },
];

const Expenses = () => {
  const { toast, setToast } = useGlobalToast();
  useFormSuccess();
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState<any[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('expenses') || '[]');
    setExpenses(stored);
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
            data={expenses}
            actions={false}
            rowsPerPage={10}
            onAdd={() => navigate('/purchases/add-expense')}
            onView={(row) => navigate(`/purchases/view-vendor/`)}
          />
        </div>
      </div>
    </>
  );
};

export default Expenses;
