import UserQuestionResponse from "../models/userQuestionResponseModel.js";
import HTTP_STATUS_CODES from "../constants/httpStatusCodes.js";
import QuestionsAnswers from "../models/questionsAnswersModel.js";
import Lessons from "../models/lessonModel.js";
import Users from "../models/userModel.js";
import { validateToken } from "../middleware/JWT.js";
import UserLessonProgress from "../models/userLessonProgress.js";

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

  const user = await Users.findByPk(req.body.uqr_user_id);

  if (user.last_response_time === null) {
    await Users.update(
      { streak: 1, last_response_time: new Date() },
      { where: { user_id: req.body.uqr_user_id } }
    );
  } else {
    const timeSinceLastResponse = new Date() - user.last_response_time;
    console.log(timeSinceLastResponse);
    if (timeSinceLastResponse > 86400000 && timeSinceLastResponse < 172800000) {
      await Users.update(
        { streak: user.streak + 1, last_response_time: new Date() },
        { where: { user_id: req.body.uqr_user_id } }
      );
    } else if (timeSinceLastResponse >= 172800000) {
      await Users.update(
        { streak: 1, last_response_time: new Date() },
        { where: { user_id: req.body.uqr_user_id } }
      );
    }
  }
};

const gradeResponse = async ({ uqr_question_id, uqr_user_id, response }) => {
  const question = await QuestionsAnswers.findOne({
    where: {
      question_id: uqr_question_id,
    },
  });

  const { answers, question_type } = question;
  const userResponse = response;

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
  await validateToken(req, res, () => {});
  const userId = req.authUser.id;
  const responses = await UserQuestionResponse.findAll({
    where: {
      uqr_user_id: userId,
    },
  });
  res.status(HTTP_STATUS_CODES.OK).json(responses);
};

const getLessonsResult = async (req, res) => {
  await validateToken(req, res, () => {});

  const userId = req.authUser.id;

  const lessons = await Lessons.findAll();
  const lessonResults = [];

  for (const lesson of lessons) {
    await calculateLessonResult(lesson.lesson_id, userId);
    const userRecord = await UserLessonProgress.findOne({
      where: { user_id: userId, lesson_id: lesson.lesson_id },
    });
    lessonResults.push(userRecord);
  }

  res.status(HTTP_STATUS_CODES.OK).json(lessonResults);
};

const calculateLessonResult = async (lessonId, userId) => {
  const questions = await QuestionsAnswers.findAll({
    where: { qa_lesson_id: lessonId },
  });

  const responses = await UserQuestionResponse.findAll({
    where: {
      uqr_user_id: userId,
      uqr_question_id: questions.map((question) => question.question_id),
    },
  });

  const userScore = responses.reduce(
    (acc, response) => acc + response.score,
    0
  );

  const totalScore = questions.length;

  const userRecord = await UserLessonProgress.findOne({
    where: { user_id: userId, lesson_id: lessonId },
  });

  if (!userRecord) {
    const isCompleted =
      questions.length === responses.length && questions.length > 0;

    if (questions.length === responses.length) {
      await UserLessonProgress.create({
        user_id: userId,
        lesson_id: lessonId,
        lesson_score: userScore * 10,
        is_completed: isCompleted,
      });
    } else {
      await UserLessonProgress.create({
        user_id: userId,
        lesson_id: lessonId,
        lesson_score: 0,
        is_completed: isCompleted,
      });
    }
  } else {
    const isCompleted =
      questions.length === responses.length && questions.length > 0;

    if (questions.length === responses.length) {
      await UserLessonProgress.update(
        { lesson_score: userScore * 10, is_completed: isCompleted },
        { where: { lesson_id: lessonId, user_id: userId } }
      );
    } else {
      await UserLessonProgress.update(
        { lesson_score: 0, is_completed: isCompleted },
        { where: { lesson_id: lessonId, user_id: userId } }
      );
      deleteUserResponsesByLesson(lessonId, userId);
    }
  }
  return { userScore, totalScore };
};

const deleteLessonResult = async (lessonId, userId) => {
  await UserLessonProgress.update(
    { lesson_score: null, is_completed: false },
    { where: { lesson_id: lessonId, user_id: userId } }
  );

  await UserQuestionResponse.destroy({
    where: {
      uqr_user_id: userId,
      uqr_question_id: await QuestionsAnswers.findAll({
        where: {
          qa_lesson_id: lessonId,
        },
      }).map((question) => question.question_id),
    },
  });
};

const deleteUserResponsesByLesson = async (lessonId, userId) => {
  const questions = await QuestionsAnswers.findAll({
    where: {
      qa_lesson_id: lessonId,
    },
  });

  await UserQuestionResponse.destroy({
    where: {
      uqr_user_id: userId,
      uqr_question_id: questions.map((question) => question.question_id),
    },
  });

  deleteLessonResult(lessonId, userId);

  res.status(HTTP_STATUS_CODES.OK).json({ success: true, message: "Deleted" });
};

export {
  respond,
  getAllResponses,
  getResponsesByUser,
  getLessonsResult,
  deleteUserResponsesByLesson,
};
