import HTTP_STATUS_CODES from "../constants/httpStatusCodes.js";
import UserScore from "../models/userScoreModel.js";

const getScoresByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const userScore = await UserScore.findAll({
      where: { user_id: userId },
    });
    res.status(HTTP_STATUS_CODES.OK).json(userScore);
  } catch (error) {
    res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: error.message });
  }
};

const getScoreByResponseId = async (req, res) => {
  try {
    const responseId = req.params.responseId;
    const userScore = await UserScore.findOne({
      where: { response_id: responseId },
    });
    res.status(HTTP_STATUS_CODES.OK).json(userScore);
  } catch (error) {
    res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: error.message });
  }
};

export { getScoresByUserId, getScoreByResponseId };
