import { Router } from "express";
import {
  respond,
  getAllResponses,
  getResponsesByUser,
} from "../controllers/userQuestionResponseController.js";
import { validateToken } from "../middleware/JWT.js";

const router = Router();

router.post("/respond", validateToken, respond);

router.get("/responses", validateToken, getAllResponses);

router.get("/userResponses/:id", validateToken, getResponsesByUser);

export default router;
