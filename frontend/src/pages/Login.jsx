import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

export const Login = () => {

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })
    const [showPass, setShowPass] = useState(false)
    const [errors, setErrors] = useState({})
    const navigate = useNavigate();
    const { login } = useContext(AuthContext)
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        setErrors(prev => ({
            ...prev,
            [name]: ""
        }))
    }

    const validateForm = () => {
        const newErrors = {}

        if(!formData.email.includes("@")) newErrors.email = "Enter a valid email."
        if(formData.password.length < 8) newErrors.password = "Must be at least 8 characters"

        return newErrors;
    }

    const handleLogin = async(e) => {
        e.preventDefault()
        const validationErrors =  validateForm()
        if(Object.keys(validationErrors).length>0){
            setErrors(validationErrors)
            return;
        }
        // console.log("sending login request: ",formData)
        try {
            const success = await login(formData)
            if(success){
                navigate('/')
            }
        } catch (error) {
            // console.log(error)
            toast.error(error?.response?.data?.message || error.message)
        }
    }

    return(
        <>
            <div className="w-[100vw] min-h-[75vh] md:min-h-[80vh] bg-[#eef3f7] flex justify-center items-center">
                <div className="lg:max-w-[450px] bg-white flex flex-col gap-5 p-8 rounded-lg shadow-lg shadow-[#c9d3f0]/40">
                    <h2 className="text-2xl font-semibold">Login</h2>
                    <form onSubmit={handleLogin} className="flex flex-col gap-3">
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
                        <button
                            onClick={handleLogin}
                            className="mt-2 lg:w-[340px] bg-[#364bbe] hover:bg-[#152689] text-white font-medium leading-[40px] rounded-sm"
                        >
                            Login
                        </button>
                    </form>
                    <p>Don't have an account?
                        <Link
                            to="/signup"
                        >
                            <span className="ml-2 hover:text-blue-500">Signup</span>
                        </Link> 
                    </p>
                </div>
            </div>
        </>
    )
}