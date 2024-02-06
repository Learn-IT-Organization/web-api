import UserQuestionResponse from "../models/userQuestionResponseModel.js";
import HTTP_STATUS_CODES from "../constants/httpStatusCodes.js";
import QuestionsAnswers from "../models/questionsAnswersModel.js";

const respond = async (req, res) => {
  try {
    const response = await gradeResponse(req.body);
    await UserQuestionResponse.create({
      uqr_question_id: req.body.uqr_question_id,
      uqr_user_id: req.body.uqr_user_id,
      response: req.body.response,
      score: response.score,
    });

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

const gradeResponse = async ({ uqr_question_id, uqr_user_id, response }) => {
  const question = await QuestionsAnswers.findOne({
    where: {
      question_id: uqr_question_id,
    },
  });

  const { answers, question_type } = question;
  const userResponse = response.answer;

  let score = 0;
  let isCorrect = false;

  if (question_type === "multiple_choice") {
    const userAnswers = userResponse;
    if (userAnswers.length === answers.length) {
      const correctUserAnswers = userAnswers.filter(
        (answer, index) => answer && answers[index].is_correct
      );
      const correctAnswers = answers.filter((answer) => answer.is_correct);
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
  } else if (question_type === "sorting") {
    const userUp = response.up;
    const userDown = response.down;

    const correctUp = answers[0].up;
    const correctDown = answers[0].down;

    let upPartialScore = 0;
    let downPartialScore = 0;

    correctUp.forEach((correctConcept) => {
      if (userUp.includes(correctConcept)) {
        upPartialScore += 1;
      }
    });

    correctDown.forEach((correctConcept) => {
      if (userDown.includes(correctConcept)) {
        downPartialScore += 1;
      }
    });

    const totalPartialScore = upPartialScore + downPartialScore;
    const maxScore = correctUp.length + correctDown.length;

    score = totalPartialScore / maxScore;
    isCorrect = totalPartialScore > 0;

    return { score, isCorrect, partialScore: totalPartialScore, maxScore };
  }

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