// routes/bom.js
import express from 'express';
const router = express.Router();
import bomController from '../controllers/bomController.js';

router.put('/:productId', bomController.createOrUpdateBOM);
router.get('/:productId/explosion', bomController.getBOMExplosion);

export default router;