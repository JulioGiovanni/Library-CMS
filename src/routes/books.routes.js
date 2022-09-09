import express from 'express';
import {
  searchBooks,
  createBook,
  getBooks,
  getBook,
  updateBook,
  deleteBook,
  enableBook,
  borrowBook,
  requestBook,
  getRequestedBooks,
  returnBook,
  countBooks,
  countAvailableBooks,
  countBorrowedBooks,
  getBorrowedBooks,
  getBorrowedBooksByUser,
  getAllBooks,
} from '../controllers/booksController.js';
import { upload } from '../utils/multer.js';
//Create the router
const router = express.Router();
router.get('/search-books', searchBooks);
router.get('/books', getBooks);
router.get('/all-books', getAllBooks);
router.get('/count-books', countBooks);
router.get('/books/:id', getBook);
router.post('/books', upload.single('image'), createBook);
router.put('/books/:id', updateBook);
router.put('/enable-books/:id', enableBook);
router.get('/borrowed-books', getBorrowedBooks);
router.get('/borrowed-books/:id', getBorrowedBooksByUser);
router.get('/count-borrowed-books/:id', countBorrowedBooks);
router.get('/count-available-books', countAvailableBooks);
router.post('/return-book/:id', returnBook);
router.get('/requested-books', getRequestedBooks);
router.delete('/books/:id', deleteBook);
router.post('/request-book/:id', requestBook);
router.post('/borrow-book/:id', borrowBook);
router.post('/return-book/:id', requestBook);

export default router;
