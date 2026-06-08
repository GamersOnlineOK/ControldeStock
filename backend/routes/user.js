import {Router} from 'express';
import userController from '../controllers/userController.js';
import { authenticate, requireRoles } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);
router.use(requireRoles('superadmin', 'admin'));

router.get('/roles', userController.getAssignableRoles);
router.get('/', userController.getUsers);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router;
