import Lessons from '../models/lessonModel.js';

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

export { createLesson, getAllLessons, getLessonById};