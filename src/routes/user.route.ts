import express from 'express';
import {
  registerUser,
  loginUser,
  updateUserProfile,
} from '../controllers/user.controller.js';
import {userAuthMiddleware} from '../middleware/user.auth.js';
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/profile', userAuthMiddleware, updateUserProfile);

export default router;
