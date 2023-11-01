import { Router } from 'express';
import { createCourse, getAllCourses } from '../controllers/courseController.js';

const router = Router();

router.post('/courses', createCourse);

router.get('/courses', getAllCourses);

export default router;
