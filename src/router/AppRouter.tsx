import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard/dashboard";

function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<Dashboard />} />
        </Routes>
    );
}

export default AppRouter;
