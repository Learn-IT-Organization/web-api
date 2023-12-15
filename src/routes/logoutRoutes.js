import { Router } from "express";
import { logout } from "../controllers/logoutController.js";
import { validateToken } from "../middleware/JWT.js";

const router = Router();

router.post("/logout", logout);

export default router;
