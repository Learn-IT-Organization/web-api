import { Router } from "express";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  getChaptersByCourseId,
  getQuestionsAnswersByCourseId,
} from "../controllers/courseController.js";
import { validateToken } from "../middleware/JWT.js";

const router = Router();

router.post("/courses", validateToken, createCourse);

router.get("/courses", validateToken, getAllCourses);

router.get("/course/:id", validateToken, getCourseById);

router.get("/course/:courseId/chapters", validateToken, getChaptersByCourseId);

router.get(
  "/course/:courseId/questionsAnswers",
  validateToken,
  getQuestionsAnswersByCourseId
);

export default router;
