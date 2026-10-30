import { Router } from 'express';
import {
  getTransactions,
  getTransactionById,
  issueBook,
  returnBook,
} from '../controllers/transactionController.js';

const router = Router();

router.get('/', getTransactions);
router.get('/:id', getTransactionById);
router.post('/issue', issueBook);
router.put('/:id/return', returnBook);

export default router;
