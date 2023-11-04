import { Request, Response } from 'express';
import { AppDataSource } from '../db/data-source.js';
import { User } from '../models/User.js';
import { Order } from '../models/Order.js';
import { MenuItem } from '../models/Menu-Item.js';
import { Card } from '../models/Card.js';
import { OrderDTO } from '../dto/OrderDTO.js';
import BadRequestError from '../errors/BadRequestError.js';

const dataSource = await AppDataSource.initialize();
const userRepository = dataSource.getRepository(User);
const orderRepository = dataSource.getRepository(Order);
const cardRepository = dataSource.getRepository(Card);
const menuItemsRepository = dataSource.getRepository(MenuItem);

export const postNewOrder = async (req: Request, res: Response) => {
  const { email, menu_item_id } = req.body;

  if (!email || !menu_item_id || !isFinite(menu_item_id) || menu_item_id == 0) {
    throw new BadRequestError({ code: 400, message: 'All fields must be filled!', logging: false });
  }

  console.log(`Email: ${email}`);
  console.log(`Menu_item_id: ${menu_item_id}`);

  const userFromDb = await userRepository.findOneBy({ email: email });
  const menuItemFromDb = await menuItemsRepository.findOneBy({ id: menu_item_id });

  if (!userFromDb || !menuItemFromDb) {
    throw new BadRequestError({ code: 400, message: 'Cannot create order with such parameters.', logging: false });
  }

  const card = await cardRepository.findOneBy({ user: userFromDb });

  console.log(JSON.stringify(userFromDb));
  console.log();

  const order = new Order();
  order.status = 'CREATED';
  order.menu_items = Array.of(menuItemFromDb);
  order.cards = Array.of(card);

  console.log(JSON.stringify(order));

  const createdOrder = await orderRepository.save(order);

  console.log(`Order created with id ${createdOrder.id}`);

  return res.status(201).json({ message: `Order created with id ${createdOrder.id}` });
};

export const receiveOrder = async (req: Request, res: Response) => {
  const { orderId } = req.body;

  if (!orderId || !isFinite(orderId) || orderId == 0) {
    throw new BadRequestError({ code: 400, message: 'Order receiving failed.', logging: false });
  }

  const order = await orderRepository
    .createQueryBuilder('order')
    .where({ id: orderId })
    .leftJoinAndSelect('order.cards', 'cards')
    .getOne();

  const user = await userRepository
    .createQueryBuilder('user')
    .where({ card: order.cards[0] })
    .leftJoinAndSelect('user.card', 'card')
    .getOne();

  if (user !== order.cards[0].user) {
    throw new BadRequestError({ code: 400, message: 'This order is not yours. You cannot take it.', logging: false });
  }

  order.status = 'RECEIVED';
  user.card.balance -= 100;

  await userRepository.save(user);
  await orderRepository.save(order);

  return res.status(200).json({ message: `Order with id ${orderId} received. Thanks` });
};

export const getOrderList = async (req: Request, res: Response) => {
  const { email } = req.body;

  const ordersToReturn = new Array<OrderDTO>();

  const foundUser = await userRepository
    .createQueryBuilder('user')
    .where({ email: email })
    .leftJoinAndSelect('user.card', 'card')
    .getOne();

  if (!foundUser) {
    throw new BadRequestError({ code: 400, message: 'Error getting list.', logging: false });
  }

  const userCard = foundUser.card;

  const allOrders = await orderRepository.find({ relations: ['cards', 'menu_items'] });

  allOrders.forEach((order) => {
    if (order.cards[0].id === userCard.id) {
      const newOrderDto = new OrderDTO();

      newOrderDto.status = order.status;
      newOrderDto.description = order.menu_items[0].description;
      newOrderDto.image = order.menu_items[0].image;

      ordersToReturn.push(newOrderDto);
    }
  });

  return res.status(200).json(ordersToReturn);
};
