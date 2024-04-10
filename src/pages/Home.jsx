import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { v4 as uuid } from "uuid";
import LoadingScreen from "../components/Loading";
import { AuthContext } from "../context/AuthContext";

function Home() {
    const [messages, setMessages] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);

    const { user } = useContext(AuthContext);

    const delete_message = (id) => {
        const storedToken = localStorage.getItem("authToken");
        fetch(`/api/delete-message/${id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${storedToken}` },
        })
            .then((res) => res.json())
            .then(() => {
                setMessages((prevMessages) => {
                    return prevMessages.filter((message) => message._id !== id);
                });
            })
            .catch((error) => console.log(error));
    };

    const handleScroll = (e) => {
        if (
            e.target.documentElement.scrollHeight - (e.target.documentElement.scrollTop + window.innerHeight) < 100 &&
            messages.length < totalCount
        ) {
            setLoading(true);
        }
    };

    useEffect(() => {
        if (loading) {
            const fetchData = () => {
                fetch(`/api/messages?page=${page}`)
                    .then((res) => res.json())
                    .then((data) => {
                        if (data.error) return console.log(data);
                        setMessages((prevMessages) => [...prevMessages, ...data.formattedMessages]);
                        setPage((prevPage) => prevPage + 1);
                        setTotalCount(data.totalCount);
                    })
                    .catch((error) => console.error(error))
                    .finally(() => {
                        setLoading(false);
                    });
            };
            fetchData();
        }
    }, [loading]);

    useEffect(() => {
        document.addEventListener("scroll", handleScroll);
        return () => document.removeEventListener("scroll", handleScroll);
    }, [messages.length, totalCount]);

    return (
        <div className="flex flex-col gap-2 py-5">
            <div className="flex flex-col md:flex-col gap-3 justify-center items-center ">
                <>
                    {user !== null && (
                        <Link
                            className="w-fit h-13 px-6 py-4 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white text-xl font-bold rounded-lg"
                            to={"/create-message"}
                        >
                            Create New Message
                        </Link>
                    )}
                    <div className="flex flex-row gap-2">
                        {user && !user.is_member && (
                            <Link
                                className="h-13 px-4 py-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-bold rounded-lg"
                                to={"/become-member"}
                            >
                                Become a Member
                            </Link>
                        )}
                        {user && !user.is_admin && (
                            <Link
                                className="h-13 px-4 py-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-bold rounded-lg"
                                to={"/become-admin"}
                            >
                                Become an Admin
                            </Link>
                        )}
                    </div>
                </>
            </div>
            <div className="flex flex-col gap-3">
                {messages.length > 0 ? (
                    <>
                        {messages.map((message) => {
                            return (
                                <div
                                    key={uuid()}
                                    className="flex flex-col rounded-lg border-2 border-slate-200 gap-2 p-6 bg-white w-[500px]"
                                >
                                    <h1 className="text-xl font-bold">{message?.title}</h1>
                                    <p className="text-md">{message.text}</p>
                                    {user?.is_member ? (
                                        <div className="flex flex-col gap-2">
                                            <div className="flex flex-row justify-between text-md text-slate-700">
                                                <h1>{message.author.username}</h1>
                                                <h2>{message.timestamp_formatted}</h2>
                                            </div>
                                        </div>
                                    ) : (
                                        <></>
                                    )}
                                    {user?.is_admin ? (
                                        <div className="flex items-end justify-end">
                                            <button
                                                className="text-white h-12 px-4 py-2 w-fit font-semibold rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800"
                                                id={message._id}
                                                onClick={(e) => delete_message(e.target.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                            );
                        })}
                        {loading && <LoadingScreen />}
                    </>
                ) : (
                    <LoadingScreen />
                )}
            </div>
        </div>
    );
}

export default Home;
