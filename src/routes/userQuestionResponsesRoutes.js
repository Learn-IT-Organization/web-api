import { Router } from "express";
import {
  getAllResponses,
  getResponsesByUser,
  handleUserResponse,
} from "../controllers/userQuestionResponseController.js";
import { validateStudent } from "../middleware/roleMiddleware.js";

const router = Router();

router.post("/respond", validateStudent, handleUserResponse);

router.get("/responses", validateStudent, getAllResponses);

router.get("/userResponses/:id", validateStudent, getResponsesByUser);

export default router;
