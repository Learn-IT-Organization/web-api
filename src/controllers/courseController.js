import Course from '../models/courseModel.js';
import Chapter from '../models/chapterModel.js';

const createCourse = async (req, res) => {
    try {
        const course = await Course.create(req.body);
        res.status(200).json(course);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.findAll();
        res.status(200).json(courses);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getCourseById = async (req, res) => {
    try {
        const courseId = req.params.id; 
        const course = await Course.findByPk(courseId);

        if (course) {
            res.status(200).json(course);
        } else {
            res.status(404).json({ error: 'Course not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getChaptersByCourseId = async (req, res) => {
    try {
        const  courseId  = req.params;
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

export { createCourse, getAllCourses, getCourseById, getChaptersByCourseId };
