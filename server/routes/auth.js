const express = require('express');
const { passport } = require('../passport-config');


const router = express.Router();


router.post(
  '/login',
  (req, res, next) => {
    console.log(req.body);
    passport.authenticate('local', (err, user, info) => {
      console.log(err, 'ERROR');
      console.log(user, 'USER');
      console.log(info);
      if (err) { return res.status(501).json(err); }
      if (!user) { return res.status(501).json(info); }
      req.logIn(user, (error) => {
        if (error) { return res.status(501).json(err); }
        return res.status(200).json({ message: 'Login Success', user });
      });
    })(req, res, next);
  },
);

router.get(
  '/login/facebook',
  passport.authenticate('facebook', { scope: ['public_profile', 'email', 'user_friends', 'user_gender'] })
);
router.get(
  '/login/facebook/callback', 
  passport.authenticate('facebook', { successRedirect: 'https://localhost:4200/', failureRedirect: 'https://localhost:4200/login' })
);

router.get('/login/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));
router.get('login/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('https://localhost:4200/login');
  }
  );

module.exports = router;