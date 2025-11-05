import jwt from "jsonwebtoken"

export function authorizeUser(req, res, next){
    try {   
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({ message: "Authorization token missing or invalid format" });
        }
        const token = authHeader.split(" ")[1];
        if(!token) return res.status(401).json({ message: "Authorization token is required" });

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
        if(!decoded) return res.status(401).json("token is expired or invalid");
        console.log("user:",decoded.name)
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json( error.message || "Unauthorized request.")
    }  
}