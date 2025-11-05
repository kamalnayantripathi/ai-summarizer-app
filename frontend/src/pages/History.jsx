import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import axiosClient from "../api/axiosClient"
import { toast } from "react-toastify"
import { AuthContext } from "../context/AuthContext"

    export const History = () => {

        const [summaries, setSummaries] = useState([])
        const [showArticle, setShowArticle] = useState(false);
        const navigate = useNavigate();
        const {user, token} = useContext(AuthContext)
        console.log(user,token)

        const formatDate = (dateString) => {
            const date = new Date(dateString);
            const day = date.getDate().toString().padStart(2, '0');
            const month = date.toLocaleString('en-US', { month: 'long' });
            const year = date.getFullYear();
            const time = date.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
            });
            
            return `${day}-${month}-${year} at ${time}`;
        };

    const fetchSummaries = async() => {
        try {
            const response = await axiosClient.get("/articles/summaries")
            const data = response.data;
            console.log(data);
            setSummaries(data.summaries)
        } catch (error) {
            console.log(error)
            if(error.response.status===401){
                toast.error("Please login again.")
                navigate("/login")
            }else{
                toast.error(error.response?.data?.message || error.message)
            }
        }
    }

    const deleteSummary = async(id) => {
        console.log(id)
        try {
            const response = await axiosClient.delete(`/articles/summary/${id}`)
            const data = response.data;
            toast.success("Summary deleted successfully.")
            setSummaries(prevSummaries => prevSummaries.filter(s => s._id !== id))
        } catch (error) {
            console.log(error)
            if(error.response.status===401){
                toast.error("Please login again.")
                navigate("/login")
            }else{
                toast.error(error.response?.data?.message || error.message)
            }
        }
    }
    useEffect(()=>{
        fetchSummaries();
    },[])
// if (!user) {
//   return (
//     <div className="flex items-center justify-center py-20">
//       <p>Loading...</p>
//     </div>
//   )
// }else{
    return(
        
        <>
            <div className="w-full min-h-[75vh] md:min-h-[80vh] bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
    <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Summary History
            </h1>
            <p className="text-slate-600 text-lg">Manage and review all your summaries</p>
        </div>
        {/* Summaries Grid or Empty State */}
        <div className="grid gap-6">
        {summaries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center text-slate-600">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-4">
                <i className="bi bi-inboxes text-4xl text-indigo-500"></i>
            </div>
            <h2 className="text-xl font-semibold text-slate-700 mb-2">
                No summaries yet
            </h2>
            <p className="text-slate-500 mb-6">
                You haven’t created any summaries. Start by summarizing an article!
            </p>
            <button
                onClick={() => navigate("/summarize")}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow hover:shadow-lg transition-all duration-200"
            >
                Summarize Now
            </button>
            </div>
        ) : (
            <div className="grid gap-6">
                {summaries.map((summary) => {  
                    return (
                        <div 
                            key={summary._id} 
                            className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 overflow-hidden"
                        >
                            {/* Card Header with colored accent */}
                            <div className="h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                            
                            <div className="p-6 md:p-8">
                                {/* Top Row: Author & Actions */}
                                <div className="flex items-start justify-between mb-6 gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                                                {summary.createdBy?.charAt(0)?.toUpperCase() || 'U'}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-slate-800">
                                                    {summary.createdBy}
                                                </h3>
                                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                                    <i className="bi bi-calendar3"></i>
                                                    <span>{formatDate(summary.createdAt) || "June 14, 2024 - 4:15 PM"}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        {console.log(user?._id, typeof user?._id, summary.userId, typeof summary.userId)}
                                        {(user?._id == summary.userId ) && 
                                        <button 
                                            onClick={() => deleteSummary(summary._id)}
                                            className="px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-200 flex items-center gap-2 text-sm font-medium"
                                            title="Delete"
                                        >
                                            <i className="bi bi-trash"></i>
                                            <span className="hidden sm:inline">Delete</span>
                                        </button>
                                        }
                                    </div>
                                </div>

                                {/* Summary Content */}
                                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100 mb-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                                                <i className="bi bi-stars text-white text-sm"></i>
                                            </div>
                                            <span className="text-sm font-semibold text-slate-800">AI Summary</span>
                                        </div>
                                        <span className="text-xs font-medium text-indigo-600 bg-white px-3 py-1 rounded-full">
                                            {summary.summaryText?.split(' ').length || 0} words
                                        </span>
                                    </div>
                                    <p className="text-slate-700 leading-relaxed">
                                        {summary.summaryText}
                                    </p>
                                </div>

                                {/* Article Section - Collapsible */}
                                <div className="border-t border-slate-200 pt-4">
                                    <button
                                        onClick={() => setShowArticle(!showArticle)}
                                        className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors duration-200 group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-slate-200 group-hover:bg-indigo-100 flex items-center justify-center transition-colors">
                                                <i className="bi bi-file-earmark-text text-slate-600 group-hover:text-indigo-600 transition-colors"></i>
                                            </div>
                                            <div className="text-left">
                                                <span className="text-sm font-semibold text-slate-800 block">
                                                    Original Article
                                                </span>
                                                <span className="text-xs text-slate-500">
                                                    {summary.article?.split(' ').length || 0} words • Click to {showArticle ? 'hide' : 'view'}
                                                </span>
                                            </div>
                                        </div>
                                        <i className={`bi bi-chevron-${showArticle ? 'up' : 'down'} text-slate-400 text-lg transition-transform duration-200`}></i>
                                    </button>

                                    {/* Expandable Article Content */}
                                    {showArticle && (
                                        <div className="mt-4 bg-slate-50 rounded-xl p-6 border border-slate-200 animate-fade-in">
                                            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto">
                                                {summary.article}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Metadata Footer */}
                                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100 text-sm text-slate-500">
                                    <span className="flex items-center gap-1">
                                        <i className="bi bi-clock-history"></i>
                                        Last modified {formatDate(summary.updatedAt)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        )}
        </div>
    </div>
</div>
        </>
    )
}
// }