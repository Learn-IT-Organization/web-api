import { Router } from 'express';
import { createLessonContent, getAllLessonContents, getLessonContentById } from '../controllers/lessonContentController.js';

const router = Router();

router.post('/lessonContents', createLessonContent);

router.get('/lessonContents', getAllLessonContents);

router.get('/lessonContent/:id', getLessonContentById);

export default router;
