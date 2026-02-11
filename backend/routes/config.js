import express from 'express';
const router = express.Router();
import conf from '../controllers/configurationController.js';

router.get('/list',conf.getCategories);
router.post('/create',conf.createCategory);

export default router;
