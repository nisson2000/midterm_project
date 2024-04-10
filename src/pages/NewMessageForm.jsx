import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import LoadingScreen from "../components/Loading";
import { AuthContext } from "../context/AuthContext";

function NewMessageForm() {
    const { user, loading } = useContext(AuthContext);
    const [errors, setErrors] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (user === null && !loading) {
            navigate("/login");
        }
    }, [user, loading]);

    const create_message = (e) => {
        e.preventDefault();
        setErrors([]);
        const storedToken = localStorage.getItem("authToken");
        fetch("/api/create-message", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${storedToken}` },
            body: JSON.stringify({
                title: e.target.elements.title.value.trim(),
                text: e.target.elements.text.value.trim(),
                id: user.id,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    data.map((message) => {
                        setErrors((prev) => [...prev, message.msg]);
                        return console.log(message.msg);
                    });
                } else {
                    navigate("/");
                }
            })
            .catch((error) => console.error(error));
    };

    return (
        <>
            {loading ? (
                <LoadingScreen />
            ) : (
                <div className="flex flex-col items-center p-5">
                    <h1 className="text-2xl font-bold pb-4"> Create new message</h1>
                    <form className="flex flex-col gap-4 text-lg p-5" onSubmit={create_message}>
                        <div className="flex flex-col gap-1 rounded-md">
                            <label htmlFor="title">Title</label>
                            <input name="title" type="text" className="p-2" required={true} />
                        </div>
                        <div className="flex flex-col gap-1 rounded-md">
                            <label htmlFor="text">Message</label>
                            <textarea name="text" className="p-2 resize-none" rows={5} />
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
                        <button
                            type="submit"
                            className="h-13 px-4 py-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-bold rounded-lg"
                        >
                            Create
                        </button>
                    </form>
                </div>
            )}
        </>
    );
}

export default NewMessageForm;
