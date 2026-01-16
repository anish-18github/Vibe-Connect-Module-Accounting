import { useState } from 'react';
import './dynamicTable.css';
import { Edit, Eye, ChevronLeft, ChevronRight, Search } from 'react-feather';

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DynamicTableProps {
  columns: Column[];
  data: any[];
  actions?: boolean;
  loading?: boolean;
  rowsPerPage?: number;
  onAdd?: () => void; /* For Navigation */
  onView?: (row: any) => void;
}

function DynamicTable({
  columns,
  data,
  actions = false,
  rowsPerPage = 10,
  loading = false,
  onAdd,
  onView,
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
              {actions && <th>Action</th>}
              {columns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="text-center"
                >
                  Loading...
                </td>
              </tr>
            ) : currentData.length > 0 ? (
              currentData.map((row, i) => (
                <tr key={i}>
                  {actions && (
                    <td>
                      <span
                        style={{
                          marginRight: '10px',
                          cursor: 'pointer',
                          color: '#555',
                        }}
                      >
                        <Edit size={16} />
                      </span>
                      <span
                        style={{ cursor: 'pointer', color: '#555' }}
                        onClick={() => onView?.(row)}
                      >
                        <Eye size={16} />
                      </span>
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
