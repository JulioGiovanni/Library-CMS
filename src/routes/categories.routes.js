import express from 'express';
import {
  disableCategory,
  getCategories,
  enableCategory,
  countCategories,
  updateCategory,
} from '../controllers/categoriesController.js';

//Create the router
const router = express.Router();

router.get('/categories', getCategories);
router.delete('/categories/:id', disableCategory);
router.put('/categories/:id', updateCategory);
router.post('/enable-category/:id', enableCategory);
router.get('/count-categories', countCategories);

export default router;
