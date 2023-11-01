import express, { Express } from 'express';
import { authRouter } from './routers/authRouter.js';
import { orderRouter } from './routers/orderRouter.js';

const app: Express = express();
const port = 5000;

app.use(express.json());

app.use('/auth', authRouter);
app.use('/orders', orderRouter);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
