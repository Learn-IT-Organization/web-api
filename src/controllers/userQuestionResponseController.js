import UserQuestionResponse from "../models/userQuestionResponseModel.js";
import HTTP_STATUS_CODES from "../constants/httpStatusCodes.js";
import QuestionsAnswers from "../models/questionsAnswersModel.js";
import UserScore from "../models/userScoreModel.js";

const respond = async (req, res) => {
  try {
    await UserQuestionResponse.upsert(req.body);
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

const gradeResponse = async ({ response_id, uqr_question_id, uqr_user_id }) => {
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
  let isCorrect = false;

  if (question_type === "multiple_choice") {
    const userAnswers = userResponse;

    if (userAnswers.length === answers.length) {
      const correctUserAnswers = userAnswers.filter(
        (answer, index) => answer && answers[index].is_correct
      );

      const correctAnswers = answers.filter((answer) => answer.is_correct);
      userAnswers.filter((answer) => !answer).length;

      if (
        userAnswers.filter((answer) => answer).length > correctAnswers.length
      ) {
        score = 0;
      } else {
        score = correctUserAnswers.length / correctAnswers.length;
      }
    }
  } else if (question_type === "true_false") {
    const userAnswer = userResponse[0];
    const correctAnswer = answers[0].is_correct;

    isCorrect = userAnswer === correctAnswer;
    score = isCorrect ? 1 : 0;
  }

  await UserScore.create({
    user_id: uqr_user_id,
    response_id: response.response_id,
    total_score: score,
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
