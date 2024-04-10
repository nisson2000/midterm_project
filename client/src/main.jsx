import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, useNavigate } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";

function HandleRedirect() {
  const navigate = useNavigate();

  React.useEffect(() => {
    const redirectPath = sessionStorage.redirect;
    delete sessionStorage.redirect;
    if (redirectPath) {
      navigate(redirectPath);
    }
  }, [navigate]);

  return null;
}

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <HandleRedirect />
            <AuthProvider>
                <App />
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
);
