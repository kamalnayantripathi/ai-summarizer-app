import { Router } from "express";
import { authorizeUser } from "../middlewares/auth.middleware.js";
import { createSummary, saveSummary, getSummaries, getSummary, updateSummary, deleteSummary } from "../controllers/summary.controller.js";

const router = Router();

router.post("/create-summary", authorizeUser, createSummary)
router.post("/summary", authorizeUser, saveSummary)
router.get("/summaries", authorizeUser, getSummaries)
router.get("/summary/:id", authorizeUser, getSummary)
router.patch("/summary/:id", authorizeUser, updateSummary)
router.delete("/summary/:id", authorizeUser, deleteSummary)

export default router;