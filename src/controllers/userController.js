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
  const { id } = req.params;
  const user = await Users.findByPk(id);
  res.status(HTTP_STATUS_CODES.OK).json(user);
};

export { createUser, getAllUsers, getUserById };
