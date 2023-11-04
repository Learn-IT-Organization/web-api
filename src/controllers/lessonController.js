import Lessons from '../models/lessonModel.js';

const createLesson = async (req, res) => {
    try {
        const lesson = await Lessons.create(req.body);
        res.status(200).json(chapter);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getAllLessons = async (req, res) => {
    try {
        const lessons = await Lessons.findAll();
        res.status(200).json(chapters);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getLessonById = async (req, res) => {
    try {
        const lessonId = req.params.id;
        const lesson = await Lessons.findByPk(chapterId);
        if (chapter) {
            res.status(200).json(chapter);
        } else {
            res.status(404).json({ error: 'Lesson not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getLessonsByChapter = async (req, res) => {
    try {
        const { chapterId } = req.params;
        const lessons = await Lessons.findAll({
            where: {
                chapter_id: chapterId,
            },
        });

        if (lessons.length > 0) {
            res.status(200).json(chapters);
        } else {
            res.status(404).json({ error: 'No lessons found for the given chapter.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export { createLesson, getAllLessons, getLessonById, getLessonsByChapter};