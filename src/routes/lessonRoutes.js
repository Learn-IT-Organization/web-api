import { Router } from "express";
import {
  createLesson,
  getAllLessons,
  getLessonById,
  getContentsByLessonId,
  editLesson,
  deleteLesson
} from "../controllers/lessonController.js";
import {
  validateTeacher,
  validateStudent,
} from "../middleware/roleMiddleware.js";

const router = Router();

router.post("/lessons", validateTeacher, createLesson);

router.get("/lessons", validateStudent, getAllLessons);

router.put("/editLesson/:id", validateTeacher, editLesson);

router.get("/lesson/:id", validateStudent, getLessonById);

router.delete("/lesson/:id", validateTeacher, deleteLesson);

router.get(
  "/lesson/:lessonId/contents",
  validateStudent,
  getContentsByLessonId
);
export default router;
