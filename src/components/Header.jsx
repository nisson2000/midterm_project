import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Header() {
    const { user, logout } = useContext(AuthContext);

    return (
        <header className="border-b-2 border-neutral-300 p-5 bg-white">
            <div className="flex flex-row justify-between text-2xl font-bold px-6">
                <div>
                    <Link className="text-3xl hover:underline hover:opacity-70 active:opacity-75 flex" to={"/"}>
                        <h1 className="text-blue-500">Members</h1>Only
                    </Link>
                </div>
                <div className="flex flex-row justify-center gap-2">
                    {user !== null ? (
                        <div className="text-xl flex flex-row gap-3">
                            <h1>{user.username}</h1>
                            <button className="ml-1 mt-1 h-fit hover:opacity-60" onClick={() => logout()}>
                                <img className="w-6 h-auto" src="logout.svg" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-5">
                            <NavLink to={"/sign-up"}>
                                <h1 className="hover:underline">Sign up</h1>
                            </NavLink>
                            <NavLink to={"/login"}>
                                <h1 className="hover:underline">Login</h1>
                            </NavLink>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;
