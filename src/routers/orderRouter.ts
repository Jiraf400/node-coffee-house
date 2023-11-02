import { Router } from 'express';
import { validateJwtToken } from '../middlewares/jwtTokenValidation.js';
import { postOrder, updateOrder, deleteOrder, getAllOrders } from '../controllers/orderController.js';

export const orderRouter = Router();

orderRouter.post('/postOrder', validateJwtToken, postOrder);
