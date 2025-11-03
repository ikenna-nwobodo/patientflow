import { Router } from "express";
const router = Router();
import { getStats } from "../controllers/statsController.js";

router.get("/", getStats);

export default router;
