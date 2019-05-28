const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const { User, fbUserHelpers, FBUser } = require('./database/models/user');
require('dotenv').config();
const { FACEBOOK_APP_ID, FACEBOOK_APP_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET} = process.env;

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
  callbackURL: `https://localhost:8000/api/auth/login/facebook/callback`,
  profileFields: ['id', 'displayName', 'email', 'gender', 'first_name', 'last_name']
},
(accessToken, refreshToken, profile, done) => {
  console.log(accessToken, refreshToken, profile);
  console.log('HERE');
  const { email, id, first_name, last_name, gender, name } = profile._json;
  FBUser.findOne({ email }, async (error, user) => {
    if (error) { return done(error); }
    if (!user) {
      try{
        let title;
        if(gender === 'male'){ title = 'Mr.' } else { title = 'Ms.' }
        const newUser = await new FBUser({
          email,
          FBID: id,
          firstName: first_name,
          lastName: last_name,
          displayName: name,
          acceptContact: true,
          title,
          shoppingBag: [],
          addressBook: {
            primaryAddress: {},
            secondaryAddresses: []
          },
          gender,
          creation_dt: Date.now(),
        }).save();
        return done(null, newUser);
      }
      catch(err){
        return done(err);
      }
    }
    console.log('USER FOUND!');
    return done(null, user);
  });
}
));

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:8000/auth/google/callback"
},
function(accessToken, refreshToken, profile, done) {
  console.log(accessToken, refreshToken, profile);
  console.log('HERE');
  // User.findOrCreate(..., function(err, user) {
  //   if (err) { return done(err); }
  //   done(null, user);
  // });
  done(null, profile);
}
));

passport.serializeUser((user, done) => {
  console.log(user, 'SERIALIZE');
  let type;
  if(user.FBID){
    type = 'fb';
  } else {
    type = 'local';
  }
  done(null, { id: user._id, type });
});

passport.deserializeUser((idInfo, done) => {
  console.log(idInfo, 'deSERIALIZE');
  if(idInfo.type === 'fb'){
    FBUser.findById(idInfo.id, (err, user) => {
      done(err, user);
    });
  }
  if(idInfo.type === 'local'){
    User.findById(idInfo.id, (err, user) => done(err, user));
  }
});

module.exports = {
  passport,
  setupPassport: (app) => {
    app.use(passport.initialize());
    app.use(passport.session());
  },
};
