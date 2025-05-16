const axios = require('axios');
const jwt = require('jsonwebtoken');
const uuid = require('uuid'); // UUID 생성용

const getMyWallet = async (req, res) => {
  try {
    // 환경변수 또는 별도 보관된 키 사용
    const access_key = process.env.UPBIT_OPEN_API_ACCESS_KEY;
    const secret_key = process.env.UPBIT_OPEN_API_SECRET_KEY;
    const server_url = 'https://api.upbit.com';

    // JWT payload 생성
    const payload = {
      access_key: access_key,
      nonce: uuid.v4(), // 매 요청마다 고유값
    };

    // JWT 토큰 생성
    const token = jwt.sign(payload, secret_key);

    // 요청 헤더에 JWT 토큰 포함
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    // 업비트 계좌 조회 API 호출
    const response = await axios.get(`${server_url}/v1/accounts`, { headers });

    // 자산 정보 반환
    res.status(200).json(response.data);
  } catch (error) {
    console.error('업비트 자산 조회 실패:', error.response ? error.response.data : error);
    res.status(500).json({ message: '업비트 자산 조회 실패', error: error.response?.data || error.message });
  }
};

const getMyAsset = async (req, res) => {
  try {
    // 환경변수 또는 별도 보관된 키 사용
    const access_key = process.env.UPBIT_OPEN_API_ACCESS_KEY;
    const secret_key = process.env.UPBIT_OPEN_API_SECRET_KEY;
    const server_url = 'https://api.upbit.com';

    // JWT payload 생성
    const payload = {
      access_key: access_key,
      nonce: uuid.v4(), // 매 요청마다 고유값
    };

    // JWT 토큰 생성
    const token = jwt.sign(payload, secret_key);

    // 요청 헤더에 JWT 토큰 포함
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    // 업비트 계좌 조회 API 호출
    const accountsResponse = await axios.get(`${server_url}/v1/accounts`, { headers });

    const tickerResponse = await axios.get(`${server_url}/v1/ticker?markets=KRW-BTC`);
    const btcPrice = tickerResponse.data[0].trade_price;

    const result = {
      assets: accountsResponse.data,
      btc_current_price: btcPrice
    };

    // 자산 정보 반환
    res.status(200).json(result);
  } catch (error) {
    console.error('업비트 자산 조회 실패:', error.response ? error.response.data : error);
    res.status(500).json({ message: '업비트 자산 조회 실패', error: error.response?.data || error.message });
  }
}

module.exports = { getMyWallet, getMyAsset };
