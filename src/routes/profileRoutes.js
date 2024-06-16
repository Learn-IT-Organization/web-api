import { Router } from "express";
import { profile, editUserProfile, generateResetCodeAndSendToUser, changePasswordWithResetCode} from "../controllers/profileController.js";
import { validateToken } from "../middleware/JWT.js";
import { validateStudent } from "../middleware/roleMiddleware.js";

const router = Router();

router.get("/profile/user", validateToken, profile);

router.put("/editUser", validateStudent, editUserProfile);
router.post("/requestResetCode", generateResetCodeAndSendToUser);
router.post("/changePassword", changePasswordWithResetCode);

export default router;
