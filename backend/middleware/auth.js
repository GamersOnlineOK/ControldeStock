import User from '../models/user.js';
import { verifyAuthToken } from '../utils/authToken.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ error: 'Debe iniciar sesion' });
    }

    const payload = verifyAuthToken(token);
    const user = await User.findById(payload.sub).select('-passwordHash');

    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Usuario no habilitado' });
    }

    req.user = {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
    };
    next();
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

export const requireRoles = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'No tiene permisos para realizar esta accion' });
  }
  next();
};
