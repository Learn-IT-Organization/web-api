import Chapter from '../models/chapterModel.js';
import Lessons from '../models/lessonModel.js'; 
import QuestionsAnswers from '../models/questionsAnswersModel.js';

const createChapter = async (req, res) => {
    try {
        const chapter = await Chapter.create(req.body);
        res.status(201).json(chapter);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getAllChapters = async (req, res) => {
    const chapters = await Chapter.findAll();
    if (chapters != null) {
        res.status(200).json(chapters);
    } else {
        res.status(404).json([])
    }
};

const getChapterById = async (req, res) => {
    const chapterId = req.params.id;
    const chapter = await Chapter.findByPk(chapterId);
    if (chapter) {
        res.status(200).json(chapter);
    } else {
        res.status(404).json([]);
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
        res.status(200).json(lessons);
    } else {
        res.status(404).json([]);
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
        res.status(200).json(questionsAnswers);
    } else {
        res.status(404).json([]);
    }
};

export {
    createChapter,
    getAllChapters,
    getChapterById,
    getLessonsByChapterId,
    getQuestionsAnswersByChapterId
};
