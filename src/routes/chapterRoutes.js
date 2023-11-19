import { Router } from "express";
import {
  createChapter,
  getAllChapters,
  getChapterById,
  getLessonsByChapterId,
  getQuestionsAnswersByChapterId,
} from "../controllers/chapterController.js";
import { validateToken } from "../middleware/JWT.js";
import { checkUserRole } from "../middleware/roleMiddleware.js";

const router = Router();

router.post("/chapters", validateToken, createChapter);

router.get("/chapters", validateToken, checkUserRole(['quest', 'student', 'teacher', 'admin']), getAllChapters);

router.get("/chapter/:id", validateToken, getChapterById);

router.get(
  "/chapters/:chapterId/lessons",
  validateToken,
  getLessonsByChapterId
);

router.get(
  "/chapters/:chapterId/questionsAnswers",
  validateToken,
  getQuestionsAnswersByChapterId
);

export default router;
