import { Router } from 'express';
import {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
} from '../controllers/bookController';

const router = Router();

router.post('/', createBook); // <-- This is required for POST /api/books
router.get('/', getBooks);
router.get('/:bookId', getBookById);
router.put('/:bookId', updateBook);
router.delete('/:bookId', deleteBook);

export default router;