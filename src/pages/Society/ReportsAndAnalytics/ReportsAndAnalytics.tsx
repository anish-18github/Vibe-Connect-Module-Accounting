import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header/Header";
import Navbar from "../../../components/Navbar/NavBar";
import DynamicTable from "../../../components/Table/DynamicTable";
import { dashboardTabs } from "../../Dashboard/dashboard";
import { societyTabs } from "../MasterSetup/MasterSetup";

const columns = [
    { key: 'societyDetails', label: 'Building ' },
    { key: 'buildingAndFlat', label: 'Flat Number' },
    { key: 'chartOfAccount', label: 'Source Info' },
    { key: 'maintenanceCategories', label: 'Liabilities' },
];

const ReportsAndAnalytics = () => {
    const navigate = useNavigate();
    const [masterSetup, setMasterSetup] = useState<any[]>([]);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('masterSetup') || '[]');
        setMasterSetup(stored);
    }, []);

    return (
        <>
            <Header />

            <div style={{ padding: '56px 0px 0px' }}>
                <Navbar tabs={dashboardTabs} />
                <Navbar tabs={societyTabs} />

                <div className="mt-3">
                    <DynamicTable
                        columns={columns}
                        data={masterSetup}
                        actions={false}
                        rowsPerPage={10}
                        onAdd={() => navigate('/society/add-reportAnalytics')}
                        onView={(row) => navigate(`/accountant/view-journal/${row.customerId}`)}
                    />
                </div>
            </div>
        </>
    );
}


export default ReportsAndAnalytics;