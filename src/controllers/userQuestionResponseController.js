import UserQuestionResponse from "../models/userQuestionResponseModel.js";
import HTTP_STATUS_CODES from "../constants/httpStatusCodes.js";
import QuestionsAnswers from "../models/questionsAnswersModel.js";

const respond = async (req, res) => {
  const response = await UserQuestionResponse.create(req.body);
  res.status(HTTP_STATUS_CODES.CREATED).json(response);
  return response; // Return the response object
};

const getAllResponses = async (req, res) => {
  const responses = await UserQuestionResponse.findAll();
  res.status(HTTP_STATUS_CODES.OK).json(responses);
};

const getResponsesByUser = async (req, res) => {
  const userId = req.params.id;
  const responses = await UserQuestionResponse.findAll({
    where: {
      uqr_user_id: userId,
    },
  });
  res.status(HTTP_STATUS_CODES.OK).json(responses);
};

const gradeMultipleChoiceAnswer = async (req, res) => {
  try {
    const { uqr_question_id, response } = req.body;

    // Fetch the question using findByPk
    const question = await QuestionsAnswers.findByPk(uqr_question_id);

    if (!question || question.question_type !== "multiple choice") {
      return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
        error: "Invalid question type for grading",
      });
    }

    const correctAnswers = question.answers.filter((ans) => ans.isCorrect);
    const userAnswers = response.answer;

    const isCorrect = correctAnswers.every((correctAns) =>
      userAnswers.some(
        (userAns) =>
          userAns.ansText === correctAns.ansText &&
          userAns.isCorrect === correctAns.isCorrect
      )
    );

    const score = isCorrect ? 1 : 0;

    // Update database with grading result
    const userResponse = await UserQuestionResponse.findOrCreate({
      where: {
        uqr_question_id,
        uqr_user_id: req.user.id, // Assuming user information is available in req.user
      },
      defaults: {
        response: response,
        is_correct: isCorrect ? 1 : 0,
        score: score,
        response_time: new Date(),
      },
    });

    // If not created, update the existing record
    if (!userResponse[1]) {
      await userResponse[0].update({
        response: response,
        is_correct: isCorrect ? 1 : 0,
        score: score,
        response_time: new Date(),
      });
    }

    return res.json({
      success: true,
      message: "Grade updated successfully",
      score: score,
    });
  } catch (error) {
    console.error("Error in gradeMultipleChoiceAnswer:", error);
    return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      error: error.message,
    });
  }
};

const handleUserResponse = async (req, res) => {
  try {
    const response = await respond(req, res);

    console.log("Response object:", response);

    if (response && response.uqr_question_id) {
      const question = await QuestionsAnswers.findByPk(
        response.uqr_question_id
      );

      console.log("Question object:", question);

      if (question.question_type === "multiple choice") {
        console.log("Entering multiple choice grading");

        await gradeMultipleChoiceAnswer(req, res);
      }
    }
  } catch (error) {
    console.error("Error in handleUserResponse:", error);
    res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: error.message });
  }
};


export {
  respond,
  getAllResponses,
  getResponsesByUser,
  gradeMultipleChoiceAnswer,
  handleUserResponse,
};
