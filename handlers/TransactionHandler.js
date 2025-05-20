const axios = require('axios');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const querystring = require('querystring');
const crypto = require('crypto');

const access_key = process.env.UPBIT_OPEN_API_ACCESS_KEY;
const secret_key = process.env.UPBIT_OPEN_API_SECRET_KEY;
const server_url = "https://api.upbit.com";

const orderUpbit = async (req, res) => {
  const { market, side, volume, price, ord_type } = req.body;

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

const getOrderList = async (req, res) => {
  try {
    const { market = 'KRW-BTC', state = 'done', page = 1, limit = 20 } = req.query;

    // 페이지와 limit이 숫자인지 확인
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    
    if (isNaN(pageNum) || isNaN(limitNum)) {
      return res.status(400).json({ error: '페이지와 limit은 숫자여야 합니다.' });
    }

    const queryObj = {
      market,
      state,
      page: pageNum,
      limit: limitNum,
    };

    const query = querystring.stringify(queryObj);
    const queryHash = crypto.createHash('sha512').update(query, 'utf-8').digest('hex');

    const payload = {
      access_key,
      nonce: uuid.v4(),
      query_hash: queryHash,
      query_hash_alg: 'SHA512',
    };

    const token = jwt.sign(payload, secret_key);
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.get(`${server_url}/v1/orders?${query}`, { headers });
    
    if (!response.data) {
      return res.status(404).json({ error: '주문 내역을 찾을 수 없습니다.' });
    }

    return res.status(200).json({
      success: true,
      data: response.data,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: response.data.length
      }
    });

  } catch (error) {
    console.error('주문 내역 조회 중 오류 발생:', error);
    
    if (error.response) {
      // 업비트 API에서 반환한 에러
      return res.status(error.response.status).json({
        success: false,
        error: error.response.data
      });
    } else if (error.request) {
      // 요청은 보냈지만 응답을 받지 못한 경우
      return res.status(503).json({
        success: false,
        error: '업비트 서버에 연결할 수 없습니다.'
      });
    } else {
      // 기타 에러
      return res.status(500).json({
        success: false,
        error: '서버 내부 오류가 발생했습니다.'
      });
    }
  }
};

module.exports = {
  orderUpbit,
  getOrderList,
};
