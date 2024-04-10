// AuthContext.js
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        checkAuthentication();
    }, []);

    const checkAuthentication = () => {
        const token = localStorage.getItem("authToken");
        setLoading(true);

        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        fetch("/api/check-auth", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Authentication failed");
                }

                return res.json();
            })
            .then((data) => {
                setUser(data.user);
            })
            .catch(() => {
                setUser(null);
            })
            .finally(() => setLoading(false));
    };

    const login = (user) => {
        setErrors([]);
        setLoading(true);
        fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
        })
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    data.map((message) => {
                        setErrors((prev) => [...prev, message.error]);
                        return console.log(message.error);
                    });
                } else if (data.error) {
                    setErrors((prev) => [...prev, data.error]);
                } else {
                    setUser(data.user);
                    localStorage.setItem("authToken", data.token);
                    navigate("/");
                }
            })
            .catch((error) => {
                console.error("Login failed:", error);
                setUser(null);
            })
            .finally(() => setLoading(false));
    };

    const logout = () => {
        setUser(null);
        localStorage.clear();
    };

    const signUp = (user) => {
        setErrors([]);
        setLoading(true);
        fetch("/api/sign-up", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
        })
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    data.map((message) => {
                        setErrors((prev) => [...prev, message.msg]);
                        return;
                    });
                } else if (data.error) {
                    setErrors((prev) => [...prev, data.error]);
                } else {
                    navigate("/login");
                }
            })
            .catch((error) => {
                console.error(error);
                setErrors(error);
            })
            .finally(() => setLoading(false));
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, signUp, errors, setErrors, loading, setUser }}>{children}</AuthContext.Provider>
    );
};
