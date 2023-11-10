import HTTP_STATUS_CODES from '../constants/httpStatusCodes.js';
import LessonContent from '../models/lessonContentModel.js';
import Lessons from '../models/lessonModel.js';
import QuestionsAnswers from '../models/questionsAnswersModel.js';

const createLesson = async (req, res) => {
    try {
        const lesson = await Lessons.create(req.body);
        res.status(HTTP_STATUS_CODES.CREATED).json(lesson);
    } catch (error) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: error.message });
    }
};

const getAllLessons = async (req, res) => {
    const lessons = await Lessons.findAll();
    if (lessons != null) {
        res.status(HTTP_STATUS_CODES.CREATED).json(lessons);
    } else {
        res.status(HTTP_STATUS_CODES.NOT_FOUND).json([]);
    }
};

const getLessonById = async (req, res) => {
    const lessonId = req.params.id;
    const lesson = await Lessons.findByPk(lessonId);
    if (lesson != null) {
        res.status(HTTP_STATUS_CODES.OK).json(lesson);
    } else {
        res.status(HTTP_STATUS_CODES.NOT_FOUND).json([]);
    }
};

const getContentsByLessonId = async (req, res) => {
    const lessonId = req.params.lessonId;
    const contents = await LessonContent.findAll({
        where: {
            content_lesson_id: lessonId
        }, 
    });
    if (contents.length > 0) {
        res.status(HTTP_STATUS_CODES.OK).json(contents);
    } else {
        res.status(HTTP_STATUS_CODES.NOT_FOUND).json([]);
    }
};

const getQuestionsAnswersByLessonId = async (req, res) => {
    const lessonId = req.params.lessonId;
    const questionsAnswers = await QuestionsAnswers.findAll({
        where: {
            qa_lesson_id: lessonId,
        },
    });
    if (questionsAnswers.length > 0) {
        res.status(HTTP_STATUS_CODES.OK).json(questionsAnswers);
    } else {
        res.status(HTTP_STATUS_CODES.NOT_FOUND).json([]);
    }
};

export {
    createLesson,
    getAllLessons,
    getLessonById,
    getContentsByLessonId,
    getQuestionsAnswersByLessonId
};
