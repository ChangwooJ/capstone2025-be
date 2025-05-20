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
    // 업비트 API는 state 파라미터에 배열을 받을 수 있음
    const { market, states = ['done', 'cancel', 'wait'], page = 1, limit = 20 } = req.query;
    
    // states가 문자열로 오면 배열로 변환
    const stateArray = Array.isArray(states) ? states : [states];
    
    // 페이지와 limit이 숫자인지 확인
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    
    if (isNaN(pageNum) || isNaN(limitNum)) {
      return res.status(400).json({ 
        success: false,
        error: '페이지와 limit은 숫자여야 합니다.' 
      });
    }

    // 업비트 API 요청 파라미터 구성
    const queryObj = {
      ...(market && { market }), // market이 있는 경우에만 포함
      states: stateArray.join(','), // 업비트 API는 콤마로 구분된 문자열을 받음
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
    
    // 업비트 API 응답을 그대로 전달
    return res.status(200).json({
      success: true,
      data: response.data,
      // 업비트 API는 페이지네이션 정보를 제공하지 않으므로 제거
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
