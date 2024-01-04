import UserQuestionResponse from "../models/userQuestionResponseModel.js";
import HTTP_STATUS_CODES from "../constants/httpStatusCodes.js";
import QuestionsAnswers from "../models/questionsAnswersModel.js";

const respond = async (req, res) => {
  try {
    const response = await UserQuestionResponse.create(req.body);
    res.status(HTTP_STATUS_CODES.CREATED).json(response);
  } catch (error) {
    res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: error.message });
  }
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
  const { uqr_question_id, response } = req.body;

  const question = await QuestionsAnswers.findByPk(uqr_question_id);
  console.log(question);
  if (question.question_type === "multiple choice") {
    const correctAnswers = question.answers.filter((ans) => ans.isCorrect);

    const userAnswers = response.answer.map((ans) => ans.ansText);
    console.log(userAnswers);
    const correctUserAnswers = userAnswers.filter((userAns) =>
      correctAnswers.includes(userAns)
    );

    const score = correctUserAnswers.length / correctAnswers.length;
    console.log(score);
    const userResponse = await UserQuestionResponse.findByPk(uqr_question_id);
    userResponse.score = score;
    await userResponse.save();

    res.json({
      success: true,
      message: "Grade updated successfully",
      score: userResponse.score,
    });
  } else {
    res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
      error: "Invalid question type for grading",
    });
  }
};

const handleUserResponse = async (req, res) => {
  await respond(req, res);

  const response = await UserQuestionResponse.create(req.body);
  const question = await QuestionsAnswers.findByPk(response.uqr_question_id);

  if (question.questionType === "multiple choice") {
    await gradeMultipleChoiceAnswer(req, res);
  }
};
export {
  respond,
  getAllResponses,
  getResponsesByUser,
  gradeMultipleChoiceAnswer,
  handleUserResponse,
};
