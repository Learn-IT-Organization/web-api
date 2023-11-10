import QuestionsAnswers from '../models/questionsAnswersModel.js';

const createQuestionsAnswers = async (req, res) => {
    try {
        const questionsAnswers = await QuestionsAnswers.create(req.body);
        res.status(201).json(questionsAnswers);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getAllQuestionsAnswers = async (req, res) => {
    const questionsAnswers = await QuestionsAnswers.findAll();
    if (questionsAnswers != null) {
        res.status(200).json(questionsAnswers);
    } else {
        res.status(404).json([]);
    }
};

export {
    createQuestionsAnswers,
    getAllQuestionsAnswers
};
