import { Router } from "express";
import { profile } from "../controllers/profileController.js";
import { validateToken } from "../middleware/JWT.js";

const router = Router();

router.get("/profile/user", validateToken, profile);

export default router;
