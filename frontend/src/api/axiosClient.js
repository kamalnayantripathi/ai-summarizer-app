import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const axiosClient = axios.create({
    // baseURL: "http://localhost:8000/api"
    baseURL: `${API_URL}/api`
});

axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if(token) config.headers.Authorization = `Bearer ${token}`
        return config;
    },
    (error) => Promise.reject(error)
)

axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if(error.response?.status === 401){
            console.log("Unauthorized! logging out...");
            localStorage.removeItem("token")
            localStorage.removeItem("name")
        }
        return Promise.reject(error)
    }
)


export default axiosClient;