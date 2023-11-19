import Course from "../models/courseModel.js";
import Chapter from "../models/chapterModel.js";
import QuestionsAnswers from "../models/questionsAnswersModel.js";
import HTTP_STATUS_CODES from "../constants/httpStatusCodes.js";

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
    res.status(HTTP_STATUS_CODES.NOT_FOUND).json({});
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

export {
  createCourse,
  getAllCourses,
  getCourseById,
  getChaptersByCourseId,
  getQuestionsAnswersByCourseId,
};
