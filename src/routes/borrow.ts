import { Router } from 'express';
import { borrowBook, borrowSummary } from '../controllers/borrowController';

const router = Router();

router.post('/', borrowBook);
router.get('/', borrowSummary);

// You can add GET for aggregation summary here later

export default router;
