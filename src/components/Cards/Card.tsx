import { ChevronDown, PlusCircle } from 'react-feather';
import './Card.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ActionItem {
  label: string;
  path: string;
}

interface CardProps {
  title: string;
  children: React.ReactNode;
  selectable?: boolean;
  className?: string;
  actionMenu?: ActionItem[];
}

function Card({
  title,
  children,
  selectable,
  className,
  actionMenu, // ✅ destructured properly
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

          {selectable && (
            <select>
              <option>The Fiscal Year</option>
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
            </select>
          )}
        </div>
      </div>

      <div className="card-body">{children}</div>
    </div>
  );
}

export default Card;
