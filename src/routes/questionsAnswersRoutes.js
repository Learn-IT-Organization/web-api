import { Router } from 'express';
import { createQuestionsAnswers,
         getAllQuestionsAnswers,
        } from '../controllers/questionsAnswersController.js';

const router = Router();

router.post('/questionsAnswers', createQuestionsAnswers);

router.get('/questionsAnswers', getAllQuestionsAnswers);

export default router;