import { Router } from "express";
import {
  createLessonContent,
  getAllLessonContents,
  getLessonContentById,
} from "../controllers/lessonContentController.js";
import { validateToken } from "../middleware/JWT.js";

const router = Router();

router.post("/lessonContents", validateToken, createLessonContent);

router.get("/lessonContents", validateToken, getAllLessonContents);

router.get("/lessonContent/:id", validateToken, getLessonContentById);

export default router;
