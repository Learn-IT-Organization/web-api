import { Router } from 'express';
import { createLesson,
         getAllLessons,
         getLessonById,
         getContentsByLessonId,
         getQuestionsAnswersByLessonId
        } from '../controllers/lessonController.js';

const router = Router();

router.post('/lessons', createLesson);

router.get('/lessons', getAllLessons);

router.get('/lesson/:id', getLessonById);

router.get('/lessons/:lessonId/contents', getContentsByLessonId);

router.get('/lessons/:lessonId/questionsAnswers', getQuestionsAnswersByLessonId);

export default router;
