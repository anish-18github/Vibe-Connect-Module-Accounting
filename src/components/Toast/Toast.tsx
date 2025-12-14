import React, { useState, useCallback } from 'react';
import './toast.css';

export type ToastType = 'success' | 'error' | 'info' | 'warning';
export type ToastStage = 'hidden' | 'enter' | 'exit';

export interface ToastState {
  message: string;
  type: ToastType;
  stage: ToastStage;
}

interface ToastProps {
  toast: ToastState;
  setToast: React.Dispatch<React.SetStateAction<ToastState>>;
}

/**
 * Reusable Toast Component
 * Displays notifications with smooth animations
 * Use with useToast hook or manage state manually
 */
export const Toast: React.FC<ToastProps> = ({ toast, setToast }) => {
  if (toast.stage === 'hidden') return null;

  const handleClose = () => {
    setToast((prev) => ({ ...prev, stage: 'exit' }));
    window.setTimeout(() => setToast((prev) => ({ ...prev, stage: 'hidden' })), 350);
  };

  return (
    <div
      className={`custom-toast custom-toast-${toast.type} ${toast.stage}`}
      role="alert"
      aria-live="polite"
    >
      <div className="toast-body">{toast.message}</div>
      <button className="toast-close btn btn-sm" onClick={handleClose} aria-label="Close">
        ×
      </button>
    </div>
  );
};

/**
 * useToast Hook
 * Provides state management and helper functions for toast notifications
 * Usage:
 *   const { toast, setToast, showToast } = useToast();
 *   showToast('Success!', 'success');
 */
export const useToast = () => {
  const [toast, setToast] = useState<ToastState>({
    message: '',
    type: 'info',
    stage: 'hidden',
  });

  const showToast = useCallback(
    (message: string, type: ToastType = 'info', duration: number = 3000) => {
      setToast({ message, type, stage: 'enter' });

      // Exit animation
      const exitTimer = window.setTimeout(() => {
        setToast((prev) => ({ ...prev, stage: 'exit' }));
      }, duration);

      // Reset to hidden
      const resetTimer = window.setTimeout(() => {
        setToast((prev) => ({ ...prev, stage: 'hidden' }));
      }, duration + 350);

      return () => {
        clearTimeout(exitTimer);
        clearTimeout(resetTimer);
      };
    },
    [],
  );

  return { toast, setToast, showToast };
};

export default Toast;
