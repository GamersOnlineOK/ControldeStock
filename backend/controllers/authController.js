import User from "../models/user.js";
import { createAuthToken } from "../utils/authToken.js";
import { verifyPassword } from "../utils/password.js";
import { getManageableRoles, ROLE_LABELS, sanitizeUser } from "../utils/roles.js";

const buildSession = (user) => ({
    token: createAuthToken(user),
    user: sanitizeUser(user),
    assignableRoles: getManageableRoles(user.role).map((role) => ({
        value: role,
        label: ROLE_LABELS[role],
    })),
});

const login = async (req, res) => {
    try {
        const email = req.body.email?.trim().toLowerCase();
        const { password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
        }

        const user = await User.findOne({ email }).select('+passwordHash');
        if (!user || !verifyPassword(password, user.passwordHash)) {
            return res.status(401).json({ error: 'Credenciales invalidas' });
        }

        if (!user.isActive) {
            return res.status(403).json({ error: 'Usuario inactivo' });
        }

        res.json(buildSession(user));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const me = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-passwordHash');
        if (!user || !user.isActive) {
            return res.status(401).json({ error: 'Usuario no habilitado' });
        }

        res.json({
            user: sanitizeUser(user),
            assignableRoles: getManageableRoles(user.role).map((role) => ({
                value: role,
                label: ROLE_LABELS[role],
            })),
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export default { login, me };
