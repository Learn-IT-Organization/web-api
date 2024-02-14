import { Router } from "express";
import {
  respond,
  getResponsesByUser,
  getAllResponses,
  getLessonResult,
  deleteUserResponsesByLesson
} from "../controllers/userQuestionResponseController.js";
import { validateStudent } from "../middleware/roleMiddleware.js";
import { validateToken } from "../middleware/JWT.js";

const router = Router();

router.post("/respond", validateStudent, respond);

router.post("/respond", validateStudent, respond);

router.get("/responses", validateStudent, getAllResponses);

router.get("/userResponses/:id", validateStudent, getResponsesByUser);

router.get("/lessonResult/:lessonId", validateToken, getLessonResult);

router.get("/deleteResponses/:lessonId", validateToken, deleteUserResponsesByLesson);

export default router;
