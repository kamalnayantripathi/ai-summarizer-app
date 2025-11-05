import { Router } from "express";
import { registerUser, getUsers, getCurrentUser, userLogin } from "../controllers/users.controller.js";
import { authorizeUser } from "../middlewares/auth.middleware.js";

const router = Router()

router.post("/users/register", registerUser)
router.get("/users", getUsers)
router.get("/user", authorizeUser, getCurrentUser)
router.post("/users/login", userLogin)


export default router;