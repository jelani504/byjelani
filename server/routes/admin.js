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
})

module.exports = router;
