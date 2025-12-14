import { useState, useEffect } from 'react';
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
  { key: 'purchaseOrder', label: 'Prchase Order#' },
  { key: 'reference', label: 'Reference' },
  { key: 'vendorName', label: 'Vendor Name' },
  { key: 'status', label: 'Status' },
  { key: 'billedStatus', label: 'Billed Status' },
  { key: 'amount', label: 'Amount' },
  { key: 'deliveryDate', label: 'Delivery Date' },
];

const PurchaseOrders = () => {
  const { toast, setToast } = useGlobalToast();
  useFormSuccess();
  const navigate = useNavigate();
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([]);

  // INFUTURE HERE'S GET API CALL
  // Load from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('purchaseOrders') || '[]');
    setPurchaseOrders(stored);
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
            data={purchaseOrders}
            actions={false}
            rowsPerPage={10}
            onAdd={() => navigate('/purchases/add-purchaseOrders')} //May be change it latter. "/add-customer"
            onView={(row) => navigate(`/purchases/view-vendor`)}
          />
        </div>
      </div>
    </>
  );
};

export default PurchaseOrders;
