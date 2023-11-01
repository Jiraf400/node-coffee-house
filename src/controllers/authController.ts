import { register, login } from '../services/authentication.js';
import { Request, Response } from 'express';

export const registerUser = (req: Request, res: Response) => {
  try {
    return register(req, res);
  } catch (err: any) {
    console.error(err);
    return res.status(400).json({ status: 400, message: err.message });
  }
};

export const loginUser = (req: Request, res: Response) => {
  try {
    return login(req, res);
  } catch (err: any) {
    console.error(err);
    return res.status(400).json({ status: 400, message: err.message });
  }
};
