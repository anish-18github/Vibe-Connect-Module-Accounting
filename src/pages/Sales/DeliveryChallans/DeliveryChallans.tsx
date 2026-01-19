import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Header from '../../../components/Header/Header';
import Navbar from '../../../components/Navbar/NavBar';
import DynamicTable from '../../../components/Table/DynamicTable';
import { dashboardTabs } from '../../Dashboard/dashboard';
import { salesTabs } from '../Customers/Customers';

import useFormSuccess from '../../../components/Toast/useFormSuccess';
import { Toast } from '../../../components/Toast/Toast';
import { useGlobalToast } from '../../../components/Toast/ToastContext';

import api from '../../../services/api/apiConfig';

interface DeliveryChallan {
  id: number;
  date: string;
  deliveryChallanNo: string;
  reference: string;
  customerName: string;
  status: string;
  invoiceStatus: string;
  amount: number;
}

const DeliveryChallans = () => {
  const navigate = useNavigate();
  const { toast, setToast } = useGlobalToast();

  const [loading, setLoading] = useState(true);
  const [challans, setChallans] = useState<DeliveryChallan[]>([]);

  useFormSuccess();

  // ✅ Status badge styles (business-meaningful)
  const getStatusStyle = (status?: string) => {
    if (!status) {
      return { bg: '#f3f4f6', color: '#6b7280' }; // neutral for null
    }

    switch (status.toLowerCase()) {
      // Normal Status
      case 'draft':
        return { bg: '#f3f4f6', color: '#374151' };

      case 'open':
        return { bg: '#e0f2fe', color: '#0369a1' };

      case 'delivered':
        return { bg: '#ecfdf5', color: '#047857' };

      case 'returned':
        return { bg: '#fee2e2', color: '#b91c1c' };

      // Invoice Status
      case 'invoiced':
        return { bg: '#e0f0ff', color: '#1d4ed8' };

      case 'not invoiced':
      case 'notinvoiced':
        return { bg: '#fff7db', color: '#a16207' };

      default:
        return { bg: '#f3f4f6', color: '#374151' };
    }
  };


  const columns = [
    { key: 'date', label: 'Date' },
    { key: 'deliveryChallanNo', label: 'Delivery Challan No.' },
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
    {
      key: 'invoiceStatus',
      label: 'Invoice Status',
      render: (value: string | null) => {
        if (!value) return '-';

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
      }

    },
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
  ];

  useEffect(() => {
    const fetchDeliveryChallans = async () => {
      try {
        const response = await api.get<DeliveryChallan[]>(
          'delivery-challans/'
        );
        setChallans(response.data);
      } catch (error: any) {
        setToast({
          stage: 'enter',
          type: 'error',
          message:
            error.response?.data?.detail ||
            'Unable to load delivery challans',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveryChallans();
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
            data={challans}
            loading={loading}
            actions={true}
            rowsPerPage={10}
            onAdd={() => navigate('/sales/add-deliveryChallans')}
            onView={(row) =>
              navigate(`/sales/view-deliveryChallan/${row.id}`)
            }
          />
        </div>
      </div>
    </>
  );
};

export default DeliveryChallans;
