import UserQuestionResponse from "../models/userQuestionResponseModel.js";
import HTTP_STATUS_CODES from "../constants/httpStatusCodes.js";
import QuestionsAnswers from "../models/questionsAnswersModel.js";
import Lessons from "../models/lessonModel.js";
import Users from "../models/userModel.js";
import { validateToken } from "../middleware/JWT.js";
import UserLessonProgress from "../models/userLessonProgressModel.js";

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
  } else if (question_type === "matching") {
    const userAnswers = userResponse;
    const correctAnswers = answers.map((answer) => ({
      first: answer.textLeft,
      second: answer.textRight,
    }));

    let correctPairs = 0;
    let totalPairs = correctAnswers.length;
    console.log("correctAnswers", correctAnswers);
    console.log("userAnswers", userAnswers);
    correctAnswers.forEach((correctPair) => {
      const userPair = userAnswers.find(
        (userPair) =>
          userPair.first === correctPair.first &&
          userPair.second === correctPair.second
      );
      if (userPair) {
        correctPairs += 1;
      }
    });

    score = correctPairs / totalPairs;
    isCorrect = score === 1;
    console.log("score", score);
    if (score > 0 && score < 1) {
      isCorrect = true;
    }
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

  const lessons = await Lessons.findAll({ where: { lesson_type: "exercise" } });
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
};

const getUserResultsWithValidation = async (req, res) => {
  await validateToken(req, res, () => {});
  const userId = req.authUser.id;
  const lessonId = req.params.lessonId;

  const responses = await QuestionsAnswers.findAll({
    where: {
      qa_lesson_id: lessonId,
    },
  });

  const validatedResponses = [];

  for (const response of responses) {
    const singleUserResponse = await UserQuestionResponse.findAll({
      where: {
        uqr_user_id: userId,
        uqr_question_id: response.question_id,
      },
    });

    const correctnessInfo = checkCorrectness(response, singleUserResponse);

    validatedResponses.push({
      questionText: response.question_text,
      questionType: response.question_type,
      score: singleUserResponse[0]?.score,
      userAnswer: getAnswerText(response, singleUserResponse),
      correctness: correctnessInfo,
    });
  }

  res.status(HTTP_STATUS_CODES.OK).json(validatedResponses);
};

const getAnswerText = (response, singleUserResponse) => {
  if (response.question_type === "multiple_choice") {
    const userResponses = singleUserResponse[0]?.response;

    if (userResponses) {
      const selectedOptions = userResponses
        .map((selected, index) =>
          selected ? response.answers[index].option_text : null
        )
        .filter(Boolean);

      if (selectedOptions) {
        return selectedOptions.join(", ");
      }
    }
    return "User response not available";
  } else if (response.question_type === "true_false") {
    return singleUserResponse[0]?.response[0];
  } else if (response.question_type === "sorting") {
    return (
      response.answers[0]?.ansUpText +
      ": " +
      singleUserResponse[0]?.response.up.join(", ") +
      ", " +
      response.answers[0]?.ansDownText +
      ": " +
      singleUserResponse[0]?.response.down.join(", ")
    );
  } else if (response.question_type === "matching") {
    const userResponses = singleUserResponse[0]?.response;

    if (userResponses) {
      const formattedResponse = userResponses.map((pair) => {
        return `${pair.first} - ${pair.second}`;
      });

      return formattedResponse.join(", ");
    }
    return "User response not available";
  } else {
    return "Unsupported question type";
  }
};

const checkCorrectness = (correctResponse, userResponse) => {
  switch (correctResponse.question_type) {
    case "multiple_choice":
      return checkMultipleChoiceCorrectness(correctResponse, userResponse);
    case "true_false":
      return checkTrueFalseCorrectness(correctResponse, userResponse);
    case "sorting":
      return checkSortingCorrectness(correctResponse, userResponse);
    case "matching":
      return checkMatchingCorrectness(correctResponse, userResponse);
    default:
      return { correct: false, responseText: "Unsupported question type" };
  }
};

