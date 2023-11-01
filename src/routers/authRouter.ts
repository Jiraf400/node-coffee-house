import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import { validateAuthenticationFields } from '../middlewares/authFieldsValidation.js';

export const authRouter = Router();

authRouter.post('/register', validateAuthenticationFields, registerUser);
authRouter.post('/login', validateAuthenticationFields, loginUser);
