import { Request, Response } from 'express';
import { AppDataSource } from '../db/data-source.js';
import { User } from '../models/User.js';
import { Order } from '../models/Order.js';
import { MenuItem } from '../models/Menu-Item.js';
import { Card } from '../models/Card.js';

const dataSource = await AppDataSource.initialize();
const userRepository = dataSource.getRepository(User);
const orderRepository = dataSource.getRepository(Order);
const cardRepository = dataSource.getRepository(Card);
const menuItemsRepository = dataSource.getRepository(MenuItem);

export const postNewOrder = async (req: Request, res: Response) => {
  const { email, menu_item_id } = req.body;

  if (!isFinite(menu_item_id)) {
    return res.status(400).json({ error: 'Incorrect menu item id' });
  }

  console.log(`Email: ${email}`);
  console.log(`Menu_item_id: ${menu_item_id}`);

  const userFromDb = await userRepository.findOneBy({ email: email });
  const menuItemFromDb = await menuItemsRepository.findOneBy({ id: menu_item_id });
  let card = new Card();

  if (!userFromDb || !email || !menuItemFromDb) {
    return res.status(400).json({ error: 'Order creation failed' });
  } else {
    card = await cardRepository.findOneBy({ user: userFromDb });
  }

  console.log(JSON.stringify(userFromDb));
  console.log();

  const order = new Order();
  order.status = 'CREATED';
  order.menu_items = Array.of(menuItemFromDb);
  order.cards = Array.of(card);

  console.log(JSON.stringify(order));

  const createdOrder = await orderRepository.save(order);

  console.log(`Order created with id ${createdOrder.id}`);

  return res
    .status(201)
    .json({ message: `Order created with id ${createdOrder.id}` })
    .end();
};

export const deleteExistingOrder = (req: Request, res: Response) => {
  //
};

export const updateExistingOrder = (req: Request, res: Response) => {
  //
};

export const getOrderList = (req: Request, res: Response) => {
  //
};
