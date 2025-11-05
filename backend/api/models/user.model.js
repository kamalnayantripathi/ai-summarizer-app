import mongoose from "mongoose"
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    name: {
        type:  String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
    },
}, { timestamps: true})

userSchema.pre("save", async function(next){
    if(!this.isModified) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

//Instance method - compare password
userSchema.methods.comparePassword = async function(plainPassword){
    return bcrypt.compare(plainPassword, this.password)
}

export const User = mongoose.model("User", userSchema)