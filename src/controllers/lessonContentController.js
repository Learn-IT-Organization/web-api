import LessonContent from '../models/lessonContentModel.js';

const createLessonContent = async (req, res) => {
    try {
        const lessonContent = await LessonContent.create(req.body);
        res.status(200).json(lessonContent);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getAllLessonContents = async (req, res) => {
    try {
        const lessonContent = await LessonContent.findAll();
        res.status(200).json(lessonContent);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getLessonContentById = async (req, res) => {
    try {
        const lessonContentId = req.params.id;
        const lessonContent = await LessonContent.findByPk(lessonContentId);
        if (lessonContent) {
            res.status(200).json(lessonContent);
        } else {
            res.status(404).json({ error: 'Lesson content not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export { createLessonContent, getAllLessonContents, getLessonContentById};