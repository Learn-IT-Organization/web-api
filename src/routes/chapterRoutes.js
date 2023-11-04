import { Router } from 'express';
import { createChapter, getAllChapters, getChapterById, getChaptersByCourse} from '../controllers/chapterController.js';

const router = Router();

router.post('/chapters', createChapter);

router.get('/chapters', getAllChapters);

router.get('/chapter/:id', getChapterById);

router.get('/chapters/by-course/:courseId', getChaptersByCourse);

export default router;
