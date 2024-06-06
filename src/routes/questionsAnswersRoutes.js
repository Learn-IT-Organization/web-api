import { Router } from "express";
import {
  createQuestionsAnswers,
  getAllQuestionsAnswers,
  editQuestionsAnswers
} from "../controllers/questionsAnswersController.js";
import {
  validateStudent,
  validateTeacher,
} from "../middleware/roleMiddleware.js";

const router = Router();

router.post("/questionsAnswers", validateTeacher, createQuestionsAnswers);

router.get("/questionsAnswers", validateStudent, getAllQuestionsAnswers);

router.put("/editQuestionsAnswers/:id", validateTeacher, editQuestionsAnswers);

export default router;
