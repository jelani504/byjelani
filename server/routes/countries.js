const express = require('express');


const router = express.Router();


const countries = require('../database/countries.json');

router.get('/', (req, res, next) => {
    res.status(200).send({countries})
});


module.exports = router;