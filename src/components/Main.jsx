import { Route, Routes } from "react-router-dom";
import NotFound from "../pages/404";
import BecomeAdminPage from "../pages/BecomeAdmin";
import BecomeMemberPage from "../pages/BecomeMember";
import Home from "../pages/Home";
import Login from "../pages/LoginForm";
import NewMessageForm from "../pages/NewMessageForm";
import SignUpForm from "../pages/SignUpForm";

function Main() {
    return (
        <main className="flex justify-center h-auto">
            <Routes>
                <Route path="/sign-up" element={<SignUpForm />} />
                <Route path="/login" element={<Login />} />
                <Route path="/create-message" element={<NewMessageForm />} />
                <Route path="/become-member" element={<BecomeMemberPage />} />
                <Route path="/become-admin" element={<BecomeAdminPage />} />
                <Route path="/" element={<Home />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </main>
    );
}

export default Main;
