import { Router } from 'express';
import { createCourse, getAllCourses, getCourseById, getChaptersByCourseId } from '../controllers/courseController.js';

const router = Router();

router.post('/courses', createCourse);

router.get('/courses', getAllCourses);

router.get('/course/:id', getCourseById);

router.get('/course/:courseId/chapters', getChaptersByCourseId);

export default router;
