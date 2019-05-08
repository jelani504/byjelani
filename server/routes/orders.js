const express = require('express');
const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');
const payPalClient = require('../paypal-config');

// const { Order, orderHelpers } = require('../database/models/order');
const asyncFN = require('./async');

const router = express.Router();

/* GET users listing. */
router.get('/', asyncFN(async (req, res, next) => {
//   const orders = await orderHelpers.findAllOrders();
  console.log(orders, 'Orderss');
  res.send({orders: 'orders'});
}));

router.post('/update/:orderID', (req, res, next) => {
//   console.log(req.user.email);
  // console.log(email, key, value);
//   orderHelpers.updateOrder(id, key, value).then(order => {
//     console.log(order, 'UPDATED ORDER');
//     res.status(201).send({order});
//   }).catch(err => console.log(err));
    res.status(201).send({order: 'ORDER'});

});

router.post('/create', async (req, res, next) => {
  console.log(req.body);
    // 2a. Get the order ID from the request body
    const orderID = req.body.orderID;

    // 3. Call PayPal to get the transaction details
    let request = new checkoutNodeJssdk.orders.OrdersGetRequest(orderID);
  
    let order;
    try {
      order = await payPalClient.client().execute(request);
    } catch (err) {
  
      // 4. Handle any errors from the call
      console.error(err);
      return res.sendStatus(500);
    }
  
    // 5. Validate the transaction details are as expected
    // if (order.result.purchase_units[0].amount.value !== '220.00') {
    //   return res.sendStatus(400);
    // }
  
    // 6. Save the transaction in your database
    // await database.saveTransaction(orderID);
  
    // 7. Return a successful response to the client
    return res.status(200).send({success: 'success'});
});

module.exports = router;
