import React from 'react';
import Header from '../../../components/Header/Header';
import Navbar from '../../../components/Navbar/NavBar';
import { dashboardTabs } from '../../Dashboard/dashboard';
import { accountantTabs } from '../ManualJournal/ManualJournal';
import { Lock, Unlock, X } from 'react-feather';

type ModuleKey = 'sales' | 'purchases' | 'banking' | 'accountant';

interface LockModule {
  key: ModuleKey;
  name: string;
  description: string;
}

interface LockInfo {
  date: string;
  reason: string;
}

const modules: LockModule[] = [
  {
    key: 'sales',
    name: 'Sales',
    description: 'You have not locked the transactions in this module.',
  },
  {
    key: 'purchases',
    name: 'Purchases',
    description: 'You have not locked the transactions in this module.',
  },
  {
    key: 'banking',
    name: 'Banking',
    description: 'You have not locked the transactions in this module.',
  },
  {
    key: 'accountant',
    name: 'Accountant',
    description: 'You have not locked the transactions in this module.',
  },
];

const TransactionLocking: React.FC = () => {
  const [locks, setLocks] = React.useState<Record<ModuleKey, boolean>>({
    sales: false,
    purchases: false,
    banking: false,
    accountant: false,
  });

  // NEW: store date + reason per module
  const [lockInfo, setLockInfo] = React.useState<Record<ModuleKey, LockInfo | null>>({
    sales: null,
    purchases: null,
    banking: null,
    accountant: null,
  });

  // popup state
  const [showLockModal, setShowLockModal] = React.useState(false);
  const [currentModule, setCurrentModule] = React.useState<LockModule | null>(null);

  const [showUnlockModal, setShowUnlockModal] = React.useState(false);
  const [unlockReason, setUnlockReason] = React.useState('');
  const [unlockModule, setUnlockModule] = React.useState<LockModule | null>(null);

  const today = React.useMemo(() => new Date().toISOString().slice(0, 10), []);

  const [lockDate, setLockDate] = React.useState<string>(today);
  const [reason, setReason] = React.useState<string>('');

  const openLockModal = (mod: LockModule) => {
    setCurrentModule(mod);
    setLockDate(today); // default to today for each open
    setReason('');
    setShowLockModal(true);
  };

  const closeLockModal = () => {
    setShowLockModal(false);
    setCurrentModule(null);
  };

  const openUnlockModal = (mod: LockModule) => {
    setUnlockModule(mod);
    setUnlockReason('');
    setShowUnlockModal(true);
  };

  const closeUnlockModal = () => {
    setShowUnlockModal(false);
    setUnlockModule(null);
  };

  const handleConfirmUnlock = () => {
    if (!unlockModule) return;

    const key = unlockModule.key;
    // TODO: call API with { key, reason: unlockReason }
    setLocks((prev) => ({ ...prev, [key]: false }));
    setLockInfo((prev) => ({ ...prev, [key]: null }));
    closeUnlockModal();
  };

  const handleConfirmLock = () => {
    if (!currentModule) return;

    const key = currentModule.key;

    // here you could also call your API with { key, lockDate, reason }
    setLocks((prev) => ({ ...prev, [key]: true }));
    setLockInfo((prev) => ({
      ...prev,
      [key]: { date: lockDate, reason },
    }));

    closeLockModal();
  };

  // const handleToggleUnlock = (key: ModuleKey) => {
  //     setLocks(prev => ({ ...prev, [key]: false }));
  //     setLockInfo(prev => ({ ...prev, [key]: null }));
  // };

  const formatDate = (isoDate: string) => {
    if (!isoDate) return '';
    const [y, m, d] = isoDate.split('-');
    return `${d}/${m}/${y}`;
  };

  return (
    <>
      <Header />

      <div style={{ padding: '56px 0px 0px' }}></div>
      <Navbar tabs={dashboardTabs} />
      <Navbar tabs={accountantTabs} />

      <div className="my-4" style={{ padding: '0 1.8rem' }}>
        <p className="text-muted mb-3" style={{ fontSize: '0.9rem' }}>
          Transaction locking prevents you and your users from making any changes to transactions
          that might affect your accounts. Once transactions are locked, users cannot edit, modify,
          or delete any transactions that were recorded before the specified date in this module.
        </p>

        <div className="d-flex flex-column gap-3" style={{ padding: '0 1.8rem' }}>
          {modules.map((mod) => {
            const isLocked = locks[mod.key];
            const info = lockInfo[mod.key];

            return (
              <div
                key={mod.key}
                className="d-flex align-items-center justify-content-between px-3 py-3 border rounded-3 bg-white"
                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
              >
                <div className="d-flex align-items-center">
                  <div
                    className="d-flex align-items-center justify-content-center me-3"
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      border: '1px solid #d0d0d0',
                      background: '#f8f8f8',
                    }}
                  >
                    {isLocked ? <Lock size={18} /> : <Unlock size={18} />}
                  </div>

                  <div>
                    <div className="fw-semibold" style={{ fontSize: '0.95rem', color: '#333' }}>
                      {mod.name}
                    </div>

                    {!isLocked && (
                      <div className="text-muted" style={{ fontSize: '0.85rem', marginTop: 2 }}>
                        {mod.description}
                      </div>
                    )}

                    {isLocked && info && (
                      <>
                        <div className="text-muted" style={{ fontSize: '0.85rem', marginTop: 2 }}>
                          Transactions created before <b>{formatDate(info.date)}</b> have been
                          locked.
                        </div>
                        {info.reason && (
                          <div
                            className="text-muted"
                            style={{ fontSize: '0.85rem', marginTop: 4, whiteSpace: 'pre-wrap' }}
                          >
                            <span>
                              <b>Reason: </b>
                              {info.reason}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-link p-0 d-flex align-items-center"
                  style={{ fontSize: '0.9rem', textDecoration: 'none', color: '#4a7cc2' }}
                  onClick={() => (isLocked ? openUnlockModal(mod) : openLockModal(mod))}
                >
                  {isLocked ? (
                    <>
                      <Unlock size={14} className="me-1" /> Unlock
                    </>
                  ) : (
                    <>
                      <Lock size={14} className="me-1" /> Lock
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lock popup modal */}
      {showLockModal && currentModule && (
        <div
          className="d-flex align-items-center justify-content-center"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.35)',
            zIndex: 1050,
          }}
        >
          <div
            className="bg-white"
            style={{
              width: 520,
              maxWidth: '95%',
              borderRadius: 6,
              boxShadow: '0 4px 18px rgba(0,0,0,0.15)',
            }}
          >
            {/* Header */}
            <div
              className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom"
              style={{ backgroundColor: '#f5f5f5' }}
            >
              <h6 className="mb-0">Lock - {currentModule.name}</h6>
              <button
                type="button"
                className="btn btn-sm border-0 text-danger"
                onClick={closeLockModal}
              >
                <X />
              </button>
            </div>

            {/* Body */}
            <div className="px-3 py-3" style={{ fontSize: '0.9rem', color: '#5E5E5E' }}>
              {/* Lock Date row */}
              <div className="d-flex align-items-center mb-3">
                <label className="me-2 mb-0" style={{ width: 110, fontSize: '0.85rem' }}>
                  Lock Date:
                </label>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  style={{ maxWidth: 220 }}
                  value={lockDate}
                  onChange={(e) => setLockDate(e.target.value)}
                />
              </div>

              {/* Reason row */}
              <div className="d-flex align-items-start mb-2">
                <label
                  className="me-2 mb-0"
                  style={{ width: 110, fontSize: '0.85rem', paddingTop: 4 }}
                >
                  Reason:
                </label>
                <textarea
                  className="form-control form-control-sm"
                  style={{ minHeight: 70 }}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter reason for locking this module"
                />
              </div>
            </div>

            {/* Footer: buttons left‑aligned */}
            <div className="d-flex justify-content-start gap-2 px-3 py-2 border-top">
              <button
                type="button"
                className="btn btn-sm"
                style={{ backgroundColor: '#4a7cc2', color: '#fff' }}
                onClick={handleConfirmLock}
              >
                Lock
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={closeLockModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Unlock popup modal */}
      {showUnlockModal && unlockModule && (
        <div
          className="d-flex align-items-center justify-content-center"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.35)',
            zIndex: 1050,
          }}
        >
          <div
            className="bg-white"
            style={{
              width: 520,
              maxWidth: '95%',
              borderRadius: 6,
              boxShadow: '0 4px 18px rgba(0,0,0,0.15)',
            }}
          >
            {/* Header */}
            <div
              className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom"
              style={{ backgroundColor: '#f5f5f5' }}
            >
              <h6 className="mb-0">Unlock - {unlockModule.name}</h6>
              <button
                type="button"
                className="btn btn-sm border-0 text-danger"
                onClick={closeUnlockModal}
              >
                <X />
              </button>
            </div>

            {/* Body: single required reason field in one row */}
            <div className="px-3 py-3" style={{ fontSize: '0.9rem', color: '#5E5E5E' }}>
              <div className="d-flex align-items-start mb-2">
                <label
                  className="me-2 mb-0"
                  style={{ width: 110, fontSize: '0.85rem', paddingTop: 4 }}
                >
                  Reason:<span className="text-danger"> *</span>
                </label>
                <textarea
                  className="form-control form-control-sm"
                  style={{ minHeight: 70 }}
                  value={unlockReason}
                  onChange={(e) => setUnlockReason(e.target.value)}
                  placeholder="Enter reason for unlocking this module"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="d-flex justify-content-start gap-2 px-3 py-2 border-top">
              <button
                type="button"
                className="btn btn-sm"
                style={{ backgroundColor: '#4a7cc2', color: '#fff' }}
                disabled={!unlockReason.trim()}
                onClick={handleConfirmUnlock}
              >
                Unlock
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={closeUnlockModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TransactionLocking;
