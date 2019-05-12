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

module.exports = router;
