import Users from '../models/userModel.js';
import HTTP_STATUS_CODES from '../constants/httpStatusCodes.js';

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
    if (users != null) {
        res.status(HTTP_STATUS_CODES.OK).json(users);
    } else {
        res.status(HTTP_STATUS_CODES.NOT_FOUND).json([]);
    }
};

const getUserById = async (req, res) => {
    const { id } = req.params; 
    const user = await Users.findByPk(id);
    if (user != null) {
        res.status(HTTP_STATUS_CODES.OK).json(user);
    } else {
        res.status(HTTP_STATUS_CODES.NOT_FOUND).json([]);
    }
};

export {
    createUser,
    getAllUsers,
    getUserById
};