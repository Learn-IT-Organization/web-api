import { Router } from "express";
import {
  createChapter,
  sendToken,
  getAllChapters,
  getChapterById,
  getLessonsByChapterId,
} from "../controllers/chapterController.js";
import {
  validateAdmin,
  validateTeacher,
  validateStudent,
} from "../middleware/roleMiddleware.js";

const router = Router();

router.post("/chapters", validateTeacher, createChapter);

router.post("/FCM_token", validateStudent, sendToken);

router.get("/chapters", validateStudent, getAllChapters);

router.get("/chapter/:id", validateStudent, getChapterById);

router.get(
  "/chapters/:chapterId/lessons",
  getLessonsByChapterId
);

export default router;
