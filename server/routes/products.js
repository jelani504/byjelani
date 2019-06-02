const express = require('express');

const { productHelpers } = require('../database/models/product');
const asyncFN = require('./async');

const router = express.Router();

/* GET users listing. */
router.get('/:productID', (req, res, next) => {console.log(req); res.send({req});});

/* GET users listing. */
router.get('/', asyncFN(async (req, res, next) => {
  const products = await productHelpers.findAllProducts();
  // console.log(products, 'Products');
  res.json({products});
}));

router.post('/update', (req, res, next) => {
//   console.log(req.user.email);
  const { key, value, id} = req.body;
  // console.log(email, key, value);
  productHelpers.updateProduct(id, key, value).then(product => {
    // console.log(product, 'HERE WE ARE');
    res.status(201).send({product});
  }).catch(err => console.log(err));
});

router.post('/update/:productID', (req, res, next) => {
  // console.log(req);
  return res.status(201).json({req});
});

module.exports = router;
