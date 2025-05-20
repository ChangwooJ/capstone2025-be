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
    // 1. 쿼리 파라미터 처리
    const { 
      market, 
      state = 'done', 
      page = 1, 
      limit = 20, 
      order_by = 'desc',
      // 추가 필터링 옵션
      side,           // bid(매수) 또는 ask(매도)
      ord_type,       // limit(지정가), price(시장가 매수), market(시장가 매도)
      start_date,     // YYYY-MM-DD 형식
      end_date,       // YYYY-MM-DD 형식
    } = req.query;

    // 2. 쿼리 파라미터를 문자열로 변환
    const queryObj = {
      ...(market && { market }),
      state,
      page: parseInt(page),
      limit: parseInt(limit),
      order_by
    };
    
    const query = querystring.stringify(queryObj);
    
    // 3. query_hash 생성
    const queryHash = crypto
      .createHash('sha512')
      .update(query, 'utf-8')
      .digest('hex');

    // 4. 업비트 API 인증을 위한 토큰 생성
    const payload = {
      access_key,
      nonce: uuid.v4(),
      query_hash: queryHash,
      query_hash_alg: 'SHA512'
    };

    const token = jwt.sign(payload, secret_key);
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    // 5. 업비트 API 호출
    const response = await axios.get(`${server_url}/v1/orders?${query}`, {
      headers
    });

    // 6. 응답 데이터 필터링
    let filteredData = response.data;

    // 거래 종류 필터링
    if (side) {
      filteredData = filteredData.filter(order => order.side === side);
    }

    // 주문 타입 필터링
    if (ord_type) {
      filteredData = filteredData.filter(order => order.ord_type === ord_type);
    }

    // 기간 필터링
    if (start_date || end_date) {
      filteredData = filteredData.filter(order => {
        const orderDate = new Date(order.created_at);
        const start = start_date ? new Date(start_date) : new Date(0);
        const end = end_date ? new Date(end_date + 'T23:59:59') : new Date();
        return orderDate >= start && orderDate <= end;
      });
    }

    // 7. 응답 반환
    return res.status(200).json({
      success: true,
      data: filteredData,
      meta: {
        total: filteredData.length,
        filtered: {
          side,
          ord_type,
          start_date,
          end_date
        }
      }
    });

  } catch (error) {
    console.error('주문 내역 조회 실패:', error);

    // 업비트 API 에러 처리
    if (error.response) {
      console.error('업비트 API 에러:', error.response.data);
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
