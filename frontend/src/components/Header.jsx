import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const Header = () => {
    const [active, setActive] = useState(false)
    const navigate = useNavigate();
    const { token, logout } = useContext(AuthContext);

    function handleLogout(){
        logout();
        navigate("/login")
    }

    return(
        <>
            <header className="bg-gradient-to-br from-[#c9d3f0] via-[#4C6FEA] to-[#152689] text-white min-h-[70px] p-5 shadow-lg shadow-[#c9d3f0]/40">
                <nav className="h-full flex justify-between items-center">
                    <h1 className="font-bold text-xl md:text-2xl ml-15">
                        <NavLink
                            to="/"
                        >
                            Suvidha Foundation
                        </NavLink>
                    </h1>
                    <ul className="flex justify-between gap-15 pr-5 font-semibold text-lg">
                        <li>
                            <NavLink
                                to="/summarize"
                            >
                                Summarize
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/history"
                            >
                                History
                            </NavLink>
                        </li>
                        {token && (
                            <li
                                onClick={() => setActive(!active)}
                                className="relative cursor-pointer flex items-center justify-center"
                                >
                                <i className="bi bi-person-circle text-white text-2xl hover:text-blue-200 transition-colors"></i>
                                {active && (
                                    <div className="absolute top-8 right-1 bg-blue-50 shadow-lg rounded-lg w-28 py-2 animate-fade-in border border-blue-200">
                                    <p
                                        onClick={handleLogout}
                                        className="text-blue-700 text-sm font-medium px-3 py-1 hover:bg-blue-100 rounded cursor-pointer transition-colors"
                                    >
                                        Logout
                                    </p>
                                    </div>
                                )}
                            </li>
                        )}
                    </ul>
                </nav>
            </header>
        </>
    )
}
