import { Request, Response, NextFunction } from 'express';
import BadRequestError from '../errors/BadRequestError.js';

export const validateAuthenticationFields = (req: Request, res: Response, next: NextFunction) => {
  if (req.url == '/login') {
    validateLoginFields(req, res, next);
    return;
  }

  const { name, email, password, cardNo, cardCVV } = req.body;

  if (!name || !email || !password || !cardNo || !cardCVV) {
    throw new BadRequestError({ code: 400, message: 'All fields must be filled!', logging: false });
  }

  if (!checkIfEmailIsValid(email)) {
    throw new BadRequestError({ code: 400, message: 'Email is incorrect!', logging: false });
  }

  if (!checkIfCardNumberValid(cardNo)) {
    throw new BadRequestError({ code: 400, message: 'Card number is incorrect!', logging: false });
  }

  if (!checkIfCardCVVValid(cardCVV)) {
    throw new BadRequestError({ code: 400, message: 'Card cvv is incorrect!', logging: false });
  }

  req.body.name = validateName(name);

  console.log(`register fields check  for user: ${email}`);

  next();
};

const validateLoginFields = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!checkIfEmailIsValid(email)) {
    throw new BadRequestError({ code: 400, message: 'Email is incorrect!', logging: false });
  }

  if (!email || !password) {
    throw new BadRequestError({ code: 400, message: 'Email and password are required!', logging: false });
  }

  console.log(`login fields check for user: ${email}`);

  next();
};

const validateName = (username: string) => {
  username = username.trim();

  return username.charAt(0).toUpperCase() + username.slice(1);
};

const checkIfEmailIsValid = (email: string) => {
  const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  return expression.test(email);
};

const checkIfCardNumberValid = (cardNo: string) => {
  if (!cardNo.match(/^[0-9]+$/)) {
    return false;
  }

  return !(cardNo.length < 14 && cardNo.length > 16);
};

const checkIfCardCVVValid = (cardCVV: string) => {
  if (!cardCVV.match(/^[0-9]+$/)) {
    return false;
  }

  return cardCVV.length === 4;
};
