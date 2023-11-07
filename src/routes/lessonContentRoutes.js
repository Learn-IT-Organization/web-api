import { Router } from 'express';
import { createLessonContent, getAllLessonContents, getLessonContentById } from '../controllers/lessonContentController.js';

const router = Router();

router.post('/lessonContent', createLessonContent);

router.get('/lessonContent', getAllLessonContents);

router.get('/lessonContent/:id', getLessonContentById);

export default router;
