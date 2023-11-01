import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { AppDataSource } from '../db/data-source.js';
import { User } from '../models/User.js';
import { Card } from '../models/Card.js';

const dataSource = await AppDataSource.initialize();
const userRepository = dataSource.getRepository(User);

dotenv.config();

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { name, email, password, cardNo, cardCVV } = req.body;

    const duplicate = await userRepository.findOneBy({ email });

    if (duplicate) return res.status(409).json({ message: 'User already exists.' });

    const hashedPwd = await bcrypt.hash(password, 10);

    const userToCreate = new User();
    userToCreate.name = name;
    userToCreate.password = hashedPwd;
    userToCreate.email = email;

    const cardToCreate = new Card();
    cardToCreate.CVV = cardCVV;
    cardToCreate.cardNumber = cardNo;
    cardToCreate.balance = 10000;
    cardToCreate.user = userToCreate;

    userToCreate.card = cardToCreate;

    const createdUser = await userRepository.save(userToCreate);

    console.log(createdUser);

    return res.status(201).json({ success: `New user ${createdUser.name} with id ${createdUser.id} created!` });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: 'Register error' });
  }
};

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    const foundUser = await userRepository.findOneBy({ email });

    if (!foundUser) {
      return res.status(403).json({ error: `User not exists with email ${email}` });
    }

    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
      const accessToken = generateAccessToken(foundUser.id, foundUser.email);

      res.json({ access_token: accessToken });
    }
  } catch (error) {
    console.log(error);
    return res.status(400);
  }
};

const generateAccessToken = (id: number, email: string) => {
  const access_token_secret: string = process.env.ACCESS_TOKEN_SECRET || '';

  const payload = {
    id,
    email,
  };
  return jwt.sign(payload, access_token_secret, { expiresIn: '12h' });
};
