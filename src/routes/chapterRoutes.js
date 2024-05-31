import { Router } from "express";
import {
  createChapter,
  sendToken,
  getAllTokens,
  getAllChapters,
  getChapterById,
  getLessonsByChapterId,
  editChapter,
} from "../controllers/chapterController.js";
import {
  validateAdmin,
  validateTeacher,
  validateStudent,
} from "../middleware/roleMiddleware.js";

const router = Router();

router.post("/chapters", validateTeacher, createChapter);

router.put("/editChapter/:id", validateTeacher, editChapter);

router.post("/FCM_token", sendToken);

router.get("/FCM_token", validateStudent, getAllTokens);

router.get("/chapters", validateStudent, getAllChapters);

router.get("/chapter/:id", validateStudent, getChapterById);

router.get(
  "/chapters/:chapterId/lessons",
  getLessonsByChapterId
);

export default router;
