import React from 'react';
import {
  Alert,
  Snackbar,
} from '@mui/material';
import {
  CheckCircle,
  Error,
  Info,
  Warning,
} from '@mui/icons-material';

export type ToastType = 'success' | 'error' | 'info' | 'warning';
export type ToastStage = 'enter' | 'exit' | 'hidden';

export interface ToastState {
  message: string;
  type: ToastType;
  stage: ToastStage;
}

interface ToastProps {
  toast: ToastState;
  setToast: React.Dispatch<React.SetStateAction<ToastState>>;
}

export const Toast: React.FC<ToastProps> = ({ toast, setToast }) => {
  // ✅ FIXED: Type-safe visibility check
  const isVisible = toast.message && toast.stage !== 'hidden';
  if (!isVisible) return null;

  const handleClose = () => {
    setToast((prev) => ({ ...prev, stage: 'exit' }));
    setTimeout(() => {
      setToast((prev) => ({ ...prev, stage: 'hidden' }));
    }, 350);
  };

  const severityMap: Record<ToastType, 'success' | 'error' | 'warning' | 'info'> = {
    success: 'success',
    error: 'error',
    warning: 'warning',
    info: 'info',
  };

  const severity = severityMap[toast.type];

  const iconMap: Record<ToastType, React.ReactNode> = {
    success: <CheckCircle />,
    error: <Error />,
    warning: <Warning />,
    info: <Info />,
  };

  return (
    <Snackbar
      open={isVisible}  // ✅ FIXED: No TypeScript warning
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      sx={{
        '& .MuiSnackbarContent-root': {
          minWidth: 400,
          maxWidth: 500,
        },
      }}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        variant="filled"
        sx={{
          width: '100%',
          fontWeight: 500,
          '& .MuiAlert-icon': {
            fontSize: '1.25rem',
          },
        }}
        icon={iconMap[toast.type]}
      >
        {toast.message}
      </Alert>
    </Snackbar>
  );
};

export default Toast;
