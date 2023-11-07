import QuestionsAnswers from '../models/questionsAnswersModel.js';

const createQuestionsAnswers = async (req, res) => {
    try {
        const questionsAnswers = await QuestionsAnswers.create(req.body);
        res.status(200).json(questionsAnswers);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getAllQuestionsAnswers = async (req, res) => {
    try {
        const questionsAnswers = await QuestionsAnswers.findAll();
        res.status(200).json(questionsAnswers);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export { createQuestionsAnswers,
         getAllQuestionsAnswers };
