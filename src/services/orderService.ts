import { Request, Response } from 'express';
import { AppDataSource } from '../db/data-source.js';
import { User } from '../models/User.js';
import { Order } from '../models/Order.js';
import { MenuItem } from '../models/Menu-Item.js';
import { Card } from '../models/Card.js';
import { OrderDTO } from '../dto/OrderDTO.js';

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
    return res.status(400).json({ error: 'Order creation failed' }).end();
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

export const receiveOrder = async (req: Request, res: Response) => {
  const { orderId } = req.body;

  if (!orderId || !isFinite(orderId) || orderId == 0) {
    return res.status(400).json({ message: `Sorry. Order receiving failed` }).end();
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

  if (user.card.id !== order.cards[0].id) {
    return res.status(400).json({ message: `Sorry. This order is not yours. You can't take it` }).end();
  }

  order.status = 'RECEIVED';
  user.card.balance -= 100;

  await userRepository.save(user);
  await orderRepository.save(order);

  return res
    .status(200)
    .json({ message: `Order with id ${orderId} received. Thanks` })
    .end();
};

export const getOrderList = async (req: Request, res: Response) => {
  const { email } = req.body;

  const ordersToReturn = new Array<OrderDTO>();

  if (!email) {
    return res.status(401).json({ error: 'Get list failed' }).end();
  }

  const foundUser = await userRepository
    .createQueryBuilder('user')
    .where({ email: email })
    .leftJoinAndSelect('user.card', 'card')
    .getOne();

  const userCard = foundUser.card;

  const allOrders = await orderRepository.find({ relations: ['cards', 'menu_items'] });

  allOrders.forEach((order) => {
    console.log(`order object from forEach loop: ${JSON.stringify(order)}`);

    if (order.cards[0].id === userCard.id) {
      const newOrderDto = new OrderDTO();

      newOrderDto.status = order.status;
      newOrderDto.description = order.menu_items[0].description;
      newOrderDto.image = order.menu_items[0].image;

      ordersToReturn.push(newOrderDto);
    }
  });

  return res.status(200).json(ordersToReturn).end();
};
