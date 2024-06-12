import { Router } from "express";
import {
  createLessonContent,
  getAllLessonContents,
  getLessonContentById,
  editLessonContent,
  deleteLessonContent,
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

router.delete("/lessonContent/:id", validateTeacher, deleteLessonContent);

export default router;
