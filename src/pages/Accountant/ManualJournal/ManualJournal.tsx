import { useState, useEffect, useId } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen } from "react-feather";
import Header from "../../../components/Header/Header";
import Navbar from "../../../components/Navbar/NavBar";
import DynamicTable from "../../../components/Table/DynamicTable";
import { dashboardTabs } from "../../Dashboard/dashboard";

export const accountantTabs = [
    { label: "Manual Journal", path: "/accountant/manual-journal" },
    { label: "Bulk Update", path: "/accountant/bulk-update" },
    { label: "Currency Adjustments", path: "/accountant/currency-adjustments" },
    { label: "Chart of accounts", path: "/accountant/charts-of-accounts" },
    { label: "Budgets", path: "/accountant/budgets" },
    { label: "Transaction Locking", path: "/accountant/transaction-locking" },
];

const columns = [
    { key: "journal", label: "Journal" },
    { key: "referenceNo", label: "Reference No" },
    { key: "status", label: "Status" },
    { key: "notes", label: "Notes" },
    { key: "amount", label: "Amount" },
    { key: "createdOn", label: "Created On" },
    { key: "createdBy", label: "Created By" },
];

// Accessible tooltip icon component
const IconTooltip: React.FC<{ label: string }> = ({ label }) => {
    const [open, setOpen] = useState(false);
    const tooltipId = useId();

    const show = () => setOpen(true);
    const hide = () => setOpen(false);

    const handleKeyDown: React.KeyboardEventHandler<HTMLButtonElement> = (e) => {
        if (e.key === "Escape") {
            e.stopPropagation();
            hide();
        }
    };

    return (
        <span className="position-relative d-inline-flex">
            <button
                type="button"
                className="border-0 bg-transparent p-0 d-inline-flex align-items-center"
                aria-describedby={open ? tooltipId : undefined}
                onMouseEnter={show}
                onMouseLeave={hide}
                onFocus={show}
                onBlur={hide}
                onKeyDown={handleKeyDown}
            >
                <BookOpen size={16} aria-hidden="true" focusable="false" className="text-primary" />
                <span className="visually-hidden">View notes</span>
            </button>

            {open && (
                <div
                    id={tooltipId}
                    role="tooltip"
                    className="px-2 py-1 rounded shadow-sm bg-dark text-white small"
                    style={{
                        position: "absolute",
                        top: "120%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: 10,
                        whiteSpace: "pre-wrap",
                    }}
                >
                    {label}
                </div>
            )}
        </span>
    );
};

const ManualJournal = () => {
    const navigate = useNavigate();
    const [rows, setRows] = useState<any[]>([]);

    useEffect(() => {
        // 🔹 Temporary mock data for testing
        const temp = [
            {
                id: 1,
                journal: "Opening Balance Adjustment",
                referenceNo: "MJ-0001",
                status: "Draft",
                notes: "Opening balance for FY 24-25", // raw notes from form
                amount: 5000,
                createdOn: "2025-12-05",
                createdBy: "Admin",
            },
            {
                id: 2,
                journal: "Salary Accrual",
                referenceNo: "MJ-0002",
                status: "Posted",
                notes: "Monthly salary accrual",
                amount: 120000,
                createdOn: "2025-12-04",
                createdBy: "Accountant",
            },
        ];

        // Map to inject accessible tooltip icon in Notes column
        const withIcon = temp.map((j) => ({
            ...j,
            notesValue: j.notes, // keep original if needed
            notes: <IconTooltip label={j.notes} />,
        }));

        setRows(withIcon);
    }, []);

    return (
        <>
            <Header />

            <div style={{ padding: "56px 0px 0px" }}>



                <Navbar tabs={dashboardTabs} />
                <Navbar tabs={accountantTabs} />

                <div className="mt-3">
                    <DynamicTable
                        columns={columns}
                        data={rows}
                        actions={true}
                        rowsPerPage={10}
                        onAdd={() => navigate("/accountant/add-manualJournal")}
                        onView={(row) => navigate(`/accountant/view-journal/${row.customerId}`)}
                    />
                </div>
            </div>

        </>
    );
};

export default ManualJournal;
