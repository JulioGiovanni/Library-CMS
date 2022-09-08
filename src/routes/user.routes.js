import express from 'express';
import {
  deleteUser,
  enableUser,
  getUsers,
  updateUser,
} from '../controllers/userController.js';

//Create the router
const router = express.Router();
router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.put('/enable-user/:id', enableUser);
export default router;
