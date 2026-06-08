import User from '../models/user.js';
import { hashPassword, verifyPassword } from '../utils/password.js';

const getSuperAdminConfig = () => ({
  email: process.env.SUPERADMIN_EMAIL?.trim().toLowerCase(),
  password: process.env.SUPERADMIN_PASSWORD,
  username: process.env.SUPERADMIN_USERNAME?.trim() || 'Superadmin',
});

export const seedSuperAdmin = async () => {
  const { email, password, username } = getSuperAdminConfig();

  if (!email || !password) {
    console.warn('Superadmin no configurado: faltan SUPERADMIN_EMAIL o SUPERADMIN_PASSWORD');
    return;
  }

  const existingUser = await User.findOne({ email }).select('+passwordHash');
  const passwordHash = existingUser && verifyPassword(password, existingUser.passwordHash)
    ? existingUser.passwordHash
    : hashPassword(password);

  if (!existingUser) {
    await User.create({
      username,
      email,
      passwordHash,
      role: 'superadmin',
      isActive: true,
    });
    console.log(`Superadmin listo: ${email}`);
    return;
  }

  let changed = false;
  if (existingUser.username !== username) {
    existingUser.username = username;
    changed = true;
  }
  if (existingUser.passwordHash !== passwordHash) {
    existingUser.passwordHash = passwordHash;
    changed = true;
  }
  if (existingUser.role !== 'superadmin') {
    existingUser.role = 'superadmin';
    changed = true;
  }
  if (!existingUser.isActive) {
    existingUser.isActive = true;
    changed = true;
  }

  if (changed) {
    await existingUser.save();
  }

  console.log(`Superadmin listo: ${email}`);
};
