import Chapter from '../models/chapterModel.js';

const createChapter = async (req, res) => {
    try {
        const chapter = await Chapter.create(req.body);
        res.status(200).json(chapter);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getAllChapters = async (req, res) => {
    try {
        const chapters = await Chapter.findAll();
        res.status(200).json(chapters);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getChapterById = async (req, res) => {
    try {
        const chapterId = req.params.id;
        const chapter = await Chapter.findByPk(chapterId);

        if (chapter) {
            res.status(200).json(chapter);
        } else {
            res.status(404).json({ error: 'Chapter not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getChaptersByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const chapters = await Chapter.findAll({
            where: {
                course_id: courseId,
            },
        });

        if (chapters.length > 0) {
            res.status(200).json(chapters);
        } else {
            res.status(404).json({ error: 'No chapters found for the given course.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export { createChapter, getAllChapters, getChapterById, getChaptersByCourse };
