import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import LoadingScreen from "../components/Loading";
import { AuthContext } from "../context/AuthContext";

function Login() {
    const { user, login, errors, setErrors, loading } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        setErrors([]);
        if (user !== null && !loading) {
            navigate("/");
        }
    }, [user]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const user = {
            email: e.target.elements.email.value,
            password: e.target.elements.password.value,
        };
        login(user);
    };

    return (
        <>
            {loading ? (
                <LoadingScreen />
            ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5">
                    <div className="flex flex-col gap-1 rounded-md">
                        <label htmlFor="email">Email</label>
                        <input name="email" placeholder="email" type="email" required={true} className=" p-2" />
                    </div>
                    <div className="flex flex-col gap-1 rounded-md">
                        <label htmlFor="password">Password</label>
                        <input name="password" placeholder="password" type="password" required={true} className=" p-2" />
                    </div>
                    {errors.length > 0 ? (
                        <div className="bg-red-700 text-red-200 p-2 rounded-lg">
                            {errors.map((error) => {
                                return (
                                    <p key={uuid()} className="m-2">
                                        {error}
                                    </p>
                                );
                            })}
                        </div>
                    ) : (
                        <div></div>
                    )}
                    <button className="h-13 px-4 py-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-bold rounded-lg">
                        Login
                    </button>
                </form>
            )}
        </>
    );
}

export default Login;
