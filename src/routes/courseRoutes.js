import { Router } from 'express';
import { createCourse,
         getAllCourses,
         getCourseById,
         getChaptersByCourseId,
         getQuestionsAnswersByCourseId
        } from '../controllers/courseController.js';

const router = Router();

router.post('/courses', createCourse);

router.get('/courses', getAllCourses);

router.get('/course/:id', getCourseById);

router.get('/course/:courseId/chapters', getChaptersByCourseId);

router.get('/course/:courseId/questionsAnswers', getQuestionsAnswersByCourseId);


export default router;
