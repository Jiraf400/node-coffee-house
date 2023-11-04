import { Router } from 'express';
import { postOrder, getAllOrders, receiveUsersOrder } from '../controllers/orderController.js';

export const orderRouter = Router();

orderRouter.post('/create', postOrder);
orderRouter.get('/list', getAllOrders);
orderRouter.patch('/receive', receiveUsersOrder);
