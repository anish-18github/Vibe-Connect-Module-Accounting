import { useState } from "react";
import './dynamicTable.css'
import { Edit, Eye, ChevronLeft, ChevronRight } from "react-feather";

interface Column {
    key: string;
    label: string;
}

interface DynamicTableProps {
    columns: Column[];
    data: any[];
    actions?: boolean;
    rowsPerPage?: number;
}

function DynamicTable({ columns, data, actions = false, rowsPerPage = 10 }: DynamicTableProps) {
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate pagination
    const totalPages = Math.ceil(data.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const currentData = data.slice(startIndex, endIndex);

    const goToPage = (page: number) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };

    const renderPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            // Show first page, last page, current page, and pages around current
            if (
                i === 1 ||
                i === totalPages ||
                (i >= currentPage - 1 && i <= currentPage + 1)
            ) {
                pages.push(
                    <button
                        key={i}
                        onClick={() => goToPage(i)}
                        style={{
                            padding: "5px 12px",
                            margin: "0 2px",
                            border: "1px solid #c9c9c9",
                            borderRadius: "4px",
                            background: currentPage === i ? "#555" : "#f8f8f8",
                            color: currentPage === i ? "white" : "#555",
                            cursor: "pointer",
                            minWidth: "36px"
                        }}
                    >
                        {i}
                    </button>
                );
            } else if (i === currentPage - 2 || i === currentPage + 2) {
                pages.push(
                    <span key={i} style={{ padding: "5px", color: "#555" }}>
                        ...
                    </span>
                );
            }
        }
        return pages;
    };

    return (
        <div>

            {/* Pagination */}
            {data.length > rowsPerPage && (
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "15px",
                    padding: "0 10px"
                }}>
                    {/* Left side - Showing info */}
                    <div style={{ fontSize: "14px", color: "#555" }}>
                        Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} entries
                    </div>

                    {/* Right side - Pagination controls */}
                    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        {/* Previous button */}
                        <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            style={{
                                padding: "5px 10px",
                                border: "1px solid #c9c9c9",
                                borderRadius: "4px",
                                background: currentPage === 1 ? "#e9e9e9" : "#f8f8f8",
                                color: currentPage === 1 ? "#999" : "#555",
                                cursor: currentPage === 1 ? "not-allowed" : "pointer"
                            }}
                        >
                            <ChevronLeft size={18} />
                        </button>

                        {/* Page numbers */}
                        <div style={{ display: "flex", alignItems: "center" }}>
                            {renderPageNumbers()}
                        </div>

                        {/* Next button */}
                        <button
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            style={{
                                padding: "5px 10px",
                                border: "1px solid #c9c9c9",
                                borderRadius: "4px",
                                background: currentPage === totalPages ? "#e9e9e9" : "#f8f8f8",
                                color: currentPage === totalPages ? "#999" : "#555",
                                cursor: currentPage === totalPages ? "not-allowed" : "pointer"
                            }}
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            )}

            <table className="table custom-table table-bordered table-striped">
                <thead>
                    <tr>
                        {actions && <th>Action</th>}
                        {columns.map((col) => (
                            <th key={col.key}>{col.label}</th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {currentData.length > 0 ? (
                        currentData.map((row, i) => (
                            <tr key={i}>
                                {actions && (
                                    <td>
                                        <span style={{ marginRight: "10px", cursor: "pointer", color: "#555" }}>
                                            <Edit size={15} />
                                        </span>
                                        <span style={{ cursor: "pointer", color: "#555" }}>
                                            <Eye size={15} />
                                        </span>
                                    </td>
                                )}
                                {columns.map((col) => (
                                    <td key={col.key}>{row[col.key]}</td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length + (actions ? 1 : 0)} className="text-center">
                                No Data Found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>


        </div>
    );
}

export default DynamicTable;