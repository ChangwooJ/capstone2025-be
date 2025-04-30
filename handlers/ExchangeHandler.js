const request = require('request');

const getExchangePrice = (req, res) => {
  // 기본값: 1분봉 100개
  const interval = req.query.interval || 'minutes/1';
  const count = req.query.count || 100;
  const market = req.query.market || 'KRW-BTC';
  
  const server_url = "https://api.upbit.com";
  const options = {
    method: "GET",
    url: `${server_url}/v1/candles/${interval}`,
    qs: { market: market, count: count }
  };

  request(options, (error, response, body) => {
    if (error) {
      console.error('업비트 API 오류:', error);
      return res.status(500).json({ message: "API 호출 실패" });
    }
    
    try {
      const upbitData = JSON.parse(body);
      
      // 업비트 데이터를 priceDataType 형식으로 변환
      const priceData = upbitData.map((candle, index) => ({
        id: index,
        datetime: candle.candle_date_time_kst,
        open: candle.opening_price,
        high: candle.high_price,
        low: candle.low_price,
        close: candle.trade_price,
        volume: candle.candle_acc_trade_volume
      }));
      
      res.json(priceData);
    } catch (e) {
      console.error('데이터 파싱 오류:', e);
      res.status(500).json({ message: "응답 처리 오류" });
    }
  });
};

module.exports = getExchangePrice;
