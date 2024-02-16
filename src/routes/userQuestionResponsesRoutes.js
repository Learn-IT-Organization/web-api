import { Router } from "express";
import {
  respond,
  getResponsesByUser,
  getAllResponses,
  getLessonsResult
} from "../controllers/userQuestionResponseController.js";
import { validateStudent } from "../middleware/roleMiddleware.js";
import { validateToken } from "../middleware/JWT.js";

const router = Router();

router.post("/respond", validateStudent, respond);

router.get("/responses", validateStudent, getAllResponses);

router.get("/userResponses/:id", validateStudent, getResponsesByUser);

router.get("/lessonResult", validateToken, getLessonsResult);

export default router;
