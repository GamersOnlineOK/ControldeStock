export const ROLES = {
  SUPERADMIN: 'superadmin',
  ADMIN: 'admin',
  USER: 'user',
};

export const ROLE_LABELS = {
  [ROLES.SUPERADMIN]: 'Superadmin',
  [ROLES.ADMIN]: 'Administrador',
  [ROLES.USER]: 'Usuario',
};

const MANAGEABLE_ROLES = {
  [ROLES.SUPERADMIN]: [ROLES.ADMIN, ROLES.USER],
  [ROLES.ADMIN]: [ROLES.USER],
  [ROLES.USER]: [],
};

export const getManageableRoles = (role) => MANAGEABLE_ROLES[role] || [];

export const canManageRole = (managerRole, targetRole) => getManageableRoles(managerRole).includes(targetRole);

export const sanitizeUser = (user) => {
  if (!user) return null;
  const cleanUser = typeof user.toObject === 'function' ? user.toObject() : { ...user };
  delete cleanUser.passwordHash;
  delete cleanUser.__v;
  return cleanUser;
};
