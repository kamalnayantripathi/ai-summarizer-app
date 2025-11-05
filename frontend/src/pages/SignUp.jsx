import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axiosClient from "../api/axiosClient";
import { toast } from "react-toastify";

export const SignUp = () => {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    })
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const [showPass, setShowPass] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const navigate = useNavigate();

    const handleChange = (e) => {
        const name = e.target.name
        console.log(errors)
        setFormData((prev) => ({
            ...prev,
            [name]: e.target.value
        }))

        setErrors(prev => ({
            ...prev,
            [name]: ""
        }))
    }

    const handleConfirmPassword = (e) => {
        console.log(e.target.value, formData.password)
        if(e.target.value !== formData.password){
            setErrors(prev => ({
                ...prev,
                confirmPassword: "Must match password."
            }))
        }else{
            setErrors(prev => ({
                ...prev,
                confirmPassword: ""
            }))
        }
    }

    const validateForm = () => {
        const nameErrors = {}

        if(!formData.name.trim()) nameErrors.name = "Name is required"
        if(!formData.email.includes("@")) nameErrors.email = "Enter a valid email"
        if(formData.password.length<8) nameErrors.password = "Min 8 characters."

        return nameErrors;
    }

    const handleSubmit = async(e) => {
        e.preventDefault();

        const validationErrors = validateForm();
        if(Object.keys(validationErrors).length>0){
            setErrors(validationErrors)
            return;
        }
        setLoading(true)
        console.log("proceeding to signup: ", formData)
        try {
            const response = await axiosClient.post("/users/register", formData )
            console.log(response);
            toast.success("User registered successfully.")
            navigate("/login")
        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message || error.message)
        } finally{
            setLoading(false)
        }
    }

    return(
        <>
            <div className="w-[100vw] min-h-[75vh] md:min-h-[80vh] bg-[#eef3f7] flex justify-center items-center">
                <div className="lg:max-w-[450px] bg-white flex flex-col gap-5 p-8 rounded-lg shadow-lg shadow-[#c9d3f0]/40">
                    <h2 className="text-2xl font-semibold">Sign Up</h2>
                    <form onSubmit={handleSubmit} action="" className="flex flex-col gap-3">
                        <div>
                            <input 
                                className="lg:w-[340px] border border-[#d5dadf] leading-[40px] rounded-sm pl-4"
                                placeholder="Name"
                                type="text" 
                                name="name" 
                                id="name" 
                                value={formData.name}
                                onChange={handleChange}
                            />
                            {errors.name &&
                                <p className="my-0 pl-2 text-red-500 text-xs">
                                    {errors.name}
                                </p>
                            }
                        </div>
                        <div>
                            <input
                                className="lg:w-[340px] border border-[#d5dadf] leading-[40px] rounded-sm pl-4"
                                placeholder="Email" 
                                type="email" 
                                name="email" 
                                id="email" 
                                value={formData.email}
                                onChange={handleChange}
                            />
                            {errors.email &&
                                <p className="my-0 pl-2 text-red-500 text-xs">
                                    {errors.email}
                                </p>
                            }
                        </div>
                        <div className="relative">
                            <input 
                                className="lg:w-[340px] border border-[#d5dadf] leading-[40px] rounded-sm pl-4"
                                placeholder="Password"
                                type={showPass ? "text" : "password"} 
                                name="password" 
                                id="password" 
                                value={formData.password}
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass(!showPass)}
                                className="absolute right-3 top-2 text-gray-500"
                            >
                                <i className={`bi ${showPass ? "bi-eye-slash" : "bi-eye"}`}></i>
                            </button>
                            {errors.password &&
                                <p className="my-0 pl-2 text-red-500 text-xs">
                                    {errors.password}
                                </p>
                            }
                        </div>
                        <div className="relative">
                            <input 
                                className="lg:w-[340px] border border-[#d5dadf] leading-[40px] rounded-sm pl-4"
                                placeholder="Confirm password"
                                type={showConfirm ? "text" : "password"} 
                                name="confirmPassword" 
                                id="confirmPassword" 
                                value={formData.confirmPassword}
                                onChange={handleConfirmPassword}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-3 top-2 text-gray-500"
                            >
                                <i className={`bi ${showConfirm ? "bi-eye-slash" : "bi-eye"}`}></i>
                            </button>
                            {errors.confirmPassword &&
                                <p className="my-0 pl-2 text-red-500 text-xs">
                                    {errors.confirmPassword}
                                </p>
                            }
                        </div>
                        <div className="flex items-center ml-2 mt-1">
                            <input 
                                type="checkbox" 
                                name="checkbox" 
                                id="checkbox" 
                            />
                            <label 
                                htmlFor="checkbox"
                                className="ml-2 text-sm"
                            >
                                I agree the Terms of Service
                            </label>
                        </div>
                        <button
                            disabled={loading}
                            className={`mt-2 lg:w-[340px] text-white font-medium leading-[40px] rounded-sm transition-colors duration-200 
                                ${loading 
                                ? "bg-[#152689] cursor-not-allowed opacity-80" 
                                : "bg-[#364bbe] hover:bg-[#152689]"
                                }`}
                        >
                            {loading ? "Signing up..." : "Sign up"}
                        </button>
                    </form>
                    <p>Already have an account? 
                        <Link
                            to="/login"
                        >
                            <span className="ml-2 hover:text-blue-500">Login</span>
                        </Link> 
                    </p>
                </div>
            </div>
        </>
    )
}