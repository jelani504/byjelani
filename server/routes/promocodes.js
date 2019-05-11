const express = require('express');

const { promoCodeHelpers } = require('../database/models/promocode');
const asyncFN = require('./async');

const router = express.Router();

/* GET users listing. */
router.get('/code/:promoCode', async (req, res, next) => {
  const code = await promoCodeHelpers.findOnePromoCode(req.params.promoCode);
  console.log(code);
   res.status(200).send({code});
  });

/* GET users listing. */
router.get('/', asyncFN(async (req, res, next) => {
  const promoCodes = await promoCodeHelpers.findAllPromoCodes();
  // console.log(promoCodes, 'promoCodes');
  res.send({promoCodes});
}));


router.post('/create', async (req, res, next) => {
  //   console.log(req.user.email);
  const { body } = req;
  const newPromoCode = await promoCodeHelpers.createPromoCode(body);
  console.log(newPromoCode);
  res.status(201).send({newPromoCode});
});

router.post('/update', (req, res, next) => {
//   console.log(req.user.email);
  const { key, value, promoCode} = req.body;
  // console.log(promoCode, key, value);
  promoCodeHelpers.updatePromoCode(promoCode, key, value).then(promoCode => {
    // console.log(promoCode, 'PROMO CODE');
    res.status(201).send({promoCode});
  }).catch(err => console.log(err));
});
module.exports = router;
