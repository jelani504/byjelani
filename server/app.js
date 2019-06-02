const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const { passport } = require('./passport-config');
const helmet = require('helmet');
const { User } = require('./database/models/user');


const setupRoutes = require('./routes');
const MongoStore = require('connect-mongo')(session);

mongoose.connect('mongodb://jelani504:123dieb4utri@ds211083.mlab.com:11083/byjelani', { useNewUrlParser: true });

const app = express();

// view engine setup
// app.set('view engine', 'hbs');

app.use(cors({
  origin: ['https://localhost:4200', 'https://127.0.0.1:4200'],
  credentials: true,
}));
// app.use(express.static(path.join(__dirname, 'client')));
app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(helmet())
app.use(cookieParser('sup3rs3cr3t'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  name: 'J3LVNI',
  resave: false,
  saveUninitialized: false,
  secret: 'sup3rs3cr3t',
  cookie: {
    maxAge: 36000000,
    httpOnly: false,
    secure: true,
  },
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
}));

app.use(passport.initialize());
app.use(passport.session());
setupRoutes(app);


// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'client/index.html'));
// });

// setupPassport(app);


// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(req.user, 'USER');
  console.log(err.message, "ERROR!");
  
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
