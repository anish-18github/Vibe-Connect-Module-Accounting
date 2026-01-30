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
import api from '../../../services/api/apiConfig';
import { useLoading } from '../../../Contexts/Loadingcontext';


interface Payments {
  id: number;
  paymnetDate: String;
  paymentId: string;
  reference: string;
  customerName: string;
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
  const { showLoading, hideLoading } = useLoading();


  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'sent':
        return { bg: '#e0f0ff', color: '#1d4ed8' };
      case 'draft':
        return { bg: '#e6f9ed', color: '#15803d' };
      case 'expired':
        return { bg: '#fde8e8', color: '#b91c1c' };
      case 'accepted':
        return { bg: '#fff7db', color: '#a16207' };
      default:
        return { bg: '#f3f4f6', color: '#374151' };
    }
  };


  useFormSuccess();
  const columns = [
    { key: 'date', label: 'Date' },
    { key: 'payment', label: 'Payment' },
    { key: 'reference', label: 'Reference' },
    { key: 'customerName', label: 'Customer Name' },
    { key: 'invoice', label: 'Invoice' },
    { key: 'mode', label: 'Mode' },
    {
      key: 'amount',
      label: 'Amount',
      render: (value: number) => (
        <div style={{ display: 'flex', gap: '4px', whiteSpace: 'nowrap' }}>
          <span style={{ fontSize: '0.8rem', color: '#6c757d' }}>₹</span>
          <span style={{ fontWeight: 600 }}>
            {value.toLocaleString('en-IN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => {
        const { bg, color } = getStatusStyle(value);
        return (
          <span
            style={{
              backgroundColor: bg,
              color,
              padding: '4px 10px',
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'capitalize',
              minWidth: '80px',
              display: 'inline-block',
              textAlign: 'center',
            }}
          >
            {value}
          </span>
        );
      },
    },
  ];

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        showLoading();
        const response = await api.get<Payments[]>('payments/');
        setPayments(response.data);
      } catch (error: any) {z
        setToast({
          stage: 'enter',
          type: 'error',
          message:
            error.response?.data?.detail || 'Unable to load Recoreded payments',
        });
      } finally {
        hideLoading();
        setLoading(false);
      }
    };
    fetchPayments();
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
            data={payments}
            loading={loading}
            actions={true}
            rowsPerPage={10}
            onAdd={() => navigate('/sales/record-payment')} //May be change it latter. "/add-customer"
          />
        </div>
      </div>
    </>
  );
};

export default PaymentReceived;
