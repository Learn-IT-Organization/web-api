import { Router } from "express";
import {
  createLessonContent,
  getAllLessonContents,
  getLessonContentById,
} from "../controllers/lessonContentController.js";
import {
  validateStudent,
  validateTeacher,
} from "../middleware/roleMiddleware.js";

const router = Router();

router.post("/lessonContents", validateTeacher, createLessonContent);

router.get("/lessonContents", validateStudent, getAllLessonContents);

router.get("/lessonContent/:id", validateStudent, getLessonContentById);

export default router;
