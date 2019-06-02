const express = require('express');
const { passport } = require('../passport-config');


const router = express.Router();


router.post(
  '/login',
  passport.authenticate('local', {
  failureRedirect: 'https://localhost:4200/login' }),
  (req, res) => { const {user} =  req; console.log(user, 'LOCAL USERR');
  //  res.send({user});
  // req.logIn(user, (error) => {
    // if (error) { return res.status(501).json(error); }
    // console.log('LOGIN USER');
    return res.status(200).send({user});
    // return res.status(200).json({ message: 'Login Success', user });
  // });
  // res.redirect('https://localhost:4200/', 200);
  }
);

router.get(
  '/login/facebook',
  passport.authenticate('facebook', { scope: ['public_profile', 'email', 'user_friends', 'user_gender'] })
);
router.get(
  '/login/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: 'https://localhost:4200/login' }),
  (req, res) => {
    const {user} = req;
    req.logIn(user, (error) => {
      if (error) { return res.status(501).json(err); }
      return res.redirect('https://localhost:4200/');
    });
  }
);

router.get('/login/google', passport.authenticate('google', { scope: ['profile' , 'email'] }));
router.get('/login/google/callback', 
  passport.authenticate('google', { successRedirect: 'https://localhost:4200/', failureRedirect: 'https://localhost:4200/login' }),
  // (req, res) => {
  //   const {user} = req;
  //   req.logIn(user, (error) => {
  //     console.log(error, 'LOGIN CALLBACK ERROR');
  //     if (error) { return res.redirect('https://localhost:4200/login'); }
  //     return res.redirect('https://localhost:4200/');
  //   });
  // }
  );

module.exports = router;