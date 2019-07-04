const usersRouter = require('./user');
const authRouter = require('./auth');
const ordersRouter = require('./orders');
const productsRouter = require('./products');
const promoCodesRouter = require('./promocodes');
const adminsRouter = require('./admin');
const countriesRouter = require('./countries');

module.exports = (app) => {
  app.use('/api/user', usersRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/products', productsRouter);
  app.use('/api/orders', ordersRouter);
  app.use('/api/promocodes', promoCodesRouter);
  app.use('/api/admin', adminsRouter);
  app.use('/api/countries', countriesRouter);
  app.get('*', function(req, res){
    res.redirect('/');
  });
};
