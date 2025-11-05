import { User } from "../models/user.model.js";
import { signAccessToken } from "../auth/jwt.js";

const registerUser = async(req, res) => {
    try { 
        const { name, email, password, bio } = req.body;
        console.log(name, email, password)
        if(!name || !email || !password) return res.status(400).json({ message: "All fields are required." })

        const user = await User.create({
            name,
            email,
            password,
            bio
        })
        return res.status(200).json({
            statusCode: 200,
            user,
            message: "User registered successfully."
        })
    } catch (error) {
        if(error.code===11000){
            return res.status(400).json({ message: "Email already exists" });
        }
        return res.status(400).json( error.message || "Something went wrong.")
    }
}

const getUsers = async(req, res) => {
    try {
        console.log("Getting all users on request of ", req?.user?.email)
        const users = await User.find().select("-password");
        return res.status(200).json({
            statusCode: 200,
            users,
            message: "Users fetched successfully."
        })
    } catch (error) {
        return res.status(400).json( error.message || "Something went wrong.")
    }
}

const getCurrentUser = async(req, res) => {
    try {
        const userId = req.user.id;
        if(!userId) return res.status(401).json({ message: "User not logged in."})
        const user = await User.findById(userId).select("-password")
        return res.status(200).json({
            statusCode: 200,
            user,
            message: "User fetched successfully."
        })
    } catch (error) {
        return res.status(400).json( error.message || "Something went wrong.")
    }
}

// User login and logout functionality

const userLogin = async(req, res) => {
    try {
        const { email, password } = req.body;
        if(!email || !password) return res.status(400).json({ message: "All fields are required." })

        const user = await User.findOne({email})
        if(!user){
            return res.status(404).json({ message: "User doesn't exist"});
        }

        const validPassword = await user.comparePassword(password)
        console.log(validPassword)
        if(!validPassword){
            return res.status(401).json({ message: "Incorrect password"});
        }

        const token = signAccessToken({ id: user._id , email: user.email, name: user.name })
        console.log(user.name, "logged in successfully.")
        return res.status(200).json({ 
            statusCode: 200,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            },
            message: "User logged in successfully."
        })
    } catch (error) {
        return res.status(400).json( error.message || "Couldn't login the user.")
    }
}

export {
    registerUser,
    getUsers,
    getCurrentUser,
    userLogin
}