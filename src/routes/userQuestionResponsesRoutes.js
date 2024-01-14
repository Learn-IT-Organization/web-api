import { Router } from "express";
import {
  respond,
  getResponsesByUser,
  getAllResponses,
} from "../controllers/userQuestionResponseController.js";
import { validateStudent } from "../middleware/roleMiddleware.js";
import {
  getScoresByUserId,
  getScoreByResponseId,
} from "../controllers/userScoreController.js";

const router = Router();

router.post("/respond", validateStudent, respond);

router.get(
  "/userResponsesByUser/:userId/score",
  validateStudent,
  getScoresByUserId
);

router.get(
  "/userResponsesByResponse/:responseId/score",
  validateStudent,
  getScoreByResponseId
);

router.get("/responses", validateStudent, getAllResponses);

router.get("/userResponses/:id", validateStudent, getResponsesByUser);

export default router;
