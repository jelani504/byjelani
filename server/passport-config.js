const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { userHelpers, User } = require('./database/models/user');

passport.use('local', new LocalStrategy(
//   { usernameField: 'email', passwordField: 'password', passReqToCallback: true }, (email, password, done) => {
//   userHelpers.findOneUser({ email }).then((user) => {
//     if (!user) { return done(null, false); }
//     if (!user.verifyPassword(password)) { return done(null, false); }
//     return done(null, user);
//   }).catch((err) => { console.log(err); done(err); });
// }
  { usernameField: 'email', passwordField: 'password', passReqToCallback: true }, (err, email, password, done) => {
    console.log(email, 'EMAIL!!');
    console.log(password, 'PASSWORD');
    console.log(done, 'DONE!!');
    User.findOne({ email }, (error, user) => {
      if (error) { return done(error); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.isValid(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  },
));


// if (!user) {
//   return done(null, false, { message: 'Incorrect username.' });
// }
// if (!user.isValid(password)) {
//   return done(null, false, { message: 'Incorrect password.' });
// }

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => done(err, user));
});

module.exports = {
  passport,
  setupPassport: (app) => {
    app.use(passport.initialize());
    app.use(passport.session());
  },
};
