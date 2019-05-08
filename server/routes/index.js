const usersRouter = require('./user');
const authRouter = require('./auth');
const ordersRouter = require('./orders');
const productsRouter = require('./products');

module.exports = (app) => {
  app.use('/api/user', usersRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/products', productsRouter);
  app.use('/api/orders', ordersRouter);
};
