import express from 'express';
import {
  borrowBook,
  createBook,
  deleteBook,
  getBook,
  getBooks,
  requestBook,
  updateBook,
} from '../controllers/booksController';

//Create the router
const router = express.Router();

router.get('/books', getBooks);
router.get('/books/:id', getBook);
router.post('/books', createBook);
router.put('/books/:id', updateBook);
router.delete('/books/:id', deleteBook);
router.post('/request-book/:id', requestBook);
router.post('/borrow-book/:id', borrowBook);
router.post('/return-book/:id', requestBook);

export default router;
