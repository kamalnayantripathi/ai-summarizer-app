import mongoose from "mongoose"
import app from "./app.js"
import dotenv from "dotenv";
import "./api/config/redisClient.js";
import "./api/queues/summaryQueue.js";
import "./api/workers/summaryWorker.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/suvidha-foundation";
const PORT = process.env.PORT || 8000;

//Connect to DB and start server
async function connectDB(){
    try {
        await mongoose.connect(MONGO_URI)
        console.log("Database connected successfully.")
        app.listen(8000, () => {
            console.log("listening on port "+PORT)
        })
    } catch (error) {
        console.log(error)
    }
}

connectDB()