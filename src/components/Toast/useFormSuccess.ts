import { useEffect } from 'react';
import { useGlobalToast } from './ToastContext';

/**
 * useFormSuccess Hook
 * Checks sessionStorage for a success message from form submission
 * Displays toast if found, then clears the flag
 * Usage: useFormSuccess() in your list/destination page component
 */
export const useFormSuccess = () => {
  const { showToast } = useGlobalToast();

  useEffect(() => {
    const successMessage = sessionStorage.getItem('formSuccess');
    if (successMessage) {
      showToast(successMessage, 'success');
      sessionStorage.removeItem('formSuccess');
    }
  }, [showToast]);
};

export default useFormSuccess;
