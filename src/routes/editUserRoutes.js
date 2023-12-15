import { Router } from "express";
import { editUserProfile } from "../controllers/editUserController.js";
import { validateStudent } from "../middleware/roleMiddleware.js";
const router = Router();

router.put("/editUser", validateStudent, editUserProfile);

export default router;
