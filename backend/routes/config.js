import express from 'express';
const router = express.Router();
import conf from '../controllers/configurationController.js';

router.get('/list',conf.getCategories);
router.post('/create',conf.createCategory);
router.patch('/update/:id',conf.patchCategory);

export default router;
