import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/Header/Header';
import DynamicTable from '../../../components/Table/DynamicTable';
import Navbar from '../../../components/Navbar/NavBar';
import { dashboardTabs } from '../../Dashboard/dashboard';
import { parchasesTabs } from '../Vendors/Vendors';

const columns = [
  { key: 'date', label: 'Date' },
  { key: 'creditNote', label: 'Credit Note' },
  { key: 'referenceNumber', label: 'Reference Number' },
  { key: 'vendorName', label: 'Vendor Name' },
  { key: 'status', label: 'Status' },
  { key: 'amount', label: 'Amount' },
  { key: 'balance', label: 'Balance' },
];

const VendorCredit = () => {
  const navigate = useNavigate();
  const [vendorCredits, setvendorCredits] = useState<any[]>([]);

  // INFUTURE HERE'S GET API CALL
  // Load from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('vendorCredits') || '[]');
    setvendorCredits(stored);
  }, []);

  return (
    <>
      <Header />

      <div style={{ padding: '56px 0px 0px' }}>
        <Navbar tabs={dashboardTabs} />
        <Navbar tabs={parchasesTabs} />

        <div className=" mt-3">
          <DynamicTable
            columns={columns}
            data={vendorCredits}
            actions={true}
            rowsPerPage={10}
            onAdd={() => navigate('/purchases/add-vendorCredit')}
            onView={(row) => navigate(`/purchases/view-vendor`)}
          />
        </div>
      </div>
    </>
  );
};

export default VendorCredit;
