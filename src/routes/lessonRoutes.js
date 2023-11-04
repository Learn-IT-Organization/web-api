import { Router } from 'express';
import { createLesson, getAllLessons, getLessonById} from '../controllers/lessonController.js';

const router = Router();

router.post('/lessons', createLesson);
router.get('/lessons', getAllLessons);
router.get('/lesson/:id', getLessonById)

export default router;
