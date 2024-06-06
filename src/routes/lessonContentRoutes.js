import { Router } from "express";
import {
  createLessonContent,
  getAllLessonContents,
  getLessonContentById,
  editLessonContent
} from "../controllers/lessonContentController.js";
import {
  validateStudent,
  validateTeacher,
} from "../middleware/roleMiddleware.js";

const router = Router();

router.post("/lessonContents", validateTeacher, createLessonContent);

router.get("/lessonContents", validateStudent, getAllLessonContents);

router.get("/lessonContent/:id", validateStudent, getLessonContentById);

router.put("/editLessonContent/:id", validateTeacher, editLessonContent);

export default router;
