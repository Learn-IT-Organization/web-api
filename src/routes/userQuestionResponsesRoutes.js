import { Router } from "express";
import HTTP_STATUS_CODES from "../constants/httpStatusCodes.js";
import QuestionsAnswers from "../models/questionsAnswersModel.js";
import {
  respond,
  getAllResponses,
  getResponsesByUser,
  gradeMultipleChoiceAnswer,
} from "../controllers/userQuestionResponseController.js";
import {
  validateStudent,
} from "../middleware/roleMiddleware.js";

const router = Router();

router.post("/respond", validateStudent, async (req, res) => {
    const response = await respond(req, res);
    const hasResponseAlreadyBeenSent = res.headersSent;

    if (response && response.uqr_question_id) {
      const question = await QuestionsAnswers.findByPk(
        response.uqr_question_id
      );

      if (question.questionType === "multiple choice") {
        const hasResponseAlreadyBeenSent = res.headersSent;

        if (!hasResponseAlreadyBeenSent) {
          await gradeMultipleChoiceAnswer(req, res);
        }
      }
    }

    if (!hasResponseAlreadyBeenSent) {
      res.status(HTTP_STATUS_CODES.CREATED).json(response);
    }
    
    if (!hasResponseAlreadyBeenSent) {
      res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: error.message });
    }
  
});


router.get("/responses", validateStudent, getAllResponses);

router.get("/userResponses/:id", validateStudent, getResponsesByUser);

export default router;
