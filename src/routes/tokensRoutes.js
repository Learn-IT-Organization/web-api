import { Router } from "express";
import { sendToken } from "../controllers/tokensController.js";

const router = Router();

router.post("/sendToken", sendToken);

export default router;
