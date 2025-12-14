import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/Header/Header';
import Navbar from '../../../components/Navbar/NavBar';
import DynamicTable from '../../../components/Table/DynamicTable';
import { dashboardTabs } from '../../Dashboard/dashboard';
import { parchasesTabs } from '../Vendors/Vendors';
import useFormSuccess from '../../../components/Toast/useFormSuccess';
import { Toast } from '../../../components/Toast/Toast';
import { useGlobalToast } from '../../../components/Toast/ToastContext';

const columns = [
  { key: 'date', label: 'Date' },
  { key: 'payment', label: 'Payment#' },
  { key: 'referenceNumber', label: 'Reference' },
  { key: 'vendorName', label: 'Vendor Name' },
  { key: 'bill', label: 'Bill#' },
  { key: 'mode', label: 'Mode' },
  { key: 'status', label: 'Status' },
];

const PaymentMade = () => {
  const { toast, setToast } = useGlobalToast();
  useFormSuccess();
  const navigate = useNavigate();
  const [paymentsMade, setPaymentsMade] = useState<any[]>([]);

  // INFUTURE HERE'S GET API CALL
  // Load from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('bills') || '[]');
    setPaymentsMade(stored);
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
            data={paymentsMade}
            actions={true}
            rowsPerPage={10}
            onAdd={() => navigate('/purchases/add-paymentMade')}
            onView={(row) => navigate(`/purchases/view-vendor`)}
          />
        </div>
      </div>
    </>
  );
};

export default PaymentMade;
