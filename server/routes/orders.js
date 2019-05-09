const express = require('express');
const request = require("request");
const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');

require('dotenv').config();
const payPalClient = require('../paypal-config');
const { paypalOrderHelpers } = require('../database/models/order');
const { userHelpers } = require('../database/models/user');


const { BASIC_AUTH } = process.env;
// const { Order, orderHelpers } = require('../database/models/order');
const asyncFN = require('./async');

const router = express.Router();

/* GET users listing. */
router.get('/', asyncFN(async (req, res, next) => {
//   const orders = await orderHelpers.findAllOrders();
  // console.log(orders, 'Orderss');
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
    // 2a. Get the order ID from the request body
    const { orderID, orderTotal, userBag, email } = req.body;
    console.log(email, 'EMAIL');
    const newOrder = { orderID, orderTotal };
    const orderTotalStr = orderTotal.toString();
    // 3. Call PayPal to get the transaction details
    let payPalrequest = new checkoutNodeJssdk.orders.OrdersGetRequest(orderID);
  
    let order;
    try {
      order = await payPalClient.client().execute(payPalrequest);
    } catch (err) {
  
      // 4. Handle any errors from the call
      console.error(err);
      return res.sendStatus(500);
    }
  
    // 5. Validate the transaction details are as expected
    if (order.result.purchase_units[0].amount.value !== `${orderTotalStr}.00`) {
      console.log(`${orderTotalStr}.00`, order.result.purchase_units[0].amount.value);
      return res.sendStatus(400);
    }

    let options = { 
      method: 'GET',
      url: `https://api.sandbox.paypal.com/v2/checkout/orders/${orderID}`,
      headers: 
       { 'Postman-Token': 'c4b958dc-8f51-4d2f-921e-bff66bc192de',
         'cache-control': 'no-cache',
         Authorization: `Basic ${BASIC_AUTH}`,
         'Content-Type': 'application/json' 
        }
    };
    
    request(options, async (error, response, body) => {
      if (error) throw new Error(error);
      
      const bodyObj = JSON.parse(body);
      const shippingInfo = bodyObj.purchase_units[0].shipping;
      const transactionID = bodyObj.purchase_units[0].payments.captures[0].id;
      const transactionStatus = bodyObj.purchase_units[0].payments.captures[0].status;
      if(transactionStatus === 'COMPLETED'){
        newOrder.status = 'paid';
      }
      newOrder.shippingInfo = shippingInfo;
      newOrder.transactionID = transactionID;
      newOrder.transactionStatus = transactionStatus;
      newOrder.items = userBag.reduce((itemsArr, currentItem) => {
        const versionID = currentItem.product.id;
        const productName = currentItem.product.name
        const { selectedSize, quantity, subBrand } = currentItem;
        itemsArr.push({versionID, productName, selectedSize, quantity, subBrand});
        return itemsArr;
      }, []);

      // 6. Save the transaction in your database with userbag, transaction ID, orderID, order status
      const dborder = await paypalOrderHelpers.createPaypalOrder(newOrder);
      // console.log(dborder, 'NEW ORDERRRR');
      await userHelpers.clearBag(email);
      // 7. Return a successful response to the client
      return res.status(200).send({success: dborder});
    });
    
  
});

module.exports = router;
