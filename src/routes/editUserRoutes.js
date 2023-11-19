import { Router } from "express";
import { editUserProfile } from "../controllers/editUserController.js";
import { validateToken } from "../middleware/JWT.js";
const router = Router();

router.put("/editUser", validateToken, editUserProfile);

export default router;
