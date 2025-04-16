const priceDummyData = require('../data/bitcoinData');

const getPrice = (req, res) => {
  res.json(priceDummyData);
}

module.exports = getPrice;