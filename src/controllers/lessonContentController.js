import LessonContent from '../models/lessonContentModel.js';

const createLessonContent = async (req, res) => {
    try {
        const lessonContent = await LessonContent.create(req.body);
        res.status(201).json(lessonContent);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getAllLessonContents = async (req, res) => {
    const lessonContent = await LessonContent.findAll();
    if (lessonContent != null) {
        res.status(200).json(lessonContent);
    } else {
        res.status(404).json([]);
    }
};

const getLessonContentById = async (req, res) => {
    const lessonContentId = req.params.id;
    const lessonContent = await LessonContent.findByPk(lessonContentId);
    if (lessonContent != null) {
        res.status(200).json(lessonContent);
    } else {
        res.status(404).json([]);
    }
};

export {
    createLessonContent,
    getAllLessonContents,
    getLessonContentById
};