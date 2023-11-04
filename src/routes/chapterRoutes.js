import { Router } from 'express';
import { createChapter, getAllChapters, getChapterById } from '../controllers/chapterController.js';

const router = Router();

router.post('/chapters', createChapter);

router.get('/chapters', getAllChapters);

router.get('/chapter/:id', getChapterById);

export default router;
