import { ChevronDown, PlusCircle } from 'react-feather';
import './card.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLastFiveFYs } from '../../utils/financialYear';
import { Skeleton } from '@mui/material';

interface ActionItem {
  label: string;
  path: string;
}

interface CardProps {
  title: string;
  children?: React.ReactNode;
  selectable?: boolean;
  className?: string;
  actionMenu?: ActionItem[];
  loading?: boolean;

  // ✅ NEW (for FY dropdown)
  selectedFY?: string;
  onFYChange?: (fy: string) => void;
}


function Card({
  title,
  children,
  selectable,
  className,
  actionMenu,
  selectedFY,
  onFYChange,  // ← comma
  loading,     // ← now properly destructured
}: CardProps) {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();


  return (
    <div className={`card ${className || ''}`}>
      <div className="card-header">
        <h3>{title}</h3>

        <div className="actions">
          {/* Dropdown New button */}
          {actionMenu && (
            <div className="dropdown-wrapper">
              <button
                className="add"
                onClick={() => setOpen((prev) => !prev)}
              >
                <PlusCircle />
                New <ChevronDown className={open ? 'rotate-180' : ''} size={12} />

              </button>

              {open && (
                <div className="dropdown-menu">
                  {actionMenu.map((item: ActionItem) => (
                    <button
                      key={item.path}
                      className="dropdown-item"
                      onClick={() => {
                        navigate(item.path);
                        setOpen(false);
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {selectable && selectedFY && onFYChange && (
            <select
              value={selectedFY}
              onChange={(e) => onFYChange(e.target.value)}
              className="form-select form-select-sm"
              style={{ width: 130 }}
            >
              {getLastFiveFYs().map((fy) => (
                <option key={fy} value={fy}>
                  {fy}
                </option>
              ))}
            </select>
          )}

        </div>
      </div>

      <div className="card-body">
        {loading ? (
          <div className="receivables-skeleton">
            <div className="skeleton-line">
              <Skeleton variant="text" width="70%" />
            </div>
            <div className="skeleton-bar">
              <Skeleton variant="rectangular" height={4} />
            </div>
            <div className="row-values">
              <div className="skeleton-value">
                <Skeleton variant="text" width="50%" height={32} />
              </div>
              <div className="skeleton-value">
                <Skeleton variant="text" width="50%" height={32} />
              </div>
            </div>
          </div>
        ) : (
          children  // ← Just `children`, no extra {}
        )}
      </div>



    </div>
  );
}

export default Card;