import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Dashboard = () => {

    const [name, setName] = useState("Kamal")
    const { token, user } = useContext(AuthContext);
    const navigate = useNavigate();
    console.log(user, token)

    useEffect(() => {
        if(!token){
            toast.error("Please login to access this page.")
            navigate("/login")
        }
        if(user?.name){
            setName(user?.name)
        }
    }, [])

    return(
        <>
            <main className="flex-1 bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
    <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Header */}
        <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Welcome back, {name || "User"}!
            </h2>
            <p className="text-slate-600 text-lg">Here's your summarization activity overview</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Stats & Activity */}
            <div className="lg:col-span-2 space-y-8">
                {/* Activity Stats */}
                <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <i className="bi bi-graph-up text-indigo-600"></i>
                        Your Activity Overview
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {/* Summaries Completed Card */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all duration-300 group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                                    <i className="bi bi-file-text text-white text-2xl"></i>
                                </div>
                                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                    +12% this week
                                </span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-3xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">21</p>
                                <p className="text-sm font-medium text-slate-600">Summaries Completed</p>
                                <p className="text-xs text-slate-400">Total documents processed</p>
                            </div>
                        </div>

                        {/* Words Processed Card */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all duration-300 group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                    <i className="bi bi-type text-white text-2xl"></i>
                                </div>
                                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                                    +8% this week
                                </span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-3xl font-bold text-slate-800 group-hover:text-purple-600 transition-colors">15,892</p>
                                <p className="text-sm font-medium text-slate-600">Words Processed</p>
                                <p className="text-xs text-slate-400">Across all summaries</p>
                            </div>
                        </div>

                        {/* Time Saved Card */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all duration-300 group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                                    <i className="bi bi-clock-history text-white text-2xl"></i>
                                </div>
                                <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                                    Amazing!
                                </span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-3xl font-bold text-slate-800 group-hover:text-amber-600 transition-colors">12.5h</p>
                                <p className="text-sm font-medium text-slate-600">Time Saved</p>
                                <p className="text-xs text-slate-400">Estimated reading time</p>
                            </div>
                        </div>

                        {/* Avg Summary Length Card */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all duration-300 group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
                                    <i className="bi bi-bar-chart text-white text-2xl"></i>
                                </div>
                                <span className="text-xs font-medium text-teal-600 bg-teal-50 px-2 py-1 rounded-full">
                                    Optimal
                                </span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-3xl font-bold text-slate-800 group-hover:text-teal-600 transition-colors">320</p>
                                <p className="text-sm font-medium text-slate-600">Avg Words/Summary</p>
                                <p className="text-xs text-slate-400">Perfect conciseness</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Summaries */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <i className="bi bi-clock text-indigo-600"></i>
                            Recent Summaries
                        </h3>
                        <Link
                            to="/history"
                            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors"
                        >
                            View all
                            <i className="bi bi-arrow-right"></i>
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {/* Summary Item 1 */}
                        <div className="bg-white rounded-xl p-5 border border-slate-200 hover:shadow-md transition-all duration-300 group">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                                    <i className="bi bi-file-earmark-text text-indigo-600 text-xl"></i>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                                        Ethics Debate Summary
                                    </h4>
                                    <p className="text-sm text-slate-500">June 16, 2024 • 450 words</p>
                                </div>
                                <Link
                                    to="/history"
                                    className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg font-medium text-sm hover:bg-indigo-100 transition-colors flex items-center gap-2"
                                >
                                    <i className="bi bi-eye"></i>
                                    View
                                </Link>
                            </div>
                        </div>

                        {/* Summary Item 2 */}
                        <div className="bg-white rounded-xl p-5 border border-slate-200 hover:shadow-md transition-all duration-300 group">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center flex-shrink-0">
                                    <i className="bi bi-file-earmark-text text-purple-600 text-xl"></i>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-slate-800 truncate group-hover:text-purple-600 transition-colors">
                                        Space Tourism Report
                                    </h4>
                                    <p className="text-sm text-slate-500">June 15, 2024 • 680 words</p>
                                </div>
                                <Link
                                    to="/history"
                                    className="px-4 py-2 bg-purple-50 text-purple-600 rounded-lg font-medium text-sm hover:bg-purple-100 transition-colors flex items-center gap-2"
                                >
                                    <i className="bi bi-eye"></i>
                                    View
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column - CTA Card */}
            <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-2xl sticky top-24 overflow-hidden relative">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>
                    
                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
                            <i className="bi bi-magic text-4xl"></i>
                        </div>
                        
                        <h3 className="text-3xl font-bold mb-3">
                            Ready to Summarize?
                        </h3>
                        <p className="text-indigo-100 mb-8 leading-relaxed">
                            Transform lengthy articles into concise, actionable insights with our AI-powered tool.
                        </p>
                        
                        <Link to="/summarize">
                            <button className="w-full bg-white text-indigo-600 font-bold py-4 px-6 rounded-xl hover:bg-indigo-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2 group">
                                <span>Start Summarizing</span>
                                <i className="bi bi-arrow-right text-lg group-hover:translate-x-1 transition-transform"></i>
                            </button>
                        </Link>

                        <div className="mt-6 pt-6 border-t border-white/20">
                            <p className="text-sm text-indigo-100 flex items-center gap-2">
                                <i className="bi bi-lightning-charge-fill"></i>
                                Average processing time: <span className="font-semibold text-white">2 seconds</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>
        </>
    )
}