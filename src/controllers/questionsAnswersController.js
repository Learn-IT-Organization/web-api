import QuestionsAnswers from "../models/questionsAnswersModel.js";
import HTTP_STATUS_CODES from "../constants/httpStatusCodes.js";

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
  res.status(HTTP_STATUS_CODES.OK).json(questionsAnswers);
};

const editQuestionsAnswers = async (req, res) => {
  const { id } = req.params;
  const { question_text, answers } = req.body;

  try {
    const questionsAnswers = await QuestionsAnswers.findByPk(id);

    if (!questionsAnswers) {
      return res
        .status(HTTP_STATUS_CODES.NOT_FOUND)
        .json({ error: "QuestionsAnswers not found" });
    }

    if (question_text !== undefined) {
      questionsAnswers.question_text = question_text;
    }
    if (answers !== undefined) {
      questionsAnswers.answers = answers;
    }

    await questionsAnswers.save();
    return res.status(HTTP_STATUS_CODES.OK).json({
      success: true,
      message: "QuestionsAnswers updated successfully",
      questionsAnswersId: questionsAnswers.question_id,
      lessonId: questionsAnswers.qa_lesson_id,
    });
  } catch (error) {
    res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: error.message });
  }
};

const deleteQuestionsAnswers = async (req, res) => {
  const { id } = req.params;

  try {
    const questionsAnswers = await QuestionsAnswers.findByPk(id);

    if (!questionsAnswers) {
      return res
        .status(HTTP_STATUS_CODES.NOT_FOUND)
        .json({ error: "QuestionsAnswers not found" });
    }

    await questionsAnswers.destroy();
    return res.status(HTTP_STATUS_CODES.OK).json({
      success: true,
      message: "QuestionsAnswers deleted successfully",
      questionsAnswersId: questionsAnswers.question_id,
      lessonId: questionsAnswers.qa_lesson_id,
    });
  } catch (error) {
    res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: error.message });
  }
};

export { createQuestionsAnswers, getAllQuestionsAnswers, editQuestionsAnswers };
