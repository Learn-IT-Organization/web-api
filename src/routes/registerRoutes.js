import { Router } from "express";
import { register , uploadMiddleware } from "../controllers/registerController.js";

const router = Router();

router.post("/register", uploadMiddleware, register);

export default router;
