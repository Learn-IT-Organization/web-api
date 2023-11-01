import { Router } from 'express';
import { addUser, getUsers, getUserById } from '../controllers/userController.js';

const router = Router();
router.post('/addUser', addUser);
router.get('/getUsers', getUsers);
router.get('/getUsers/:id', getUserById);

export default router;