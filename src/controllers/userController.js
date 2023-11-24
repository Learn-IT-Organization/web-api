import Users from "../models/userModel.js";
import HTTP_STATUS_CODES from "../constants/httpStatusCodes.js";

const createUser = async (req, res) => {
  try {
    const user = await Users.create(req.body);
    res.status(HTTP_STATUS_CODES.CREATED).json(user);
  } catch (error) {
    res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  const users = await Users.findAll();
  res.status(HTTP_STATUS_CODES.OK).json(users);
};

const getUserById = async (req, res) => {
  const userId = req.params.id;
  const user = await Users.findByPk(userId);
  if (user != null) {
    res.status(HTTP_STATUS_CODES.OK).json(user);
  } else {
    const error = new RecordNotFoundError(userId);
    res.status(error.statusCode).json(error.toJSON());
  }
};

export { createUser, getAllUsers, getUserById };
