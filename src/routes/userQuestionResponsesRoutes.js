import { Router } from "express";
import {
  respond,
  getResponsesByUser,
  getAllResponses,
} from "../controllers/userQuestionResponseController.js";
import { validateStudent } from "../middleware/roleMiddleware.js";

const router = Router();

router.post("/respond", validateStudent, respond);

router.post("/respond", validateStudent, respond);

router.get("/responses", validateStudent, getAllResponses);

router.get("/userResponses/:id", validateStudent, getResponsesByUser);

export default router;
