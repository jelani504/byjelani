const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const { setupPassport } = require('./passport-config');

const setupRoutes = require('./routes');
const MongoStore = require('connect-mongo')(session);

mongoose.connect('mongodb://jelani504:123dieb4utri@ds211083.mlab.com:11083/byjelani', { useNewUrlParser: true });

const app = express();



// view engine setup
// app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(cors({
  origin: ['https://localhost:4200', 'https://127.0.0.1:4200'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'client')));

app.use(session({
  name: 'myname.sid',
  resave: false,
  saveUninitialized: false,
  secret: 'secret',
  cookie: {
    maxAge: 36000000,
    httpOnly: false,
    secure: false,
  },
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
}));
// passport.serializeUser((user, done) => {
//   console.log(user, 'SERIALIZE');
//   done(null, user._id);
// });

// passport.deserializeUser((id, done) => {
//   console.log(id, 'deSERIALIZE');
//   User.findById(id, (err, user) => done(err, user));
// });
app.use(passport.initialize());
app.use(passport.session());
setupRoutes(app);
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/index.html'));
});


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
  console.log(err, "ERROR");
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
