const express = require('express');
const request = require("request");
const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');
const sgMail = require('@sendgrid/mail');
let stripe = require('stripe');


require('dotenv').config();
const payPalClient = require('../paypal-config');
const { orderHelpers  } = require('../database/models/order');
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

function htmlItems(items){
  let itemHTML = '<h3 style="margin-bottom: 5%; margin-top: 0px;"><b>ITEMS</b></h3>\n';
  items.forEach(item => {
    itemHTML += `
    <div style="margin-bottom: 7.5%;">
      <div style="display: flex;">
        <div style="flex: 50%; justify-content: center;">
        <img style="outline:none;text-decoration:none;display:inline-block; border:0 none; max-width: 237px;" src="${item.img}">
        </div>
        <div style="flex: 50%; margin-left: 5%;">
          <p style="margin-bottom: 0px;"><b>${item.productName}</b></p>
          <p style="margin-bottom: 5px;">
            ${item.color}<br>US ${item.selectedSize}<br>${item.price.usd.string}
          </p>
        </div> 
      </div> 
    </div>\n
    `
  });
  return itemHTML;
}

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
    const { img, color, price } = version;
    // console.log(currentItem, 'CURRENT ITEM');
    const { selectedSize, quantity, subBrand } = currentItem;
    itemsArr.push({versionID, productName, selectedSize, quantity, subBrand, productID, img, price, color });
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
    console.log(shipping, 'SHIPPING');
    const orderDate  = new Date();
    const newOrder = await orderHelpers.createOrder({
      orderTotal: amount,
      status,
      items,
      orderDate,
      userID: user.id,
      stripeDetails: {
        chargeID: id,
        receipt_email,
        receipt_url
      }
    });
    newOrder.items.forEach( (item) => {
      console.log(item, "ITEM");
      productHelpers.decreaseVersionQuantity(item.productID, item.versionID, item.selectedSize, item.quantity);
    });
    console.log(newOrder);
    await userHelpers.clearBag(user.email);
    const msg = {
      to: user.email,
      from: 'orders@byjelani.com',
      subject: `JELANI Order Confirmation 😎`,
      html: `
<div style="margin: 5%">
  <img href="https://localhost:4200" style="max-height: 50px;" src="https://lh3.googleusercontent.com/uM4tqk5l5e7tbBduMDn6vx-Tumoak62UqOtIMNsybHkNY7_lHhUJzQQz1t2SAYOvKzWW-GpvONuibQTdxxXT_LasS_l1kNyJ26TM8anv5NaRCJENfABO25Oy8FfMp8FewZ8TBNiOLNFRLyWWr2rNH3YFPzzQy2dwRgPP_9GGOvsDLjKSSnQGf9eymTqS3I-Ddn5yfpXrkqjgeby916xoPdCBO23HkXCfVyh6z4iAQQVbWPKv2tv4O9kA3id3AzixhhbmaJ1o5LgZxagXKU9HQ-WiqcFZgZ5Xfjwu7B4dADZMVrAc7TYYB5PR58wPDfvm_TRAzluPYG0cepc6jLMsHnOnWXLHSJD737tAvWQv_yqbOEDZkauxLddcK1RTESVLpNlfJLOhJ2vEaTTIY69y1ALcp0Uni8_dENaNRHoGa3Jv8j3ZhwUO0erC0jfkUzLLfrJzBNHaxf4V3bdMzewpCjq_HcN-UG9vrhz6AQrXf2pzgs1EYm-STqEEmUaUV3nm2dHM9hlXcI0ixM3JBGCxN2iG6eSBG_KbysHzpRHAhXhdFIDeV4pRNbcwmbJNOjC6VzZA8kzlTgOY8HLZEvYseA8_j0Lo7vtZv5N0SxfLsy3VSiI6Zik_aRleUAPXw58ushyv12EBHtU6QbjjeHTrJKo7gJgCN8M=w1102-h417-no">
  <hr>
  <p>Dear ${firstName}, </p>
  <strong>Thank You for your order!</strong>
  <p>Please allow up to two business days to process your order. Once it’s been processed, you’ll receive a shipment confirmation email with your order’s tracking number.</p>
  <p>Below, you’ll find a copy of your receipt and order information. Please keep it for your records.</p>
  <p>Questions? Please reply to this email with any questions or concerns. </p>
  <div style="display: flex; margin-top: 50px;">
    <div style="float: left; width: 50%;">
      ${htmlItems(newOrder.items)}
    </div>
    <div style="float: left; width: 50%;">
      <p style="margin-right: 5%;"><b>ORDER ID:</b> ${newOrder.id}</p>
      <p style="margin-right: 5%;">
        <b>DATE PLACED:</b> ${orderDate.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </p>
      <p style="margin-right: 5%; margin-top: 0px;"><b>ORDER TOTAL:</b> $${newOrder.orderTotal/100}</p>
      <p style="margin-right: 5%;"><b>PAYMENT METHOD:</b> CREDIT CARD</p>
      <h4 style="margin-bottom: 0px;"><b>SHIPPING ADDRESS:</b></h4>
      <p style="margin-right: 5%; margin-top: 5px;">
        ${shipping.name}
        <br>
        ${shipping.address.line1}
        <br>
        ${shipping.address.city}, ${shipping.address.state}
        <br>
        ${shipping.address.country} ${shipping.address.postal_code}
        <br>
        ${shipping.phone}
      </p>
    </div>
  </div>
  <div style="background-color:black; height:50px; margin-top:20px;"></div>
</div>
    `,
    };
    console.log(msg);
    sgMail.send(msg);
    return res.status(200).send({ newOrder });
  });
  
});

