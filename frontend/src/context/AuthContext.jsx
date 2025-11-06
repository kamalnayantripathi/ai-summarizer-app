import { createContext, useContext, useState, useEffect } from "react";
import axiosClient from "../api/axiosClient.js";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");


  const fetchUserProfile = async () => {
    if(!token) return;
    try {
      const response = await axiosClient.get("/user")
      const data = response.data;
      // console.log(data)
      setUser(response.data.user)
    } catch (error) {
      console.log("Failed to fetch user profile: ",error.message)
      setUser(null)
      setToken("");
      localStorage.removeItem("token")
    }
  }

  useEffect(() => {
    if (token){ 
      localStorage.setItem("token", token);
      fetchUserProfile()
    }
    else localStorage.removeItem("token");
  }, [token]);

const login = async (credentials) => {
  try {
      const response = await axiosClient.post("/users/login", credentials)
      const data = response.data;
      if(data.token){
          // console.log("User logged in successfully: ", data)
          setUser(data.user)
          setToken(data.token)
          localStorage.setItem("token", data.token);
          return true;
      }else {
          throw new Error("Invalid response: token missing");
      }

    } catch (error) {
        console.error("Login failed in context:", error);
        // Rethrow the error so components can catch it
        throw error;
    }
};

  const logout = () => {
    setUser(null);
    setToken("");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// export const useAuth = () => useContext(AuthContext);
