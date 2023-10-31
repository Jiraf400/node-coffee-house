import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const access_token_secret: string = process.env.ACCESS_TOKEN_SECRET || '';

export const validateJwtToken = (req: Request, res: Response, next: NextFunction) => {
  console.log('validateJwtToken middleware start');
  const authHeader = req.headers['authorization'];

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'invalid token' }).end();
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, access_token_secret, (err) => {
    if (err) {
      return res.status(401).json({ error: 'invalid token' }).end();
    }
  });

  next();
};
