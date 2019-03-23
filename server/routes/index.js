const usersRouter = require('./users');
const authRouter = require('./auth');
const logoutRouter = require('./logout');

module.exports = (app) => {
  app.use('/api/users', usersRouter);
  app.use('/api/auth', authRouter);
  // app.use('/api/logout', logoutRouter);
};
