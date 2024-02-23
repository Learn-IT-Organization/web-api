import { Router } from "express";
import {
  respond,
  getResponsesByUser,
  getAllResponses,
  getLessonsResult,
  getUserResultsWithValidation,
} from "../controllers/userQuestionResponseController.js";
import { validateStudent } from "../middleware/roleMiddleware.js";
import { validateToken } from "../middleware/JWT.js";

const router = Router();

router.post("/respond", validateStudent, respond);

router.get("/responses", validateStudent, getAllResponses);

router.get("/userResponses", validateStudent, getResponsesByUser);

router.get("/lessonResult", validateToken, getLessonsResult);

router.get(
  "/userResultsWithValidation/:lessonId/lesson",
  validateToken,
  getUserResultsWithValidation
);

export default router;
