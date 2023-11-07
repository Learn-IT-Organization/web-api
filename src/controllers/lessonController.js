import LessonContent from '../models/lessonContentModel.js';
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

const getContentsByLessonId = async (req, res) => {
    try {
        const lessonId = req.params.lessonId;
    
        const contents = await LessonContent.findAll({
          where: { content_lesson_id: lessonId }, 
        });
    
        if (contents.length > 0) {
            res.status(200).json(contents);
        } else {
            res.status(404).json({ error: 'No contents found for the given lesson.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export { createLesson, getAllLessons, getLessonById, getContentsByLessonId};