import { Router } from 'express';
import { createCourse, getAllCourses, getCourseById } from '../controllers/courseController.js';

const router = Router();

router.post('/courses', createCourse);

router.get('/courses', getAllCourses);

router.get('/course/:id', getCourseById)

export default router;
