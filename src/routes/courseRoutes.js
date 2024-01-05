import { Router } from "express";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  getChaptersByCourseId,
  getQuestionsAnswersByCourseId,
  getQuestionsAnswersByCourseIdChapterIdLessonId,
  getQuestionsAnswersFilteredByType
} from "../controllers/courseController.js";
import {
  validateStudent,
  validateTeacher,
} from "../middleware/roleMiddleware.js";

const router = Router();

router.post("/courses", validateTeacher, createCourse);

router.get("/courses",validateStudent, getAllCourses);

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

router.get(
  "/course/:courseId/chapters/:chapterId/lesson/:lessonId/questionsAnswers",
  validateStudent,
  getQuestionsAnswersByCourseIdChapterIdLessonId
);

router.get(
  "/course/:courseId/chapters/:chapterId/lesson/:lessonId/questionsAnswers/:questionType",
  validateStudent,
  getQuestionsAnswersFilteredByType
);
export default router;
