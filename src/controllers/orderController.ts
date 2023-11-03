import { postNewOrder, getOrderList, receiveOrder } from '../services/orderService.js';
import { Request, Response } from 'express';

export const postOrder = (req: Request, res: Response) => {
  try {
    return postNewOrder(req, res);
  } catch (err: any) {
    console.error(err);
    return res.status(400).json({ status: 400, message: err.message });
  }
};

export const getAllOrders = (req: Request, res: Response) => {
  return getOrderList(req, res);
};

export const receiveUsersOrder = (req: Request, res: Response) => {
  return receiveOrder(req, res);
};
