import { Router } from "express";
import {
  createLesson,
  getAllLessons,
  getLessonById,
  getContentsByLessonId,
  getQuestionsAnswersByLessonId,
} from "../controllers/lessonController.js";
import { validateToken } from "../middleware/JWT.js";

const router = Router();

router.post("/lessons", validateToken, createLesson);

router.get("/lessons", validateToken, getAllLessons);

router.get("/lesson/:id", validateToken, getLessonById);

router.get("/lessons/:lessonId/contents", validateToken, getContentsByLessonId);

router.get(
  "/lessons/:lessonId/questionsAnswers",
  validateToken,
  getQuestionsAnswersByLessonId
);

export default router;
