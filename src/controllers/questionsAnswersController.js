import QuestionsAnswers from '../models/questionsAnswersModel.js';
import HTTP_STATUS_CODES from '../constants/httpStatusCodes.js';

const createQuestionsAnswers = async (req, res) => {
    try {
        const questionsAnswers = await QuestionsAnswers.create(req.body);
        res.status(HTTP_STATUS_CODES.CREATED).json(questionsAnswers);
    } catch (error) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: error.message });
    }
};

const getAllQuestionsAnswers = async (req, res) => {
    const questionsAnswers = await QuestionsAnswers.findAll();
    if (questionsAnswers != null) {
        res.status(HTTP_STATUS_CODES.OK).json(questionsAnswers);
    } else {
        res.status(HTTP_STATUS_CODES.NOT_FOUND).json([]);
    }
};

export {
    createQuestionsAnswers,
    getAllQuestionsAnswers
};
