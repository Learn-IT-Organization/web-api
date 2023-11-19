import { Router } from "express";
import {
  createQuestionsAnswers,
  getAllQuestionsAnswers,
} from "../controllers/questionsAnswersController.js";
import { validateToken } from "../middleware/JWT.js";

const router = Router();

router.post("/questionsAnswers", validateToken, createQuestionsAnswers);

router.get("/questionsAnswers", validateToken, getAllQuestionsAnswers);

export default router;
