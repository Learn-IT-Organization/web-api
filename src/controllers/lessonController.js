import Lessons from '../models/lessonModel.js';
import QuestionsAnswers from '../models/questionsAnswersModel.js';

const createLesson = async (req, res) => {
    try {
        const lesson = await Lessons.create(req.body);
        res.status(200).json(lesson);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getAllLessons = async (req, res) => {
    try {
        const lessons = await Lessons.findAll();
        res.status(200).json(lessons);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getLessonById = async (req, res) => {
    try {
        const lessonId = req.params.id;
        const lesson = await Lessons.findByPk(lessonId);
        if (lesson) {
            res.status(200).json(lesson);
        } else {
            res.status(404).json({ error: 'Lesson not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getQuestionsAnswersByLessonId = async (req, res) => {
    try {
        const lessonId = req.params.lessonId;
        const questionsAnswers = await QuestionsAnswers.findAll({
            where: {
                qa_lesson_id: lessonId,
            },
        });
        if (questionsAnswers.length > 0) {
            res.status(200).json(questionsAnswers);
        } else {
            res.status(404).json({ error: 'No questions or answers found for the given lesson.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export { createLesson,
         getAllLessons,
         getLessonById,
        getQuestionsAnswersByLessonId };