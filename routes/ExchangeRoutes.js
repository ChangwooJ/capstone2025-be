const express = require('express');
const getPrice = require('../handlers/PriceHandler');
const getBTCChart = require('../handlers/ExchangeHandler');
const router = express.Router();

router.get('/exchange_price', getPrice);
router.get('/exchangePrice', getBTCChart);

module.exports = router;
