import { useState } from 'react';
import { ChevronDown, PlusCircle } from 'react-feather';
import './viewComponent.css';

// =======================================
// 🔵 TYPES
// =======================================
type TableRow = (string | number)[];
type TableData = TableRow[];

interface ChildSectionType {
  title: string;
  columns: string[];
  data: TableData;
  path: string;
  emptyMessage?: string;
}

interface TransactionsSection {
  title: string;
  children: ChildSectionType[];
}

interface TransactionsProps {
  section: TransactionsSection;
}

// =======================================
// 🔵 MAIN COMPONENT
// =======================================
const Transactions = ({ section }: TransactionsProps) => {
  const [openMain, setOpenMain] = useState(false);

  return (
    <>
      {/* MAIN DROPDOWN */}
      <button
        className="btn w-100 d-flex align-items-center justify-content-between"
        style={{
          background: '#F4F4F4',
          border: 'none',
          boxShadow: 'none',
          paddingTop: '8px',
          paddingBottom: '8px',
          display: 'flex',
          alignItems: 'center',
        }}
        onClick={() => setOpenMain(!openMain)}
      >
        <div className="d-flex align-items-center gap-2">
          <span className="fw-semibold">{section.title}</span>

          <ChevronDown
            size={18}
            style={{
              transition: '0.25s ease',
              transform: openMain ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          />
        </div>
      </button>

      {/* OPEN DROPDOWN */}
      {!openMain && (
        <div className="animate-open mt-3">
          {section.children.map((child, index) => (
            <ChildSection key={index} child={child} />
          ))}
        </div>
      )}

      {/* CLOSE DROPDOWN */}
      {/* {openMain && (
                <div className="animate-close mt-3">
                    {section.children.map((child, index) => (
                        <ChildSection key={index} child={child} />
                    ))}
                </div>
            )} */}
    </>
  );
};

export default Transactions;

// =======================================
// 🟠 CHILD DROPDOWN (Updated with Add New button)
// =======================================
const ChildSection = ({ child }: { child: ChildSectionType }) => {
  const [open, setOpen] = useState(false);
  const [animate, setAnimate] = useState(false);

  const toggle = () => {
    if (open) {
      setAnimate(true);
      setOpen(false);
      setTimeout(() => setAnimate(false), 200);
    } else {
      setOpen(true);
    }
  };

  return (
    <div className="mb-2">
      {/* CHILD DROPDOWN HEADER */}
      <div
        className="btn w-100 d-flex align-items-center justify-content-between"
        style={{
          background: '#E7E6E6',
          color: '#5E5E5E',
          border: 'none',
          boxShadow: 'none',
          paddingLeft: 5,
          paddingRight: 10,
          borderRadius: open ? '8px 8px 0 0' : '8px',
          cursor: 'pointer',
        }}
        onClick={toggle}
      >
        {/* LEFT: Arrow + Title */}
        <div className="d-flex align-items-center gap-2">
          <ChevronDown
            size={16}
            style={{
              transition: '0.25s ease',
              transform: open ? 'rotate(0deg)' : 'rotate(-90deg)',
            }}
          />
          <span className="fw-normal">{child.title}</span>
        </div>

        {/* RIGHT: ADD NEW BUTTON (visible only when open) */}
        {open && (
          <button
            className="btn btn-sm d-flex align-items-center gap-1"
            style={{
              padding: '4px 12px',
              fontSize: '15px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              color: '#4b4597ff',
            }}
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = child.path;
            }}
          >
            <PlusCircle size={14} style={{ color: '#526991ff' }} />
            New
          </button>
        )}
      </div>

      {/* TABLE OPEN ANIMATION */}
      {open && (
        <div className="animate-open">
          <DynamicTable
            columns={child.columns}
            data={child.data}
            emptyMessage={child.emptyMessage}
          />
        </div>
      )}

      {/* TABLE CLOSE ANIMATION */}
      {animate && (
        <div className="animate-close">
          <DynamicTable columns={child.columns} data={child.data} />
        </div>
      )}
    </div>
  );
};

// =======================================
// 🟩 TABLE
// =======================================
const DynamicTable = ({
  columns,
  data,
  emptyMessage,
}: {
  columns: string[];
  data: TableData;
  emptyMessage?: string;
}) => {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table
        className="w-100"
        style={{
          borderCollapse: 'separate',
          borderSpacing: 0,
          border: '1px solid #D0D0D0',
          borderRadius: '0 0 12px 12px',
          overflow: 'hidden',
        }}
      >
        <thead style={{ background: '#F4F4F4' }}>
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                className="fw-normal"
                style={{
                  padding: '10px',
                  borderBottom: '1px solid #D0D0D0',
                  color: '#5E5E5E',
                  borderRight: 'none',
                }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{
                  textAlign: 'center',
                  padding: '16px',
                  color: '#777',
                }}
              >
                {emptyMessage || 'No records found'}
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr key={rowIdx}>
                {row.map((cell, colIdx) => (
                  <td
                    key={colIdx}
                    style={{
                      padding: '10px',
                      borderBottom: '1px solid #EEE',
                      borderRight: 'none',
                    }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
