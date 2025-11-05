import jwt from "jsonwebtoken"

export function signAccessToken(payload){
    console.log(typeof process.env.JWT_ACCESS_EXPIRY)
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET , {
        expiresIn: process.env.JWT_ACCESS_EXPIRY
    })
}