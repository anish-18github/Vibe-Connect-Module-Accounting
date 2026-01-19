import { useNavigate } from 'react-router-dom';
import DynamicTable from '../../../components/Table/DynamicTable';
import { useEffect, useState } from 'react';
import Header from '../../../components/Header/Header';
import Navbar from '../../../components/Navbar/NavBar';
import { dashboardTabs } from '../../Dashboard/dashboard';
import { salesTabs } from '../Customers/Customers';
import useFormSuccess from '../../../components/Toast/useFormSuccess';
import { Toast } from '../../../components/Toast/Toast';
import { useGlobalToast } from '../../../components/Toast/ToastContext';


interface Payments {
  id: number;
  paymnetDate: String;
  paymentId: string;
  reference: string;
  invoiceNumber: string;
  paymentMode: string;
  status: string;
  amount: number;
}


const PaymentReceived = () => {
    const navigate = useNavigate();
  const [payments, setPayments] = useState<Payments[]>([]);
  const { toast, setToast } = useGlobalToast();
  const [loading, setLoading] = useState(true);
  useFormSuccess();
  const columns = [
    { key: 'date', label: 'Date' },
    { key: 'payment', label: 'Payment' },
    { key: 'reference', label: 'Reference' },
    { key: 'customerName', label: 'Customer Name' },
    { key: 'invoice', label: 'Invoice' },
    { key: 'mode', label: 'Mode' },
    { key: 'amount', label: 'Amount' },
    { key: 'status', label: 'Status' },
  ];




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
            data={payments}
            actions={false}
            rowsPerPage={10}
            onAdd={() => navigate('/sales/record-payment')} //May be change it latter. "/add-customer"
            onView={(row) => navigate(`/view-customer/${row.customerId}`)}
          />
        </div>
      </div>
    </>
  );
};

export default PaymentReceived;
