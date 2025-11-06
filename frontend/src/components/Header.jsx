import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const Header = () => {
    const [active, setActive] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const navigate = useNavigate();
    const { token, logout } = useContext(AuthContext);

    function handleLogout(){
        logout();
        navigate("/login")
    }

    return(
        <>
            <header className="bg-gradient-to-br from-[#c9d3f0] via-[#4C6FEA] to-[#152689] text-white min-h-[70px] p-4 md:p-5 shadow-lg shadow-[#c9d3f0]/40">
                <nav className="h-full flex items-center justify-between max-w-7xl mx-auto">
                    <div className="flex items-center gap-4">
                        <h1 className="font-bold text-lg md:text-2xl">
                            <NavLink to="/">Suvidha Foundation</NavLink>
                        </h1>
                    </div>

                    {/* Desktop links */}
                    <ul className="hidden md:flex items-center gap-6 pr-2 font-semibold text-lg">
                        <li>
                            <NavLink to="/summarize">Summarize</NavLink>
                        </li>
                        <li>
                            <NavLink to="/history">History</NavLink>
                        </li>
                        {token && (
                            <li className="relative">
                                <button
                                    onClick={() => setActive(!active)}
                                    className="flex items-center justify-center"
                                    aria-label="Profile"
                                >
                                    <i className="bi bi-person-circle text-white text-2xl hover:text-blue-200 transition-colors"></i>
                                </button>

                                {active && (
                                    <div className="absolute top-10 right-0 bg-blue-50 shadow-lg rounded-lg w-32 py-2 animate-fade-in border border-blue-200 z-20">
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

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
                            aria-label="Toggle menu"
                        >
                            {mobileOpen ? (
                                <i className="bi bi-x-lg text-white text-2xl"></i>
                            ) : (
                                <i className="bi bi-list text-white text-2xl"></i>
                            )}
                        </button>
                    </div>
                </nav>

                {/* Mobile menu panel */}
                {mobileOpen && (
                    <div className="md:hidden bg-gradient-to-br from-[#c9d3f0] via-[#4C6FEA] to-[#152689] text-white border-t border-white/10">
                        <div className="flex flex-col gap-2 px-4 py-3">
                            <NavLink to="/summarize" onClick={() => setMobileOpen(false)} className="py-2">Summarize</NavLink>
                            <NavLink to="/history" onClick={() => setMobileOpen(false)} className="py-2">History</NavLink>
                            {token && (
                                <button onClick={() => { setMobileOpen(false); handleLogout(); }} className="text-left py-2">Logout</button>
                            )}
                        </div>
                    </div>
                )}
            </header>
        </>
    )
}
