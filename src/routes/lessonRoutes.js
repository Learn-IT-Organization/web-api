import { Router } from "express";
import {
  createLesson,
  getAllLessons,
  getLessonById,
  getContentsByLessonId,
} from "../controllers/lessonController.js";
import { validateTeacher, validateStudent } from "../middleware/roleMiddleware.js";

const router = Router();

router.post("/lessons", validateTeacher, createLesson);

router.get("/lessons", validateStudent, getAllLessons);

router.get("/lesson/:id", validateStudent, getLessonById);

router.get("/lessons/:lessonId/contents", validateStudent, getContentsByLessonId);

export default router;
