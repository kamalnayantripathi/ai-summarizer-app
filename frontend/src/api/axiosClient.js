import axios from "axios";

const axiosClient = axios.create({
    baseURL: "http://localhost:8000/api"
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