const express = require('express');
const getPrice = require('../handlers/PriceHandler');
const getBTCChart = require('../handlers/ExchangeHandler');
const orderUpbit = require('../handlers/TransactionHandler');
const router = express.Router();

router.get('/exchange_price', getPrice);
router.get('/exchangePrice', getBTCChart);
router.post('/order', orderUpbit);

module.exports = router;
