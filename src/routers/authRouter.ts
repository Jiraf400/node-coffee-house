import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import { validateRegisterFields } from '../middlewares/registerFieldsValidation.js';

export const authRouter = Router();

authRouter.post('/register', validateRegisterFields, registerUser);
authRouter.post('/login', loginUser);
