import { Router } from "express";
import {
  editUserProfile,
  generateResetCodeAndSendToUser,
  changePasswordWithResetCode,
} from "../controllers/editUserController.js";
import { validateStudent } from "../middleware/roleMiddleware.js";
const router = Router();

router.put("/editUser", validateStudent, editUserProfile);
router.post("/requestResetCode", generateResetCodeAndSendToUser);
router.post("/changePassword", changePasswordWithResetCode);

export default router;
