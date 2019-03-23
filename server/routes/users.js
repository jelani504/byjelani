const express = require('express');

const { User, userHelpers } = require('../database/models/user');

const router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

router.post('/register', (req, res, next) => {
  const {
    email,
    password,
    firstName,
    lastName,
    acceptContact,
    title,
  } = req.body;
  const user = {
    email,
    password: User.hashPassword(password),
    firstName,
    lastName,
    acceptContact,
    title,
    creation_dt: Date.now(),
  };
  try {
    return res.status(201).json(userHelpers.createUser(user));
  } catch (err) {
    return res.status(501).json(err);
  }
});

module.exports = router;
