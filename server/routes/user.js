const express = require('express');

const { User, userHelpers } = require('../database/models/user');

const router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {console.log(req.user); 
  const { user } = req;
  if (!user){
    return res.status(200).json({ error: 'NO USER'});
  }
  return res.status(200).json({user});
});

router.get('/session', (req, res, next) => {console.log(req.user); 
  const { session } = req;
  console.log(session);
  if (!session){
    return res.status(200).json({ error: 'NO USER SESSION'});
  }
  if(!session.user){
    session.user = { shoppingBag:[], email: '' };
  }
  return res.status(200).json({sessUser: session.user});
});

router.post('/update', (req, res, next) => {
  const { email } = req.user;
  const { key, value, changedValues } = req.body;
  let currentPW;
  if(key && value){
      return userHelpers.updateUser(email, key, value).then(user => {
        return res.status(201).send({user: user});
      }).catch(err => console.log(err));
  };
  changedValues.forEach(
    newPair => {
      if(Object.keys(newPair)[0] === 'currentPassword'){
        currentPW = newPair.currentPassword;
      }
    }
  );

  userHelpers.findOneUser(email).then(user => {
    if(!user.isValid(currentPW)){
      return res.status(401).send({error: 'Incorrect Password'});
    }
    if(changedValues){
      return userHelpers.updateUser(email, null, null, changedValues).then(user => {
        return res.status(201).send({user: user});
      }).catch(err => console.log(err));
    }
  });
});

router.post('/update/guest/bag', async (req, res, next) => {
  const { session, body } = req;
  const { userBag } = body;
  if(session.user){
    session.user.shoppingBag = userBag;
  } else {
    session.user = { shoppingBag: userBag, email: '' };
  }
  const user = session.user;
  console.log(session.user);
  res.status(200).send({user});
});

router.post('/register', async (req, res, next) => {
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
    addressBook: {
      primaryAddress: {},
      secondaryAddresses: []
    },
    password: User.hashPassword(password),
    firstName,
    lastName,
    acceptContact,
    title,
    shoppingBag,
    creation_dt: Date.now(),
  };
  try {
    const newUser = await userHelpers.createUser(user);
    return res.status(201).send({newUser});
  } catch (err) {
    console.log('ERROR CREATING USER');
    return res.status(501).send({err});
  }
});

router.get('/logout', function(req, res){
  console.log(req.user, 'USERR');
  req.logout();
  res.status(200).send({success: 'You have been logged out.'});
});

module.exports = router;
