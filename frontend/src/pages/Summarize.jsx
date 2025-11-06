import { toast } from "react-toastify"
import axiosClient from "../api/axiosClient"
import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext.jsx"

export const Summarize = () => {

    const [article, setArticle] = useState("")
    const [summary, setSummary] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);

    useEffect(() => {
        if(!token){
            toast.error("Please login to access this page.")
            navigate("/login")
        }
    }, [])

    const handleChange = (e) => {
        // // console.log(e.target.value)
        setArticle(e.target.value)
    }
    // // console.log("article: ",article, "\n summary: ",summary)   

    const articleSummaryAPI = async(e) => {
        e.preventDefault();
        try {
            setLoading(true)
            // const text = e.target.article.value;
            // console.log("article", article)
            const response = await axiosClient.post("/articles/create-summary", { article })
            const data = response.data;
            // console.log("data: ",data)
            setSummary(data.summary)   
        } catch (error) {
            // console.log(error)
            if(error.response.status===401){
                toast.error("Please login again.")
                navigate("/login")
            }else{
                toast.error(error.response?.data?.message || error.message)
            }
        } finally{
            setLoading(false)
        }
    }

    const saveSummary = async(e) => {
        e.preventDefault()
        try {
            const response = await axiosClient.post("/articles/summary",{ article, summaryText: summary })
            const data = response.data;
            // console.log("saved: ",data)
            navigate("/history")
        } catch (error) {
            // console.log(error)
            if(error.response.status===401){
                toast.error("Please login again.")
                navigate("/login")
            }else{
                toast.error(error.response?.data?.message || error.message)
            }
        }
    }

    return(
        <>
            <div className="w-full min-h-[75vh] md:min-h-[80vh] bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex justify-center items-center p-6">
    <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-8">
        {/* Original Text Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-xl">
            {/* Header with gradient accent */}
            <div className="h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
            
            <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                        <i className="bi bi-file-text text-white text-xl"></i>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">Original Text</h2>
                </div>
                
                <form onSubmit={articleSummaryAPI} className="flex flex-col gap-6">
                    <div className="relative">
                        <label className="block text-sm font-medium text-slate-600 mb-2">
                            Paste your content here
                        </label>
                        <textarea 
                            className="w-full h-[280px] bg-slate-50 border-2 border-slate-200 rounded-xl p-4 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all duration-200 resize-none"
                            placeholder="Enter the article or text you want to summarize..."
                            name="article" 
                            id="article" 
                            value={article}
                            onChange={handleChange}
                        ></textarea>
                        <div className="absolute bottom-3 right-3 text-xs text-slate-400">
                            {article.length} characters
                        </div>
                    </div>
                    
                    <button
                        disabled={loading || !article.trim()}
                        className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2
                            ${loading || !article.trim()
                            ? "bg-slate-300 text-slate-500 cursor-not-allowed" 
                            : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            }`}
                    >
                        {loading ? (
                            <>
                                <span className="inline-flex animate-spin">
                                    <i className="bi bi-arrow-repeat text-xl"></i>
                                </span>
                                <span>Processing...</span>
                            </>
                        ) : (
                            <>
                                <i className="bi bi-magic text-xl"></i>
                                <span>Summarize Text</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>

        {/* Summarized Insights Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-xl">
            {/* Header with gradient accent */}
            <div className="h-1.5 bg-gradient-to-r from-purple-500 to-pink-500"></div>
            
            <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <i className="bi bi-lightbulb text-white text-xl"></i>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">Summarized Insights</h2>
                </div>
                
                <div className="flex flex-col gap-6">
                    {/* Summary Display Area */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-slate-600 mb-2">
                            Generated summary
                        </label>
                        <div className="w-full h-[280px] bg-slate-50 border-2 border-slate-200 rounded-xl p-4 overflow-auto">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center h-full text-indigo-600">
                                    <span className="inline-flex animate-spin mb-3">
                                        <i className="bi bi-gear-fill text-4xl"></i>
                                    </span>
                                    <p className="text-lg font-medium">Analyzing your text...</p>
                                    <p className="text-sm text-slate-500 mt-1">This may take a few moments</p>
                                </div>
                            ) : summary ? (
                                <div className="prose prose-slate max-w-none">
                                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                                        {summary}
                                    </p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                    <i className="bi bi-chat-left-dots text-5xl mb-3"></i>
                                    <p className="text-center">Your summary will appear here...</p>
                                    <p className="text-sm text-center mt-1">Start by entering text in the left panel</p>
                                </div>
                            )}
                        </div>
                        {summary && !loading && (
                            <div className="absolute bottom-3 right-3 text-xs text-slate-400">
                                {summary.split(' ').length} words
                            </div>
                        )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            disabled={!summary || loading}
                            onClick={() => {
                                navigator.clipboard.writeText(summary);
                                // Optionally add a toast notification here
                            }}
                            className={`py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2
                                ${!summary || loading
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:shadow-md"
                                }`}
                        >
                            <i className="bi bi-clipboard text-lg"></i>
                            <span>Copy</span>
                        </button>
                        
                        <button
                            disabled={loading || !summary}
                            onClick={saveSummary}
                            className={`py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2
                                ${loading || !summary
                                ? "bg-slate-300 text-slate-500 cursor-not-allowed" 
                                : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                }`}
                        >
                            {loading ? (
                                <>
                                    <span className="inline-flex animate-spin">
                                        <i className="bi bi-arrow-repeat"></i>
                                    </span>
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-bookmark-check text-lg"></i>
                                    <span>Save</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
        </>
    )
}