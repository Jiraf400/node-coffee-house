import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import BadRequestError from '../errors/BadRequestError.js';

const access_token_secret: string = process.env.ACCESS_TOKEN_SECRET || '';

export const validateJwtToken = (req: Request, res: Response, next: NextFunction) => {
  console.log('validateJwtToken middleware start');
  const authHeader = req.headers['authorization'];

  if (!authHeader?.startsWith('Bearer ')) {
    throw new BadRequestError({ code: 401, message: 'Invalid token sent.', logging: false });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, access_token_secret, (err) => {
    if (err) {
      throw new BadRequestError({ code: 401, message: 'Invalid token sent.', logging: false });
    }

    req.body.email = parseJwt(token).email;
  });

  next();
};

function parseJwt(token: string) {
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}
