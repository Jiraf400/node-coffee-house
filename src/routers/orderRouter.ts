import { Router } from 'express';
import { validateJwtToken } from '../middlewares/jwtTokenValidation.js';
import { postOrder, getAllOrders, receiveUsersOrder } from '../controllers/orderController.js';

export const orderRouter = Router();

orderRouter.post('/create', validateJwtToken, postOrder);
orderRouter.get('/list', validateJwtToken, getAllOrders);
orderRouter.patch('/receive', validateJwtToken, receiveUsersOrder);
