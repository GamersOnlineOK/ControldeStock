import User from "../models/user.js";
import { hashPassword } from "../utils/password.js";
import { canManageRole, getManageableRoles, ROLE_LABELS, sanitizeUser } from "../utils/roles.js";

const buildUserPayload = (body) => ({
    username: body.username?.trim(),
    email: body.email?.trim().toLowerCase(),
    role: body.role || 'user',
});

const createUser = async (req, res) => {
    try {
        const { username, email, role } = buildUserPayload(req.body);
        const { password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Nombre, email y contraseña son obligatorios' });
        }

        if (!canManageRole(req.user.role, role)) {
            return res.status(403).json({ error: 'No puede crear usuarios con ese privilegio' });
        }

        const newUser = new User({
            username,
            email,
            role,
            passwordHash: hashPassword(password),
            isActive: true,
        });
        await newUser.save();
        res.status(201).json(sanitizeUser(newUser));
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }   
};

const getUsers = async (req, res) => {
    try {
        const filter = req.user.role === 'superadmin' ? {} : { role: 'user' };
        const users = await User.find(filter).select('-passwordHash').sort({ role: 1, username: 1 });
        res.status(200).json(users.map(sanitizeUser));
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAssignableRoles = (req, res) => {
    const roles = getManageableRoles(req.user.role).map((role) => ({
        value: role,
        label: ROLE_LABELS[role],
    }));
    res.json(roles);
};

 const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const existingUser = await User.findById(id).select('+passwordHash');

        if (!existingUser) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        if (!canManageRole(req.user.role, existingUser.role)) {
            return res.status(403).json({ error: 'No puede editar ese usuario' });
        }

        const nextRole = req.body.role || existingUser.role;
        if (!canManageRole(req.user.role, nextRole)) {
            return res.status(403).json({ error: 'No puede asignar ese privilegio' });
        }

        const { username, email } = buildUserPayload({ ...existingUser.toObject(), ...req.body, role: nextRole });

        existingUser.username = username || existingUser.username;
        existingUser.email = email || existingUser.email;
        existingUser.role = nextRole;

        if (typeof req.body.isActive === 'boolean') {
            existingUser.isActive = req.body.isActive;
        }

        if (req.body.password) {
            existingUser.passwordHash = hashPassword(req.body.password);
        }

        await existingUser.save();
        res.status(200).json(sanitizeUser(existingUser));
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteUser = async (req, res) => {
    //actualiza el usuario por su id y lo pone en inactivo y sin permisos
    try {
        const { id } = req.params;
        const existingUser = await User.findById(id);

        if (!existingUser) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        if (!canManageRole(req.user.role, existingUser.role)) {
            return res.status(403).json({ error: 'No puede desactivar ese usuario' });
        }

        existingUser.isActive = false;
        await existingUser.save();
        res.status(200).json({ message: "Usuario desactivado", user: sanitizeUser(existingUser) });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export default { createUser, getUsers, getAssignableRoles, updateUser, deleteUser };
