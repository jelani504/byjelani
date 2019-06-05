const express = require('express');
const request = require("request");
const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');
const sgMail = require('@sendgrid/mail');
let stripe = require('stripe');


require('dotenv').config();
const payPalClient = require('../paypal-config');
const { paypalOrderHelpers, stripeOrderHelpers  } = require('../database/models/order');
const { userHelpers } = require('../database/models/user');
const { productHelpers } = require('../database/models/product');



const { BASIC_AUTH, STRIPEKEY, SG_KEY } = process.env;

stripe = stripe(STRIPEKEY);
sgMail.setApiKey(SG_KEY);

// const { Order, orderHelpers } = require('../database/models/order');
const asyncFN = require('./async');

const router = express.Router();

/* GET users listing. */
// router.get('/', asyncFN(async (req, res, next) => {
//   const orders = await orderHelpers.findAllOrders();
//   // console.log(orders, 'Orderss');
//   res.send({ orders });
// }));

// router.post('/update/:orderID', (req, res, next) => {
// //   console.log(req.user.email);
//   // console.log(email, key, value);
// //   orderHelpers.updateOrder(id, key, value).then(order => {
// //     console.log(order, 'UPDATED ORDER');
// //     res.status(201).send({order});
// //   }).catch(err => console.log(err));
//     res.status(201).send({order: 'ORDER'});

// });

router.post('/create/stripe', async (req, res, next) => {
  console.log('USER ID NEXT');
  console.log(req.user.id);
  const { body, user } = req;
  const {
    amount,
    token,
    shipping
  } = body;
  const { shoppingBag, firstName } = user;
  const items = shoppingBag.reduce((itemsArr, currentItem) => {
    const { productID, version } = currentItem;
    const versionID = version.id;
    const productName = version.name;
    const { img } = version;
    // console.log(currentItem, 'CURRENT ITEM');
    const { selectedSize, quantity, subBrand } = currentItem;
    itemsArr.push({versionID, productName, selectedSize, quantity, subBrand, productID, img });
    return itemsArr;
  }, []);

  // console.log(shipping);
  // console.log(user, 'USER');

  stripe.charges.create({
    amount,
    currency: 'usd',
    source: token.id,
    shipping,
    receipt_email: user.email
  }, async (err, charge) => {
    if (err && err.type === 'StripeCardError') {
      return res.status(400).json({ error: 'CARD DECLINED' });
    }
    if (err) {
      return res.status(400).json({ err });
    }
    const { amount, id, receipt_email, receipt_url, shipping, status } =  charge;
    const newStripeOrder = await stripeOrderHelpers.createStripeOrder({
      amount, chargeID: id, receipt_email, receipt_url, shipping, status, items, userID: user.id
    });
    newStripeOrder.items.forEach( (item) => {
      console.log(item, "ITEM");
      productHelpers.decreaseVersionQuantity(item.productID, item.versionID, item.selectedSize, item.quantity);
    });
    console.log(newStripeOrder);
    await userHelpers.clearBag(user.email);
    const msg = {
      to: user.email,
      from: 'orders@byjelani.com',
      subject: `JELANI Order Confirmation 😎`,
      html: `
        <p>Dear ${firstName}, </p>
        <strong>Thank You for your order!</strong>
        <p>Order Summary</p>
        <p><b>Order ID:</b> ${newStripeOrder.id}</p>
        <p><b></b>Order Total: ${newStripeOrder.amount}</p>
        <img src="https://lh3.googleusercontent.com/OaoOtPADlL3e3zJbNDrWeCMSG5jjNBcVAfcDnEpBa2o8wBAR7p_W7fDjJXo5fAuAEpe9kfeL1EJRhnqJACHxKZeCsNdI5Ri5WTfrH61CtXkp6t1Alumrje_4TZRpztaiJWcKg7Y-NBnyQYxmpBORHlaNjN4CrQXOHYRLPk3dUpuXj8rtpQdfU4KW4WxnqdYzz_i-3nNrM85KPVthGD0jsaKgIlroi2bxhy9OfWWKwF-cFau0nkaOF9eALKuQn5COKnyYpXynRmZ7Qob2i4ZJttzEG9zDQUeRx12z_NbBa4eYqNdPyg1G0iOFTiqpHDa4q7L9ELMOrK0ElIf-vHje30fVMJtnoOXfZBD4QQqoKOVHV5cUu1UYyoRGnoJTSC7rXoKC_tq5iRMPdk4NcOqvvKd0Mj5akkXUtAT5h3utE-i8N-BxjBE8-igBOFhO4Kh9-ykBV-6iMs4LTTcXPxTryLhHdsmNhSUtXHQmBbVT_WueEx2anq9uNhmiADhY9uB-CFm_89ryrFUl2pLkVvPswB_jgsK02RcxV5u4AbqfPiwUh6sdxfQblatmWvboAXTsviYkZDwq7pcOEsXxM-5hi-WQNuJ8pkL3L2i3YvroG5t7SXveH_6wfDYCas6poHjqJM6Na9TRtriQlUYVOJsMCZXtx-U2J4k=w1000-h632-no" height="200" width="316">
      `,
    };
    sgMail.send(msg);
    return res.status(200).send({ newStripeOrder });
  });
  
});

router.post('/create/paypal', async (req, res, next) => {
    console.log('USER ID NEXT');
    console.log(req.user.id);
    // 2a. Get the order ID from the request body
    const { orderID, orderTotal, userBag, email } = req.body;
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
      const { firstName } = req.user;
      const bodyObj = JSON.parse(body);
      const shippingInfo = bodyObj.purchase_units[0].shipping;
      const transactionID = bodyObj.purchase_units[0].payments.captures[0].id;
      const transactionStatus = bodyObj.purchase_units[0].payments.captures[0].status;
      if(transactionStatus === 'COMPLETED'){
        newOrder.status = 'paid';
      }
      newOrder.userID = req.user.id;
      newOrder.shippingInfo = shippingInfo;
      newOrder.transactionID = transactionID;
      newOrder.transactionStatus = transactionStatus;
      newOrder.items = userBag.reduce((itemsArr, currentItem) => {
        const { productID, version} = currentItem;
        const versionID = version.id;
        const productName = version.name;
        const { img } = version;
        // console.log(currentItem, 'CURRENT ITEM');
        const { selectedSize, quantity, subBrand } = currentItem;
        itemsArr.push({versionID, productName, selectedSize, quantity, subBrand, productID, img });
        return itemsArr;
      }, []);

      // 6. Save the transaction in your database with userbag, transaction ID, orderID, order status
      const dborder = await paypalOrderHelpers.createPaypalOrder(newOrder);
      // console.log(dborder, 'NEW ORDERRRR');
      newOrder.items.forEach( (item) => {
        console.log(item, "ITEM");
        productHelpers.decreaseVersionQuantity(item.productID, item.versionID, item.selectedSize, item.quantity);
      });
      await userHelpers.clearBag(email);
      const msg = {
        to: email,
        from: 'orders@byjelani.com',
        subject: `JELANI Order Confirmation (${orderID})`,
        text: 'Thank You for your order. text',
        html: '<strong>Thank You for your order.</strong>',
      };
      sgMail.send(msg);
      // 7. Return a successful response to the client
      return res.status(200).send({success: dborder});
    });

});

module.exports = router;
