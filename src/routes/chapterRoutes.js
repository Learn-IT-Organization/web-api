import { Router } from 'express';
import { createChapter,
         getAllChapters,
         getChapterById,
         getLessonsByChapterId,
         getQuestionsAnswersByChapterId 
        } from '../controllers/chapterController.js';

const router = Router();

router.post('/chapters', createChapter);

router.get('/chapters', getAllChapters);

router.get('/chapter/:id', getChapterById);

router.get('/chapters/:chapterId/lessons', getLessonsByChapterId );

router.get('/chapters/:chapterId/questionsAnswers', getQuestionsAnswersByChapterId)

export default router;
