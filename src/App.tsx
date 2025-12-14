import React from "react";
import AppRouter from "./router/AppRouter";
import "./index.css";

/**
 * Root application component.
 * Keep this file minimal — use `AppRouter` for route handling
 * and move global providers (theme, auth) here when needed.
 */
const App: React.FC = () => {
	return <AppRouter />;
};

export default App;
