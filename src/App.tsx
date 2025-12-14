import AppRouter from "./router/AppRouter";
import { Toast } from "./components/Toast/Toast";
import { useGlobalToast } from "./components/Toast/ToastContext";

function App() {
  const { toast, setToast } = useGlobalToast();
  return (
    <>
      <Toast toast={toast} setToast={setToast} />
      <AppRouter />
    </>
  );
}

export default App;
