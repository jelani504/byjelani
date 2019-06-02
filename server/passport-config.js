const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const { User } = require('./database/models/user');
require('dotenv').config();
const { FACEBOOK_APP_ID, FACEBOOK_APP_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET} = process.env;

passport.serializeUser((user, done) => {
  let type;
  let id;
  if(user.facebookID){
    type = 'fb';
    id = user.facebookID;
  } else if (user.googleID){
    type = 'gg'
    id = user.googleID;
  } else {
    type = 'local';
    id = user._id;
  }
  done(null, { id , type });
});

passport.deserializeUser((idInfo, done) => {
  console.log(idInfo, 'deSERIALIZE');
  if(idInfo.type === 'fb'){
    console.log(idInfo.id)
    User.findOne({facebookID: idInfo.id}, (err, user) => done(err, user));
  } 
  if (idInfo.type === 'gg'){
    User.findOne({googleID: idInfo.id}, (err, user) => done(err, user));
  }
  if(idInfo.type === 'local'){
    User.findById(idInfo.id, (err, user) => {console.log(user, 'DE LOCAL USER'); done(err, user)});
  }
});

passport.use('local', new LocalStrategy(
  { usernameField: 'email', passwordField: 'password', passReqToCallback: true },
  (err, email, password, done) => {
    console.log(email, 'EMAIL');
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
  User.findOne({ email }, async (error, user) => {
    console.log(error, 'ERROR FINDING USER');
    if (error) { return done(error); }
    if (!user) {
      try{
        let title;
        if(gender === 'male'){ title = 'Mr.' } else { title = 'Ms.' }
        const newUser = await new User({
          email,
          facebookID: id,
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
    console.log(user, 'USER FOUND!');
    return done(null, user);
  });
}
));

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "https://localhost:8000/api/auth/login/google/callback"
},
(accessToken, refreshToken, profile, done) => {
  console.log('HERE, GOOGLE STRAT CALLBACK');
  console.log(accessToken, refreshToken, profile);
  // User.findOrCreate(..., function(err, user) {
  //   if (err) { return done(err); }
  //   done(null, user);
  // });
  const { email, sub, given_name, family_name, gender, name } = profile._json;
  User.findOne({ email }, async (error, user) => {
    if (error) { return done(error); }
    if (!user) {
      try{
        let title;
        if(gender === 'male'){ title = 'Mr.' } else if (gender === 'female'){ title = 'Ms.' }
        const newUser = await new User({
          email,
          googleID: sub,
          firstName: given_name,
          lastName: family_name,
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
        console.log(newUser, 'NEW GOOGLE USER');
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

module.exports = {
  passport
};
