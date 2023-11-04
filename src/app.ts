import express, { Express } from 'express';
import { authRouter } from './routers/authRouter.js';
import { orderRouter } from './routers/orderRouter.js';
import { validateAuthenticationFields } from './middlewares/authFieldsValidation.js';
import { validateJwtToken } from './middlewares/jwtTokenValidation.js';
import { errorHandler } from './middlewares/errors.js';
import 'express-async-errors';

const app: Express = express();
const port = 5000;

app.use(express.json());

app.use('/auth', validateAuthenticationFields, authRouter);
app.use('/orders', validateJwtToken, orderRouter);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
