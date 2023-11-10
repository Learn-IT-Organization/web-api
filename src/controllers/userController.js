import Users from '../models/userModel.js';

const addUser = async (req, res) => {
    try {
        const user = await Users.create(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getAllUsers = async (req, res) => {
    const users = await Users.findAll();
    if (users != null) {
        res.status(200).json(users);
    } else {
        res.status(404).json([]);
    }
};

const getUserById = async (req, res) => {
    const { id } = req.params; 
    const user = await Users.findByPk(id);
    if (user != null) {
        res.status(200).json(user);
    } else {
        res.status(404).json([]);
    }
};

export {
    addUser,
    getAllUsers,
    getUserById
};