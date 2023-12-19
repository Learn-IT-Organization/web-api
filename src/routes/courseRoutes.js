import { Router } from "express";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  getChaptersByCourseId,
  getQuestionsAnswersByCourseId,
} from "../controllers/courseController.js";
import {
  validateStudent,
  validateTeacher,
} from "../middleware/roleMiddleware.js";

const router = Router();

router.post("/courses", validateTeacher, createCourse);

router.get("/courses", getAllCourses);

router.get("/course/:id", validateStudent, getCourseById);

router.get(
  "/course/:courseId/chapters",
  getChaptersByCourseId
);

router.get(
  "/course/:courseId/questionsAnswers",
  validateStudent,
  getQuestionsAnswersByCourseId
);

export default router;
