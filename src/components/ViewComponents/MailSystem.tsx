import { useState, useRef, useEffect } from 'react';
import { ChevronDown, AlertTriangle, X, Mail } from 'react-feather';
import { useNavigate } from 'react-router-dom';

import './viewComponent.css';

const MailSystem = () => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState('work');
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const options = [
    { label: 'Outlook', value: 'outlook' },
    { label: 'VC Mail', value: 'vc mail' },
    { label: 'Link with work account', value: 'work' },
  ];

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (value: string) => {
    setSelectedOption(value);
    setOpenDropdown(false);

    if (value === 'work') {
      navigate('/link-email-account');
      return;
    }

    if (value === 'zoho' || value === 'outlook') {
      setShowPopup(true);
    }
  };

  return (
    <div>
      {/* HEADER */}
      <div
        className="d-flex justify-content-between align-items-center px-3 py-2"
        style={{
          background: '#D9D9D9',
          borderRadius: '8px 8px 0 0',
          border: 'none',
        }}
      >
        <span className="fw-semibold" style={{ fontSize: '15px' }}>
          System Mails
        </span>

        {/* DROPDOWN (wrapper only around trigger) */}
        <div className="position-relative" style={{ cursor: 'pointer' }} ref={dropdownRef}>
          <div
            className="d-flex align-items-center gap-1 ms-dropdown-trigger"
            onClick={() => setOpenDropdown((s) => !s)}
            role="button"
            aria-haspopup="true"
            aria-expanded={openDropdown}
          >
            <span style={{ fontSize: '14px', fontWeight: 500 }}>
              {' '}
              <Mail size={17} style={{ color: '#1b6de0' }} /> Link with work account
            </span>
            <ChevronDown size={16} />
          </div>

          {/* renamed classes to avoid bootstrap conflict and positioned outside header */}
          {openDropdown && (
            <div className="ms-dropdown-box shadow">
              {options.map((opt) => (
                <div
                  key={opt.value}
                  className={`ms-dropdown-item ${selectedOption === opt.value ? 'active' : ''}`}
                  onClick={() => handleSelect(opt.value)}
                >
                  {opt.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MAIL CONTENT */}
      <div
        className="p-4 d-flex align-items-center justify-content-center gap-2"
        style={{
          backgroundColor: '#EDEDED',
          borderRadius: '0 0 8px 8px',
          border: 'none',
          minHeight: '100px',
        }}
      >
        <AlertTriangle size={18} color="#ff9800" />
        <span className="text-muted" style={{ fontSize: '15px' }}>
          No emails sent.
        </span>
      </div>

      {/* POPUP */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <X size={20} className="popup-close" onClick={() => setShowPopup(false)} />

            <h5 className="mb-3 text-center">Connect Your Email</h5>

            <p className="text-center text-muted" style={{ fontSize: '15px' }}>
              Enable integration to proceed with your email connection.
            </p>

            <div className="d-flex justify-content-center gap-3 mt-4">
              <button
                className="btn btn-primary"
                style={{ padding: '6px 20px', borderRadius: '6px' }}
              >
                Enable Integration
              </button>

              <button
                className="btn btn-light"
                style={{ padding: '6px 20px', borderRadius: '6px' }}
                onClick={() => setShowPopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MailSystem;
