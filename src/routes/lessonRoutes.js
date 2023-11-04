import { Router } from 'express';
import { createLesson, getAllLessons, getLessonById, getLessonsByChapter } from '../controllers/lessonController.js';

const router = Router();

router.post('/lessons', createLesson);
router.get('/lessons', getAllLessons);
router.get('/lesson/:id', getLessonById)
router.get('/lessons/:chapterId', getLessonsByChapter);

export default router;
