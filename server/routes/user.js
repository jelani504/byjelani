const express = require('express');

const { User, userHelpers } = require('../database/models/user');

const router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => res.status(200).send({user: req.user}));

router.post('/update', (req, res, next) => {
  // console.log(req.user.email);
  const { email } = req.user;
  const { key, value } = req.body;
  // console.log(email, key, value);
  userHelpers.updateUser(email, key, value).then(user => {
    // console.log(user, 'HERE WE ARE');
    res.status(201).send({user: user});
  }).catch(err => console.log(err));
});

router.post('/register', (req, res, next) => {
  const {
    email,
    password,
    firstName,
    lastName,
    acceptContact,
    title,
    shoppingBag
  } = req.body;
  const user = {
    email,
    password: User.hashPassword(password),
    firstName,
    lastName,
    acceptContact,
    title,
    shoppingBag,
    creation_dt: Date.now(),
  };
  try {
    return res.status(201).json(userHelpers.createUser(user));
  } catch (err) {
    console.log('ERROR CREATING USER');
    return res.status(501).json(err);
  }
});

module.exports = router;
