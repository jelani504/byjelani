const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const { User } = require('./database/models/user');
require('dotenv').config();
const { FACEBOOK_APP_ID, FACEBOOK_APP_SECRET} = process.env;


passport.use('local', new LocalStrategy(
  { usernameField: 'email', passwordField: 'password', passReqToCallback: true },
  (err, email, password, done) => {
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

passport.use(new FacebookStrategy({
  clientID: FACEBOOK_APP_ID,
  clientSecret: FACEBOOK_APP_SECRET,
  callbackURL: "localhost:3000/auth/login/fb"
},
function(accessToken, refreshToken, profile, done) {
  console.log(accessToken, refreshToken, profile);
  // User.findOrCreate(..., function(err, user) {
  //   if (err) { return done(err); }
  //   done(null, user);
  // });
}
));

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
