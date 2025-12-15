import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header/Header";
import Navbar from "../../../components/Navbar/NavBar";
import DynamicTable from "../../../components/Table/DynamicTable";
import { dashboardTabs } from "../../Dashboard/dashboard";
import { useState, useEffect } from "react";

export const societyTabs = [
    { label: 'Master Setup', path: '/society/master-setup' },
    { label: 'Member Management', path: '/society/member-management' },
    { label: 'Maintenance Management', path: '/society/maintenance-management' },
    { label: 'Budgeting', path: '/society/budgeting' },
    { label: 'Reports & Analytics', path: '/society/Reports-Analytics' },
];

const columns = [
    { key: 'societyDetails', label: 'Society Details' },
    { key: 'buildingAndFlat', label: 'Building And Flat' },
    { key: 'chartOfAccount', label: 'Chart Of Account' },
    { key: 'maintenanceCategories', label: 'Maintenance Categories' },
];


const MasterSetup = () => {

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
                        onAdd={() => navigate('/society/add-masteSetup')}
                        onView={(row) => navigate(`/accountant/view-journal/${row.customerId}`)}
                    />
                </div>
            </div>
        </>
    );
}

export default MasterSetup;

