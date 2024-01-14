import UserQuestionResponse from "../models/userQuestionResponseModel.js";
import HTTP_STATUS_CODES from "../constants/httpStatusCodes.js";
import QuestionsAnswers from "../models/questionsAnswersModel.js";

const respond = async (req, res) => {
  try {
    await UserQuestionResponse.create(req.body);
    const response = await gradeResponse(req.body);
    res.status(HTTP_STATUS_CODES.CREATED).json({
      success: true,
      message: "User response recorded successfully.",
      score: response.score,
    });
  } catch (error) {
    console.error("Error in respond:", error);
    res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to record user response.",
      score: 0,
    });
  }
};

const gradeResponse = async ({ uqr_question_id, uqr_user_id }) => {
  const response = await UserQuestionResponse.findOne({
    where: {
      uqr_question_id,
      uqr_user_id,
    },
  });

  const question = await QuestionsAnswers.findOne({
    where: {
      question_id: uqr_question_id,
    },
  });

  const { answers, question_type } = question;
  const userResponse = response.response.answer;

  let score = 0;

  if (question_type === "multiple_choice") {
    const correctAnswers = answers.filter((answer) => answer.is_correct);
    console.log("correctAnswers", correctAnswers);
    const userAnswers = userResponse.filter((answer) => answer.is_correct);
    console.log("userAnswers", userAnswers);
    score = 1 / correctAnswers.length;
    console.log("score", score);
  } else if (question_type === "true_false") {
    const correctAnswer = answers[0];
    const userAnswer = userResponse[0];

    if (correctAnswer.is_correct === userAnswer.is_correct) {
      score = 1;
    }
  }

  await response.update({
    is_correct: score > 0,
    score,
  });

  return { score };
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

export { respond, getAllResponses, getResponsesByUser };
