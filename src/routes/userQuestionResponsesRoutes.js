import { Router } from "express";
import {
  respond,
  getAllResponses,
  getResponsesByUser,
} from "../controllers/userQuestionResponseController.js";
import {
  validateStudent,
  validateTeacher,
} from "../middleware/roleMiddleware.js";

const router = Router();

router.post("/respond", validateTeacher, respond);

router.get("/responses", validateStudent, getAllResponses);

router.get("/userResponses/:id", validateStudent, getResponsesByUser);

export default router;
