import { Router } from 'express';
import { getStats, resetData } from '../controllers/statsController.js';

const router = Router();

router.get('/', getStats);
router.post('/reset', resetData);

export default router;
