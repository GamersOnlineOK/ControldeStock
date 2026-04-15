import user from "../models/user.js";

const createUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const newUser = new user({ username, email, password, role });
        await newUser.save();
        res.status(201).json(newUser);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }   
};

const getUsers = async (req, res) => {
    try {
        const users = await user.find();
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
 const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, password, role } = req.body;
        const updatedUser = await user.findByIdAndUpdate(id, { username, email, password, role }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(updatedUser);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteUser = async (req, res) => {
    //actualiza el usuario por su id y lo pone en inactivo y sin permisos
    try {        const { id } = req.params;
        const deletedUser = await user.findByIdAndUpdate(id, { role: 'inactive' }, { new: true });
        if (!deletedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ message: "User deactivated", user: deletedUser });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export default { createUser, getUsers, updateUser, deleteUser };