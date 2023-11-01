import { Router } from 'express';
import { addUser, getAllUsers, getUserById } from '../controllers/userController.js';

const router = Router();

router.post('/users', addUser);
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);

export default router;