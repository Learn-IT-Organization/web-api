import Chapter from '../models/chapterModel.js';
import Lessons from '../models/lessonModel.js'; 
import QuestionsAnswers from '../models/questionsAnswersModel.js';
import HTTP_STATUS_CODES from '../constants/httpStatusCodes.js';

const createChapter = async (req, res) => {
    try {
        const chapter = await Chapter.create(req.body);
        res.status(HTTP_STATUS_CODES.CREATED).json(chapter);
    } catch (error) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: error.message });
    }
};

const getAllChapters = async (req, res) => {
    const chapters = await Chapter.findAll();
    if (chapters != null) {
        res.status(HTTP_STATUS_CODES.OK).json(chapters);
    } else {
        res.status(HTTP_STATUS_CODES.NOT_FOUND).json([])
    }
};

const getChapterById = async (req, res) => {
    const chapterId = req.params.id;
    const chapter = await Chapter.findByPk(chapterId);
    if (chapter) {
        res.status(HTTP_STATUS_CODES.OK).json(chapter);
    } else {
        res.status(HTTP_STATUS_CODES.NOT_FOUND).json([]);
    }
};

const getLessonsByChapterId = async (req, res) => {
    const chapterId = req.params.chapterId;
    const lessons = await Lessons.findAll({
        where: {
            lesson_chapter_id: chapterId
        }, 
    });
    if (lessons.length > 0) {
        res.status(HTTP_STATUS_CODES.OK).json(lessons);
    } else {
        res.status(HTTP_STATUS_CODES.NOT_FOUND).json([]);
    }
};

const getQuestionsAnswersByChapterId = async (req, res) => {
    const chapterId = req.params.chapterId;
    const questionsAnswers = await QuestionsAnswers.findAll({
        where: {
            qa_chapter_id: chapterId,
        },
    });
    if (questionsAnswers.length > 0) {
        res.status(HTTP_STATUS_CODES.OK).json(questionsAnswers);
    } else {
        res.status(HTTP_STATUS_CODES.NOT_FOUND).json([]);
    }
};

export {
    createChapter,
    getAllChapters,
    getChapterById,
    getLessonsByChapterId,
    getQuestionsAnswersByChapterId
};
