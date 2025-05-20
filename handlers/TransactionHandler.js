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
    // 1. 업비트 API 인증을 위한 토큰 생성
    const payload = {
      access_key: access_key,
      nonce: uuid.v4(),
    };

    const token = jwt.sign(payload, secret_key);
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    // 2. 쿼리 파라미터 처리
    const { market, state = 'done', page = 1, limit = 20, order_by = 'desc' } = req.query;

    // 3. 업비트 API 호출
    const response = await axios.get(`${server_url}/v1/orders`, {
      headers,
      params: {
        market,
        state,
        page: parseInt(page),
        limit: parseInt(limit),
        order_by
      }
    });

    // 4. 응답 반환
    return res.status(200).json({
      success: true,
      data: response.data
    });

  } catch (error) {
    console.error('주문 내역 조회 실패:', error);

    // 업비트 API 에러 처리
    if (error.response) {
      return res.status(error.response.status).json({
        success: false,
        error: error.response.data
      });
    }

    // 기타 에러
    return res.status(500).json({
      success: false,
      error: '주문 내역 조회 중 오류가 발생했습니다.'
    });
  }
};

module.exports = {
  orderUpbit,
  getOrderList,
};
