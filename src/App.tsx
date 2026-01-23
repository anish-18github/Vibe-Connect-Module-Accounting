import AppRouter from "./router/AppRouter";
import { ToastProvider, useGlobalToast } from "./components/Toast/ToastContext";
import { LoadingOverlay } from "./components/Loading/LoadingOverlay";
import { LoadingProvider, useLoading } from "./Contexts/Loadingcontext";
import Toast from "./components/Toast/Toast";

function App() {
  return (
    <>
      <LoadingProvider>
        <ContentWithLoading />
      </LoadingProvider>
    </>
  );
}

const ContentWithLoading = () => {
  const { isLoading } = useLoading();  // ✅ Loading context
  
  // ✅ Toast context (needed for Toast component)
  const { toast, setToast } = useGlobalToast();

  return (
    <>
      <ToastProvider>
        {/* ✅ PASS toast + setToast props */}
        <LoadingOverlay open={isLoading} />
        <Toast toast={toast} setToast={setToast} />
        <AppRouter />
      </ToastProvider>
    </>
  );
};

export default App;
