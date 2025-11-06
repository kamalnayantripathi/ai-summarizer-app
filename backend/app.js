import dotenv from "dotenv";
dotenv.config();

import express from "express"
import cors from "cors";
// import path from "path";
// import { fileURLToPath } from "url";

import userRouter from "./api/routes/user.routes.js";
import articleRouter from "./api/routes/articles.routes.js";
import summaryRouter from "./api/routes/summary.routes.js";

const app = express();

// 🧭 These two lines are needed to properly resolve __dirname in ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

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

// ✅ Serve static frontend
// app.use(express.static(path.join(__dirname, "dist")));

// // ✅ Handle client-side routes safely
// app.use((req, res) => {
//   res.sendFile(path.resolve(__dirname, "dist", "index.html"));
// });


app.get("/", (req, res) => {
    res.send('Hello Express')
})

export default app;