import { register, login } from '../services/authentication.js';
import { Request, Response } from 'express';

export const registerUser = (req: Request, res: Response) => {
  return register(req, res);
};

export const loginUser = (req: Request, res: Response) => {
  return login(req, res);
};
