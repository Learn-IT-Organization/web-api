import UserQuestionResponse from "../models/userQuestionResponseModel.js";
import HTTP_STATUS_CODES from "../constants/httpStatusCodes.js";

const respond = async (req, res) => {
  //TODO: verify response and grade it
  try {
    const response = await UserQuestionResponse.create(req.body);
    res.status(HTTP_STATUS_CODES.CREATED).json(response);
  } catch (error) {
    res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: error.message });
  }
};

const getAllResponses = async (req, res) => {
  const responses = await UserQuestionResponse.findAll();
  res.status(HTTP_STATUS_CODES.OK).json(responses);
};

const getResponsesByUser = async (req, res) => {
  const userId = req.params.id;
  const responses = await UserQuestionResponse.findAll({
    where: {
      uqr_user_id: userId,
    },
  });
  res.status(HTTP_STATUS_CODES.OK).json(responses);
};

export { 
  respond,
  getAllResponses, 
  getResponsesByUser 
};
