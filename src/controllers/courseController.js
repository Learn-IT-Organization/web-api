import Course from "../models/courseModel.js";
import Chapter from "../models/chapterModel.js";
import QuestionsAnswers from "../models/questionsAnswersModel.js";
import UserQuestionResponse from "../models/userQuestionResponseModel.js";
import HTTP_STATUS_CODES from "../constants/httpStatusCodes.js";
import Lessons from "../models/lessonModel.js";
import { RecordNotFoundError } from "../constants/errors.js";
import { validateToken } from "../middleware/JWT.js";
import UserLessonProgress from "../models/userLessonProgress.js";

const createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(HTTP_STATUS_CODES.CREATED).json(course);
  } catch (error) {
    res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: error.message });
  }
};

const getAllCourses = async (req, res) => {
  const courses = await Course.findAll();
  res.status(HTTP_STATUS_CODES.OK).json(courses);
};

const getCourseById = async (req, res) => {
  const courseId = req.params.id;
  const course = await Course.findByPk(courseId);
  if (course != null) {
    res.status(HTTP_STATUS_CODES.OK).json(course);
  } else {
    const error = new RecordNotFoundError(courseId);
    res.status(error.statusCode).json(error.toJSON());
  }
};

const getChaptersByCourseId = async (req, res) => {
  const courseId = req.params.courseId;
  const chapters = await Chapter.findAll({
    where: {
      chapter_course_id: courseId,
    },
  });
  const chaptersAndLessons = [];
  for (const chapter of chapters) {
    const lessons = await Lessons.findAll({
      where: {
        lesson_chapter_id: chapter.chapter_id,
      },
    });
    chaptersAndLessons.push({ chapter, lessons });
  }
  res.status(HTTP_STATUS_CODES.OK).json(chaptersAndLessons);
};

const getQuestionsAnswersByCourseId = async (req, res) => {
  const courseId = req.params.courseId;
  const questionsAnswers = await QuestionsAnswers.findAll({
    where: {
      qa_course_id: courseId,
    },
  });
  res.status(200).json(questionsAnswers);
};

const getQuestionsAnswersByCourseIdChapterIdLessonId = async (req, res) => {
  const courseId = req.params.courseId;
  const chapterId = req.params.chapterId;
  const lessonId = req.params.lessonId;
  const questionsAnswers = await QuestionsAnswers.findAll({
    where: {
      qa_course_id: courseId,
      qa_chapter_id: chapterId,
      qa_lesson_id: lessonId,
    },
  });
  for (let question of questionsAnswers) {
    switch (question.question_type) {
      case "multiple_choice":
        question.answers = question.answers.map((answer) => {
          return answer.option_text;
        });
        break;
      case "true_false":
        question.answers = question.answers.map((answer) => {
          return answer.option_text;
        });
        break;
      case "sorting":
        question.answers = question.answers.map((answer) => {
          const shuffledConcepts = shuffle([...answer.up, ...answer.down]);
          return {
            ansUpText: answer.ansUpText,
            ansDownText: answer.ansDownText,
            concepts: shuffledConcepts,
          };
        });
        break;
    }
  }
  res.status(200).json(questionsAnswers);
};

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

const getQuestionsAnswersFilteredByType = async (req, res) => {
  const courseId = req.params.courseId;
  const chapterId = req.params.chapterId;
  const lessonId = req.params.lessonId;
  const questionType = req.params.questionType;
  const questionsAnswers = await QuestionsAnswers.findAll({
    where: {
      qa_course_id: courseId,
      qa_chapter_id: chapterId,
      qa_lesson_id: lessonId,
      question_type: questionType,
    },
  });
  for (let question of questionsAnswers) {
    switch (question.question_type) {
      case "multiple_choice":
        question.answers = question.answers.map((answer) => {
          return answer.option_text;
        });
        break;
      case "true_false":
        question.answers = question.answers.map((answer) => {
          return answer.option_text;
        });
        break;
      case "sorting":
        question.answers = question.answers.map((answer) => {
          const shuffledConcepts = shuffle([...answer.up, ...answer.down]);
          return {
            ansUpText: answer.ansUpText,
            ansDownText: answer.ansDownText,
            concepts: shuffledConcepts,
          };
        });
        break;
    }
  }
  res.status(200).json(questionsAnswers);
};

const getMyCourses = async (req, res) => {
  try {
    await validateToken(req, res, () => {});
    const userId = req.authUser.id;

    const userResponses = await UserQuestionResponse.findAll({
      where: {
        uqr_user_id: userId,
      },
      attributes: ["uqr_question_id"],
    });

    const questionIds = userResponses.map(
      (response) => response.uqr_question_id
    );

    const questions = await QuestionsAnswers.findAll({
      where: {
        question_id: questionIds,
      },
      attributes: ["qa_course_id"],
    });

    const courseIds = questions.map((question) => question.qa_course_id);

    const myCourses = await Course.findAll({
      where: {
        course_id: courseIds,
      },
    });

    res.status(HTTP_STATUS_CODES.OK).json(myCourses);
  } catch (error) {
    console.error("Error in getMyCourses:", error);
    res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch user courses.",
    });
  }
};

const calculateChapterScore = async (req, res) => {
  await validateToken(req, res, () => {});
  const userId = req.authUser.id;
  const courseId = req.params.courseId;
  const chapterId = req.params.chapterId;

  const chapters = await Chapter.findAll({
    where: {
      chapter_course_id: courseId,
      chapter_id: chapterId,
    },
  });
  console.log(chapters);
  let userScore = 0;
  let userLessonProgress;
  let lessons;
  let totalLessons = 0;
  let totalUserlessons = 0;

  for (const chapter of chapters) {
    lessons = await Lessons.findAll({
      where: {
        lesson_chapter_id: chapter.chapter_id,
        lesson_type: "exercise",
      },
    });
    for (const lesson of lessons) {
      userLessonProgress = await UserLessonProgress.findAll({
        where: {
          user_id: userId,
          lesson_id: lesson.lesson_id,
        },
      });
      for (const progress of userLessonProgress) {
        userScore += progress.lesson_score;
        if (progress.is_completed == true) {
          totalUserlessons += userLessonProgress.length;
        }
      }
    }
    totalLessons += lessons.length;
  }
  res.status(HTTP_STATUS_CODES.OK).json({
    userScore: userScore,
    isCompleted: totalLessons == totalUserlessons && totalLessons > 0,
    lessonsCompleted: totalUserlessons,
    totalLessons: totalLessons,
  });
};

export {
  createCourse,
  getAllCourses,
  getCourseById,
  getChaptersByCourseId,
  getQuestionsAnswersByCourseId,
  getQuestionsAnswersByCourseIdChapterIdLessonId,
  getQuestionsAnswersFilteredByType,
  getMyCourses,
  calculateChapterScore,
};
