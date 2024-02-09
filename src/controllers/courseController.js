import Course from "../models/courseModel.js";
import Chapter from "../models/chapterModel.js";
import QuestionsAnswers from "../models/questionsAnswersModel.js";
import HTTP_STATUS_CODES from "../constants/httpStatusCodes.js";
import { RecordNotFoundError } from "../constants/errors.js";

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
  res.status(HTTP_STATUS_CODES.OK).json(chapters);
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
          return {
            ansUpText: answer.ansUpText,
            ansDownText: answer.ansDownText,
            concepts: [...answer.up, ...answer.down],
          };
        });
        break;
    }
  }
  res.status(200).json(questionsAnswers);
};

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
  for(let question of questionsAnswers) {
    switch(question.question_type){
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
          return {
            ansUpText: answer.ansUpText,
            ansDownText: answer.ansDownText,
            concepts: [...answer.up, ...answer.down],
          };
        });
        break;
    }
  }
  res.status(200).json(questionsAnswers);
};

export {
  createCourse,
  getAllCourses,
  getCourseById,
  getChaptersByCourseId,
  getQuestionsAnswersByCourseId,
  getQuestionsAnswersByCourseIdChapterIdLessonId,
  getQuestionsAnswersFilteredByType,
};
