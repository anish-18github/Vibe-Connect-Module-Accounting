import { useState } from 'react';
import './dynamicTable.css';
import { ChevronLeft, ChevronRight, Search } from 'react-feather';

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface ActionConfig {
  icon: React.ReactNode;
  onClick: (row: any) => void;
  tooltip?: string;
  disabled?: boolean;
}

interface DynamicTableProps {
  columns: Column[];
  data: any[];
  actions?: ActionConfig[];  // ✅ NEW: Array of action buttons
  loading?: boolean;
  rowsPerPage?: number;
  onAdd?: () => void;
  onView?: (row: any) => void;
}


function DynamicTable({
  columns,
  data,
  actions = [],
  rowsPerPage = 10,
  loading = false,
  onAdd,
}: DynamicTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div style={{ padding: '0px 5rem 0px 1rem' }}>
      {/* Pagination */}
      {/* TOP BAR */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '10px',
          padding: '0 10px',
        }}
      >
        {/* LEFT SIDE: Search + Add */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          {/* Search Icon (Clickable, No Input) */}
          <button
            style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <Search size={25} style={{ color: '#555' }} />
          </button>

          {/* Add Button */}
          <button
            className="btn btn-outline-secondary custom-add-btn px-4 py-1 border"
            onClick={onAdd}
          >
            Add
          </button>
        </div>

        {/* RIGHT SIDE: Pagination (Already Working) */}
        {data.length > rowsPerPage && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ fontSize: '14px', color: '#555' }}>
              {startIndex + 1} - {Math.min(endIndex, data.length)} of {data.length}
            </div>

            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                color: currentPage === 1 ? '#aaa' : '#555',
                padding: 0,
              }}
            >
              <ChevronLeft size={18} />
            </button>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                color: currentPage === totalPages ? '#aaa' : '#555',
                padding: 0,
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      {/* table-striped */}

      <div className="table-wrapper">
        <table className="table custom-table table-bordered" style={{ fontSize: 14 }}>
          <thead className="fw-normal">
            <tr>
              {actions.length > 0 && <th style={{ width: '120px' }}>Actions</th>}  {/* Dynamic action header */}
              {columns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                  className="text-center"
                >
                  Loading...
                </td>
              </tr>
            ) : currentData.length > 0 ? (
              currentData.map((row, i) => (
                <tr key={i}>
                  {/* ✅ DYNAMIC ACTION COLUMN */}
                  {actions.length > 0 && (
                    <td style={{ padding: '8px', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        {actions.map((action, actionIndex) => (
                          <button
                            key={actionIndex}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!action.disabled) action.onClick(row);
                            }}
                            disabled={action.disabled}
                            title={action.tooltip}
                            style={{
                              border: 'none',
                              background: 'transparent',
                              cursor: action.disabled ? 'not-allowed' : 'pointer',
                              padding: '6px',
                              borderRadius: '6px',
                              opacity: action.disabled ? 0.5 : 1,
                              color: '#555',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '32px',
                              height: '32px',
                              transition: 'all 0.2s ease',
                            }}
                            // ✅ PROPER HOVER EFFECTS
                            onMouseEnter={(e) => {
                              if (!action.disabled) {
                                e.currentTarget.style.backgroundColor = '#f8f9fa';
                                e.currentTarget.style.color = '#007bff';
                                e.currentTarget.style.transform = 'scale(1.05)';
                              }
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.color = '#555';
                              e.currentTarget.style.transform = 'scale(1)';
                            }}
                          >
                            {action.icon}
                          </button>
                        ))}

                      </div>
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={col.key}>
                      {col.render
                        ? col.render(row[col.key], row)
                        : col.key === 'createdOn'
                          ? new Date(row[col.key]).toLocaleDateString('en-GB') // dd/mm/yyyy
                          : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="text-center"
                >
                  No Data Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default DynamicTable;
