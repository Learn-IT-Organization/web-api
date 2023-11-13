import Course from '../models/courseModel.js';
import Chapter from '../models/chapterModel.js';
import QuestionsAnswers from '../models/questionsAnswersModel.js';
import HTTP_STATUS_CODES from '../constants/httpStatusCodes.js';

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
    if (courses != null) {
        res.status(HTTP_STATUS_CODES.OK).json(courses);
    } else {
        res.status(HTTP_STATUS_CODES.NOT_FOUND).json([])
    }
};

const getCourseById = async (req, res) => {
    const courseId = req.params.id;
    const course = await Course.findByPk(courseId);
    if (course != null) {
        res.status(HTTP_STATUS_CODES.OK).json(course);
    } else {
        res.status(HTTP_STATUS_CODES.NOT_FOUND).json([]);
    }
};

const getChaptersByCourseId = async (req, res) => {
    const courseId = req.params.courseId;
    const chapters = await Chapter.findAll({
        where: {
            chapter_course_id: courseId,
        },
    });
    if (chapters.length > 0) {
        res.status(HTTP_STATUS_CODES.OK).json(chapters);
    } else {
        res.status(HTTP_STATUS_CODES.NOT_FOUND).json([]);
    }
};


const getQuestionsAnswersByCourseId = async (req, res) => {
    const courseId = req.params.courseId;
    const questionsAnswers = await QuestionsAnswers.findAll({
        where: {
            qa_course_id: courseId,
        },
    });
    if (questionsAnswers.length > 0) {
        res.status(200).json(questionsAnswers);
    } else {
        res.status(404).json([]);
    }
};

export {
    createCourse,
    getAllCourses,
    getCourseById,
    getChaptersByCourseId,
    getQuestionsAnswersByCourseId
};