router.post('/create/paypal', async (req, res, next) => {
    const orderDate = new Date();
    console.log('USER ID NEXT');
    // 2a. Get the order ID from the request body
    const { orderID, orderTotal, userBag, email, details } = req.body;
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
      const firstName = details.payer.name.given_name;
      const bodyObj = JSON.parse(body);
      console.log(bodyObj.payer.name.given_name, 'BODY');
      console.log(details.payer.name.given_name, 'DETAILS');
      const shippingInfo = bodyObj.purchase_units[0].shipping;
      const transactionID = bodyObj.purchase_units[0].payments.captures[0].id;
      const transactionStatus = bodyObj.purchase_units[0].payments.captures[0].status;
      const newOrder = { 
        orderID,
        orderTotal,
        orderDate,
        shippingInfo,
        transactionID,
        transactionStatus,
        items: userBag.reduce((itemsArr, currentItem) => {
          const { productID, version} = currentItem;
          const versionID = version.id;
          const productName = version.name;
          const { img, color, price } = version;
          // console.log(currentItem, 'CURRENT ITEM');
          const { selectedSize, quantity, subBrand } = currentItem;
          itemsArr.push({versionID, productName, selectedSize, quantity, subBrand, productID, img, color, price });
          return itemsArr;
        }, [])
      };
      if(transactionStatus === 'COMPLETED'){
        newOrder.status = 'paid';
      }
      if(req.user){
        newOrder.userID = req.user.id;
      }
      
      // 6. Save the transaction in your database with userbag, transaction ID, orderID, order status
      const dborder = await orderHelpers.createOrder(newOrder);
      // console.log(dborder, 'NEW ORDERRRR');
      newOrder.items.forEach(item => productHelpers.decreaseVersionQuantity(item.productID, item.versionID, item.selectedSize, item.quantity));
      await userHelpers.clearBag(email);
      const msg = {
        to: 'jhankins02@gmail.com',
        from: 'orders@byjelani.com',
        subject: `JELANI Order Confirmation (${orderID})`,
        html: `
        <div style="margin: 5%">
  <img href="https://localhost:4200" style="max-height: 50px;" src="https://lh3.googleusercontent.com/uM4tqk5l5e7tbBduMDn6vx-Tumoak62UqOtIMNsybHkNY7_lHhUJzQQz1t2SAYOvKzWW-GpvONuibQTdxxXT_LasS_l1kNyJ26TM8anv5NaRCJENfABO25Oy8FfMp8FewZ8TBNiOLNFRLyWWr2rNH3YFPzzQy2dwRgPP_9GGOvsDLjKSSnQGf9eymTqS3I-Ddn5yfpXrkqjgeby916xoPdCBO23HkXCfVyh6z4iAQQVbWPKv2tv4O9kA3id3AzixhhbmaJ1o5LgZxagXKU9HQ-WiqcFZgZ5Xfjwu7B4dADZMVrAc7TYYB5PR58wPDfvm_TRAzluPYG0cepc6jLMsHnOnWXLHSJD737tAvWQv_yqbOEDZkauxLddcK1RTESVLpNlfJLOhJ2vEaTTIY69y1ALcp0Uni8_dENaNRHoGa3Jv8j3ZhwUO0erC0jfkUzLLfrJzBNHaxf4V3bdMzewpCjq_HcN-UG9vrhz6AQrXf2pzgs1EYm-STqEEmUaUV3nm2dHM9hlXcI0ixM3JBGCxN2iG6eSBG_KbysHzpRHAhXhdFIDeV4pRNbcwmbJNOjC6VzZA8kzlTgOY8HLZEvYseA8_j0Lo7vtZv5N0SxfLsy3VSiI6Zik_aRleUAPXw58ushyv12EBHtU6QbjjeHTrJKo7gJgCN8M=w1102-h417-no">
  <hr>
  <p>Dear ${firstName}, </p>
  <strong>Thank You for your order!</strong>
  <p>Please allow up to two business days to process your order. Once it’s been processed, you’ll receive a shipment confirmation email with your order’s tracking number.</p>
  <p>Below, you’ll find a copy of your receipt and order information. Please keep it for your records.</p>
  <p>Questions? Please reply to this email with any questions or concerns. </p>
  <div style="display: flex; margin-top: 50px;">
    <div style="float: left; width: 50%;">
      ${htmlItems(newOrder.items)}
    </div>
    <div style="float: left; width: 50%;">
      <p style="margin-right: 5%;"><b>ORDER ID:</b> ${orderID}</p>
      <p style="margin-right: 5%;">
        <b>DATE PLACED:</b> ${orderDate.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </p>
      <p style="margin-right: 5%; margin-top: 0px;"><b>ORDER TOTAL:</b> $${newOrder.orderTotal}</p>
      <p style="margin-right: 5%;"><b>PAYMENT METHOD:</b> CREDIT CARD</p>
      <h4 style="margin-bottom: 0px;"><b>SHIPPING ADDRESS:</b></h4>
      <p style="margin-right: 5%; margin-top: 5px;">
        ${shippingInfo.name.full_name}
        <br>
        ${shippingInfo.address.address_line_1}
        <br>
        ${function(){ if(shippingInfo.address.address_line_2){ return `${shippingInfo.address.address_line_2} <br>`} return '';}()}
        ${shippingInfo.address.admin_area_2}, ${shippingInfo.address.admin_area_1}
        <br>
        ${shippingInfo.address.country_code} ${shippingInfo.address.postal_code}
        <br>
      </p>
    </div>
  </div>
  <div style="background-color:black; height:50px; margin-top:20px;"></div>
</div>`,
      };
      sgMail.send(msg);
      // 7. Return a successful response to the client
      return res.status(200).send({success: dborder});
    });

});

module.exports = router;
