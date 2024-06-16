import { Router } from "express";
import {
  login,
  logout,
  register,
  createUser,
  getAllUsers,
  getUserById,
} from "../controllers/userController.js";

const router = Router();

router.post("/login", login);
router.post("/logout", logout);
router.post("/register", register);

router.post("/users", createUser);
router.get("/users", getAllUsers);
router.get("/user", getUserById);

export default router;
