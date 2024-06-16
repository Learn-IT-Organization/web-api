import { Router } from "express";
import { validateToken } from "../middleware/JWT.js";
import { validateStudent } from "../middleware/roleMiddleware.js";

import {
  login,
  logout,
  register,
  profile,
  editUserProfile,
  generateResetCodeAndSendToUser,
  changePasswordWithResetCode,
  createUser,
  getAllUsers,
  getUserById,
} from "../controllers/userController.js";

const router = Router();

router.post("/login", login);
router.post("/logout", logout);
router.post("/register", register);

router.get("/profile/user", validateToken, profile);

router.put("/editUser", validateStudent, editUserProfile);
router.post("/requestResetCode", generateResetCodeAndSendToUser);
router.post("/changePassword", changePasswordWithResetCode);

router.post("/users", createUser);
router.get("/users", getAllUsers);
router.get("/user", getUserById);

export default router;
