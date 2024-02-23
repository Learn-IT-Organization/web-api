import { Router } from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
} from "../controllers/userController.js";

const router = Router();

router.post("/users", createUser);
router.get("/users", getAllUsers);
router.get("/user", getUserById);

export default router;
