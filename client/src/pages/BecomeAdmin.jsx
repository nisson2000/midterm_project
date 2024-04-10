import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import LoadingScreen from "../components/Loading";
import { AuthContext } from "../context/AuthContext";

function BecomeAdminPage() {
    const navigate = useNavigate();
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);
    const { setUser } = useContext(AuthContext);

    const become_admin = (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors([]);
        const storedToken = localStorage.getItem("authToken");

        fetch("/api/become-admin", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${storedToken}` },
            body: JSON.stringify({ code: e.target.elements.passcode.value.trim() }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    setErrors((prev) => [...prev, data.error]);
                    return;
                } else {
                    setUser(data.user);
                    navigate("/");
                }
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    };

    return (
        <>
            {loading ? (
                <LoadingScreen />
            ) : (
                <div className="flex flex-col justify-center p-16 gap-2">
                    <h1 className="font-bold text-3xl">
                        Become an <strong className="text-blue-500">Admin</strong>
                    </h1>
                    <p>
                        enter the correct passcode to become an <strong className="text-blue-500">Admin</strong>
                    </p>
                    <form className="flex flex-col justify-center gap-2" onSubmit={become_admin}>
                        <input type="text" name="passcode" className="pt-2 pb-2 rounded-lg" />
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
                            Submit
                        </button>
                    </form>
                </div>
            )}
        </>
    );
}

export default BecomeAdminPage;
