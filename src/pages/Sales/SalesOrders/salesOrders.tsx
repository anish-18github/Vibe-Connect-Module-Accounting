import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Header from '../../../components/Header/Header';
import Navbar from '../../../components/Navbar/NavBar';
import DynamicTable from '../../../components/Table/DynamicTable';
import { Toast } from '../../../components/Toast/Toast';
import { useGlobalToast } from '../../../components/Toast/ToastContext';

import { dashboardTabs } from '../../Dashboard/dashboard';
import { salesTabs } from '../Customers/Customers';
import api from '../../../services/api/apiConfig';
import useFormSuccess from '../../../components/Toast/useFormSuccess';

// ---------------- Interfaces ----------------
interface SalesOrder {
  salesOrderId: number;
  date: string;
  salesOrder: string;
  reference: string;
  customerName: string;
  status: string;
  shipmentDate: string;
  createdBy: string;
}

const SalesOrders = () => {
  const navigate = useNavigate();
  const { toast, setToast } = useGlobalToast();
  useFormSuccess();

  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);
  const [loading, setLoading] = useState(true);

  // ---------------- Status Badge ----------------
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

  // ---------------- Table Columns ----------------
  const columns = [
    { key: 'date', label: 'Date' },
    { key: 'salesOrder', label: 'Sales Order' },
    { key: 'reference', label: 'Reference' },
    { key: 'customerName', label: 'Customer Name' },
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
              display: 'inline-block',
              minWidth: '80px',
              textAlign: 'center',
            }}
          >
            {value}
          </span>
        );
      },
    },
    { key: 'shipmentDate', label: 'Shipment Date' },
    { key: 'createdBy', label: 'Created By' },
  ];

  // ---------------- Data Load (SAME AS CUSTOMERS) ----------------
  useEffect(() => {
    const fetchSalesOrders = async () => {
      try {
        const response = await api.get<SalesOrder[]>(
          'sales/sales-orders/'
        );
        setSalesOrders(response.data);
      } catch (error: any) {
        setToast({
          stage: 'enter',
          type: 'error',
          message:
            error.response?.data?.detail ||
            'Unable to load Sales Orders',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSalesOrders();
  }, []);

  // ---------------- View Handler ----------------
  const handleViewSalesOrder = (row: SalesOrder) => {
    navigate(`/sales/view-sales-order/${row.salesOrderId}`);
  };

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
            data={salesOrders}
            loading={loading}
            actions
            rowsPerPage={10}
            onAdd={() => navigate('/sales/add-salesOrders')}
            onView={handleViewSalesOrder}
          />
        </div>
      </div>
    </>
  );
};

export default SalesOrders;
