import { Router } from "express";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  getChaptersByCourseId,
  getQuestionsAnswersByCourseId,
  getQuestionsAnswersByCourseIdChapterIdLessonId,
  getQuestionsAnswersFilteredByType,
  getMyCourses,
  calculateChapterScore,
  editCourse
} from "../controllers/courseController.js";
import {
  validateStudent,
  validateTeacher,
} from "../middleware/roleMiddleware.js";
import { validateToken } from "../middleware/JWT.js";

const router = Router();

router.post("/courses", validateTeacher, createCourse);

router.get("/courses", validateStudent, getAllCourses);

router.put("/editCourse/:id", validateTeacher, editCourse);

router.get("/course/:id", validateStudent, getCourseById);

router.get(
  "/course/:courseId/chapters",
  validateStudent,
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

router.get("/myCourses", validateToken, getMyCourses);

router.get("/course/:courseId/chapter/:chapterId/score", calculateChapterScore);

export default router;
