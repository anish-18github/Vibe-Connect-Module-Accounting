import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useGlobalToast } from './ToastContext';

const useFormSuccess = () => {
  const location = useLocation();
  const { showToast } = useGlobalToast();

  useEffect(() => {
    if (location.state?.successMessage) {
      showToast(location.state.successMessage, 'success');
      window.history.replaceState({}, document.title);
    }
  }, [location.state, showToast]);
};

export default useFormSuccess;
