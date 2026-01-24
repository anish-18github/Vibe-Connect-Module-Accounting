import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/Header/Header';
import Navbar from '../../../components/Navbar/NavBar';
import DynamicTable from '../../../components/Table/DynamicTable';
import { useGlobalToast } from '../../../components/Toast/ToastContext';
import { useLoading } from '../../../Contexts/Loadingcontext';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { Edit } from 'react-feather';
import { dashboardTabs } from '../../Dashboard/dashboard';
import { salesTabs } from '../Customers/Customers';
import api from '../../../services/api/apiConfig';
import useFormSuccess from '../../../components/Toast/useFormSuccess';
import Toast from '../../../components/Toast/Toast';

// ✅ Updated Interface (match your API)
interface SalesOrder {
  id: number;                    // ✅ Use 'id' like quotes
  date: string;
  salesOrder: string;
  reference: string;
  customerName: string;
  status: string;
  expectedShipmentDate: string;  // ✅ Fixed key
  createdBy: string;
  amount: number;
}

const SalesOrders = () => {
  const navigate = useNavigate();
  const { toast, setToast } = useGlobalToast();
  const { showLoading, hideLoading } = useLoading();
  useFormSuccess();

  const [salesOrders, setSalesOrders] = React.useState<SalesOrder[]>([]);
  const [loading, setLoading] = React.useState(true);

  // ✅ Status badge style (same as quotes)
  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'sent': return { bg: '#e0f0ff', color: '#1d4ed8' };
      case 'draft': return { bg: '#e6f9ed', color: '#15803d' };
      case 'expired': return { bg: '#fde8e8', color: '#b91c1c' };
      case 'accepted': return { bg: '#fff7db', color: '#a16207' };
      default: return { bg: '#f3f4f6', color: '#374151' };
    }
  };

  // ✅ Table columns (fixed amount column)
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
              backgroundColor: bg, color, padding: '4px 10px',
              borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600,
              textTransform: 'capitalize', display: 'inline-block',
              minWidth: '80px', textAlign: 'center',
            }}
          >
            {value}
          </span>
        );
      },
    },
    { key: 'expectedShipmentDate', label: 'Shipment Date' },
    {
      key: 'amount',
      label: 'Amount',
      render: (value: number) => (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px', whiteSpace: 'nowrap' }}>
          <span style={{ fontSize: '0.8rem', color: '#6c757d' }}>₹</span>
          <span style={{ fontWeight: 600 }}>
            {value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      ),
    },
    {
      key: 'createdBy',
      label: 'Created By',
      render: (value: string) => (
        <div style={{ display: 'flex', justifyContent: 'flex-end', whiteSpace: 'nowrap' }}>
          {value}
        </div>
      ),
    },
  ];

  useEffect(() => {
    const fetchSalesOrders = async () => {
      try {
        showLoading();
        const response = await api.get<SalesOrder[]>('sales-orders/');
        setSalesOrders(response.data);
      } catch (error: any) {
        setToast({
          stage: 'enter',
          type: 'error',
          message: error.response?.data?.detail || 'Unable to load Sales Orders',
        });
      } finally {
        hideLoading();
        setLoading(false);
      }
    };
    fetchSalesOrders();
  }, []);

  // ✅ View handler
  const handleViewSalesOrder = useCallback((row: SalesOrder) => {
    navigate(`/sales/view-sales-order/${row.id}`);
  }, [navigate]);

  // ✅ FIXED: SalesOrder → Invoice Conversion (SAME as Quote→SO)
  const handleInvoiceConversion = useCallback(async (row: SalesOrder) => {
    const soStatus = row.status?.toLowerCase();
    if (soStatus !== 'confirmed') {
      setToast({
        stage: 'enter',
        type: 'warning',
        message: `Only ACCEPTED Sales Orders can be converted.`,
      });
      return;
    }

    try {
      showLoading();

      // ✅ FETCH FULL SalesOrder details (like quotes/14/)
      const response = await api.get(`/sales-orders/${row.id}/`);
      const fullSO = response.data;

      console.log('🔍 Full SalesOrder details:', fullSO);

      const soState = {
        fromSalesOrder: true,
        salesOrderData: {
          customerId: fullSO.customer,
          customerName: fullSO.customerName,
          salesOrderNumber: fullSO.sales_order_number || row.salesOrder,
          salesPerson: fullSO.sales_person,
          invoiceDate: new Date().toISOString().split('T')[0],
          // dueDate: fullSO.expected_shipment_date || new Date().toISOString().split('T')[0],
          paymentTerms: fullSO.payment_terms || 'Net 30',
          customerNotes: fullSO.customer_notes,
          termsAndConditions: fullSO.terms_and_conditions,
        },
        soItems: fullSO.items.map((item: any) => ({
          description: item.item_details,
          quantity: parseFloat(item.quantity),
          rate: parseFloat(item.rate),
          taxRate: 0,
        })),
      };

      console.log('🚀 Passing SalesOrder data:', soState);
      navigate(`/sales/add-invoice`, { state: soState });
    } catch (error: any) {
      console.error('Failed to fetch SalesOrder:', error);
      setToast({
        stage: 'enter',
        type: 'error',
        message: 'Failed to load SalesOrder details',
      });
    } finally {
      hideLoading();
    }
  }, [navigate, setToast, showLoading, hideLoading]);

  // ✅ FIXED Actions (proper functions + status disable)
  const actions = [
    {
      icon: <DescriptionOutlinedIcon sx={{ fontSize: 20 }} />,
      onClick: handleInvoiceConversion,  // ✅ Handles validation inside
      tooltip: 'Convert to Invoice',     // ✅ Simple tooltip
    },
    {
      icon: <RemoveRedEyeOutlinedIcon sx={{ fontSize: 20 }} />,
      onClick: handleViewSalesOrder,
      tooltip: 'View Details',
    },
    // {
    //   icon: <Edit size={18} />,
    //   onClick: (row: SalesOrder) => navigate(`/sales/edit-sales-order/${row.id}`),
    //   tooltip: 'Edit Sales Order',
    // },
  ];


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
            actions={actions}
            rowsPerPage={10}
            onAdd={() => navigate('/sales/add-salesOrders')}
          />
        </div>
      </div>
    </>
  );
};

export default SalesOrders;
