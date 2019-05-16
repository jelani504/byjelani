const express = require('express');

const { paypalOrderHelpers } = require('../database/models/order');

const router = express.Router();
// require('dotenv').config();

router.use(function (req, res, next) {
    if(req.user.id === process.env.ADMIN_JELANI){
        next();
    } else {
        res.status(400).send({adminStatus: false})
        next();
    }
})

router.get('/', (req, res, next) => {
    res.status(200).send({adminStatus: true})
});

router.get('/orders', async (req, res, next) => {
    const paypalOrders = await paypalOrderHelpers.findAllPaypalOrders();
    // console.log(paypalOrders, 'PAYPAL ORDERS');
    res.status(200).send({ paypalOrders })
});

router.post('/orders/update', async (req, res, next) => {
    const {orderID, status } = req.body;
    const paypalOrder = await paypalOrderHelpers.findOnePaypalOrder(orderID);
    // console.log(paypalOrders, 'PAYPAL ORDERS');
    paypalOrder.status = status;
    const updatedOrder = await paypalOrder.save();
    res.status(200).send({ updatedOrder })
})

module.exports = router;
