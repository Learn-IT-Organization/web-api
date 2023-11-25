import { Router } from "express";
import {
  createQuestionsAnswers,
  getAllQuestionsAnswers,
} from "../controllers/questionsAnswersController.js";
import {
  validateStudent,
  validateTeacher,
} from "../middleware/roleMiddleware.js";

const router = Router();

router.post("/questionsAnswers", validateTeacher, createQuestionsAnswers);

router.get("/questionsAnswers", validateStudent, getAllQuestionsAnswers);

export default router;