const checkMultipleChoiceCorrectness = (correctResponse, userResponse) => {
  const correctOptions = correctResponse.answers
    .filter((ans) => ans.is_correct)
    .map((ans) => ans.option_text);

  const userSelectedOptions =
    userResponse.length > 0
      ? userResponse[0]?.response
          .map((selected, index) =>
            selected ? correctResponse.answers[index].option_text : null
          )
          .filter(Boolean)
      : [];

  const score = userResponse[0]?.score || 0;
  let correct = false;
  let responseText = "";
  console.log("score", score);
  if (score === 1) {
    correct = true;
    responseText = "Correct answer!";
  } else if (score > 0 && score < 1) {
    correct = true;
    responseText = `Partially correct, the correct option(s): ${correctOptions.join(
      ", "
    )}`;
  } else {
    correct = false;
    responseText = `Incorrect, correct answer(s): ${correctOptions.join(", ")}`;
  }

  return { correct, responseText };
};

const checkTrueFalseCorrectness = (correctResponse, userResponse) => {
  const correctAnswer =
    correctResponse.answers.find((ans) => ans.is_correct).option_text ===
    "True";

  const userSelectedAnswer = userResponse[0]?.response[0];

  const correct = userSelectedAnswer === correctAnswer;
  const responseText = correct
    ? "Correct!"
    : `Incorrect, correct answer: ${correctAnswer ? "True" : "False"}`;

  return { correct, responseText };
};

const checkSortingCorrectness = (correctResponse, userResponse) => {
  const correctUpList = correctResponse.answers[0].up;
  const correctDownList = correctResponse.answers[0].down;
  const userUpList = userResponse[0]?.response.up;
  const userDownList = userResponse[0]?.response.down;

  console.log("user response", userResponse[0]?.response);
  console.log("correct response", correctResponse.answers[0]);
  var score = userResponse[0]?.score || 0;
  const arraysEqual = (arr1, arr2) => {
    const sortedArr1 = arr1.slice().sort();
    const sortedArr2 = arr2.slice().sort();
    return JSON.stringify(sortedArr1) === JSON.stringify(sortedArr2);
  };

  let correct =
    arraysEqual(correctUpList, userUpList) &&
    arraysEqual(correctDownList, userDownList);

  let responseText = correct
    ? "Correct!"
    : `Incorrect, correct order: ${correctResponse.answers[0]?.ansUpText}: ${correctUpList}, ${correctResponse.answers[0]?.ansDownText}: ${correctDownList}`;

  if (score > 0 && score < 1) {
    correct = true;
    responseText = `Partially correct, the correct order: ${correctResponse.answers[0]?.ansUpText}: ${correctUpList}, ${correctResponse.answers[0]?.ansDownText}: ${correctDownList}`;
  }

  return { correct, responseText };
};

const checkMatchingCorrectness = (correctResponse, userResponse) => {
  const correctPairs = correctResponse.answers.map((ans) => ({
    first: ans.textLeft,
    second: ans.textRight,
  }));

  const userPairs = userResponse[0]?.response;

  if (!userPairs) {
    return { correct: false, responseText: "User did not provide an answer." };
  }

  let correctPairsFound = 0;
  let responseText = "";

  for (const pair of correctPairs) {
    const foundPair = userPairs.find(
      (userPair) =>
        userPair.first === pair.first && userPair.second === pair.second
    );

    if (foundPair) {
      correctPairsFound++;
    }
  }

  const correctPercentage = (correctPairsFound / correctPairs.length) * 100;
  let correct = false;

  if (correctPercentage === 100) {
    correct = true;
    responseText = "Correct!";
  } else if (correctPercentage > 0) {
    correct = true;
    responseText = `Partially correct. Correct pairs are: `;
    responseText += correctPairs
      .map((pair) => `${pair.first}-${pair.second}`)
      .join(", ");
  } else {
    responseText = "Incorrect. Correct pairs are: ";
    responseText += correctPairs
      .map((pair) => `${pair.first}-${pair.second}`)
      .join(", ");
  }

  return { correct, responseText };
};

export {
  respond,
  getAllResponses,
  getResponsesByUser,
  getLessonsResult,
  deleteUserResponsesByLesson,
  getUserResultsWithValidation,
};
