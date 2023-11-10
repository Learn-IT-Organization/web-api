import LessonContent from '../models/lessonContentModel.js';
import Lessons from '../models/lessonModel.js';
import QuestionsAnswers from '../models/questionsAnswersModel.js';

const createLesson = async (req, res) => {
    try {
        const lesson = await Lessons.create(req.body);
        res.status(201).json(lesson);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getAllLessons = async (req, res) => {
    const lessons = await Lessons.findAll();
    if (lessons != null) {
        res.status(200).json(lessons);
    } else {
        res.status(404).json([]);
    }
};

const getLessonById = async (req, res) => {
    const lessonId = req.params.id;
    const lesson = await Lessons.findByPk(lessonId);
    if (lesson != null) {
        res.status(200).json(lesson);
    } else {
        res.status(404).json([]);
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
        res.status(200).json(contents);
    } else {
        res.status(404).json([]);
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
        res.status(200).json(questionsAnswers);
    } else {
        res.status(404).json([]);
    }
};

export {
    createLesson,
    getAllLessons,
    getLessonById,
    getContentsByLessonId,
    getQuestionsAnswersByLessonId
};
