import React, { createContext, useContext, useCallback, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';
export type ToastStage = 'hidden' | 'enter' | 'exit';

export interface ToastState {
  message: string;
  type: ToastType;
  stage: ToastStage;
}

interface ToastContextType {
  toast: ToastState;
  setToast: React.Dispatch<React.SetStateAction<ToastState>>;
  showToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<ToastState>({
    message: '',
    type: 'info',
    stage: 'hidden',
  });

  const showToast = useCallback(
    (message: string, type: ToastType = 'info', duration: number = 4000) => {
      setToast({ message, type, stage: 'enter' });

      // Exit animation
      const exitTimer = setTimeout(() => {
        setToast((prev) => ({ ...prev, stage: 'exit' }));
      }, duration);

      // Reset to hidden
      const resetTimer = setTimeout(() => {
        setToast((prev) => ({ ...prev, stage: 'hidden' }));
      }, duration + 350);

      return () => {
        clearTimeout(exitTimer);
        clearTimeout(resetTimer);
      };
    },
    [],
  );

  return (
    <ToastContext.Provider value={{ toast, setToast, showToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useGlobalToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useGlobalToast must be used within ToastProvider');
  }
  return context;
};
