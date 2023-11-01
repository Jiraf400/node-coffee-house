import { Request, Response, NextFunction } from 'express';

export const validateAuthenticationFields = (req: Request, res: Response, next: NextFunction) => {
  if (req.url == '/login') {
    validateLoginFields(req, res, next);
    return;
  }

  const { name, email, password, cardNo, cardCVV } = req.body;

  if (!name || !email || !password || !cardNo || !cardCVV) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  if (!checkIfEmailIsValid(email)) {
    return res.status(400).json({ error: 'email is incorrect.' });
  }

  if (!checkIfCardNumberValid(cardNo)) {
    return res.status(400).json({ error: 'card number is incorrect.' });
  }

  if (!checkIfCardCVVValid(cardCVV)) {
    return res.status(400).json({ error: 'card cvv is incorrect.' });
  }

  req.body.name = validateName(name);

  console.log(`register fields are valid for user: ${email}`);

  next();
};

const validateLoginFields = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  console.log(`login fields are valid for user: ${req.body.email}`);

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
