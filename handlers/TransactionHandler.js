const axios = require('axios');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const querystring = require('querystring');

const orderUpbit = async (req, res) => {
  const { market, side, volume, price, ord_type } = req.body;
  const access_key = process.env.UPBIT_OPEN_API_ACCESS_KEY;
  const secret_key = process.env.UPBIT_OPEN_API_SECRET_KEY;
  const server_url = "https://api.upbit.com";

  if (!market || !side || !ord_type) {
    throw new Error("필수 파라미터 누락");
  }

  const params = {
    market,
    side,
    volume: volume?.toString(),
    price: price?.toString(),
    ord_type,
  };
  
  if (ord_type === 'price') delete params.volume;
  if (ord_type === 'market') delete params.price;
  
  const query = querystring.stringify(params);
  const queryHash = require("crypto")
    .createHash("sha512")
    .update(query, "utf-8")
    .digest("hex");

  const payload = {
    access_key,
    nonce: uuid.v4(),
    query_hash: queryHash,
    query_hash_alg: "SHA512",
  };

  const token = jwt.sign(payload, secret_key);

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.post(`${server_url}/v1/orders`, params, {
      headers,
    });
    console.log(response.data);
  } catch (error) {
    if (error.response) {
      console.error(error.response.data);
    } else {
      console.error(error.message);
    }
  }
};

module.exports = orderUpbit;
