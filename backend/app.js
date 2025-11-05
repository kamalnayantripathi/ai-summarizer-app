import dotenv from "dotenv";
dotenv.config();

import express from "express"
import cors from "cors";

import userRouter from "./api/routes/user.routes.js";
import articleRouter from "./api/routes/articles.routes.js";
import summaryRouter from "./api/routes/summary.routes.js";

const app = express();

//CORS
app.use(cors({
    allowedOrigins: process.env.ALLOWED_ORIGINS,
}))

// Accept json format data
app.use(express.json())

// Routes
app.use("/api", userRouter);
app.use("/api/users", articleRouter);
app.use("/api/articles", summaryRouter);

app.get("/", (req, res) => {
    res.send('Hello Express')
})

export default app;