import express from 'express';
import {
  deleteUser,
  updateUser,
} from '../controllers/userController';

//Create the router
const router = express.Router();

router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export default router;
