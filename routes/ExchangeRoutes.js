const express = require('express');
const getPrice = require('../handlers/PriceHandler');
const router = express.Router();

router.get('/exchange_price', getPrice);

module.exports = router;
