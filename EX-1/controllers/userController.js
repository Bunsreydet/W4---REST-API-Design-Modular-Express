// controllers/userController.js
import users from '../models/userModel.js';

const getAllUsers = (req, res) => {
    res.json(users);
};

const getUser = (req, res) => {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
};

const createUser = (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
    };

    const newUser = {
        id: users.length + 1,
        name,
        email,
    };
    res.status(201).json(newUser);
};

const updateUser = (req, res) => {
    const userId = parseInt(req.params.id);
    const { name, email } = req.body;

    const user = users.find(u => u.id === userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (name) user.name = name;
    if (email) user.email = email;

    res.json(user);
};

const deleteUser = (req, res) => {
    const userId = parseInt(req.params.id);
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) return res.status(404).json({ error: 'User not found' });

    users.splice(index, 1);
    res.status(204).send();
};

export default {
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
};