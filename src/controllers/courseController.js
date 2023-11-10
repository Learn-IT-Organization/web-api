import Course from '../models/courseModel.js';
import Chapter from '../models/chapterModel.js';
import QuestionsAnswers from '../models/questionsAnswersModel.js';

const createCourse = async (req, res) => {
    try {
        const course = await Course.create(req.body);
        res.status(201).json(course);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getAllCourses = async (req, res) => {
    const courses = await Course.findAll();
    if (courses != null) {
        res.status(200).json(courses);
    } else {
        res.status(404).json([])
    }
};

const getCourseById = async (req, res) => {
    const courseId = req.params.id;
    const course = await Course.findByPk(courseId);
    if (course != null) {
        res.status(200).json(course);
    } else {
        res.status(404).json([]);
    }
};

const getChaptersByCourseId = async (req, res) => {
    const courseId = req.params.courseId;
    const chapters = await Chapter.findAll({
        where: {
            chapter_course_id: courseId,
        },
    });
    if (chapters.length > 0) {
        res.status(200).json(chapters);
    } else {
        res.status(404).json([]);
    }
};


const getQuestionsAnswersByCourseId = async (req, res) => {
    const courseId = req.params.courseId;
    const questionsAnswers = await QuestionsAnswers.findAll({
        where: {
            qa_course_id: courseId,
        },
    });
    if (questionsAnswers.length > 0) {
        res.status(200).json(questionsAnswers);
    } else {
        res.status(404).json([]);
    }
};

export {
    createCourse,
    getAllCourses,
    getCourseById,
    getChaptersByCourseId,
    getQuestionsAnswersByCourseId
};
