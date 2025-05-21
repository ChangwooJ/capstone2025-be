const axios = require('axios');

const getTradingLog = async (req, res) => {
    try {
        const response = await axios.get('http://13.211.77.105:8000/trade_log');
        res.status(200).json(response.data);
        console.log(response);
    } catch (error) {
        console.error('거래 로그 조회 중 오류 발생:', error);
        res.status(500).json({
            success: false,
            message: '거래 로그 조회 중 오류가 발생했습니다.',
            error: error.message
        });
    }
}

const getAlgorithmLogs = async (req, res) => {
    try {
        const response = await axios.get('http://13.211.77.105:8000/logs');
        res.status(200).json(response.data);
    } catch (error) {
        console.error('알고리즘 로그 조회 중 오류 발생:', error);
        res.status(500).json({
            message: '알고리즘 로그 조회 중 오류가 발생했습니다.',
            error: error.message
        });
    }
};

const startAiTrading = async (req, res) => {
    try {
        const response = await axios.post('http://13.211.77.105:8000/start');
        res.status(200).json(response.data);
        console.log("거래 시작");
    } catch (error) {
        console.error('AI 전략 시작 실패:', error);
        res.status(500).json({
            message: 'AI 전략 시작 중 오류가 발생했습니다.',
            error: error.message
        });
    }
}

const stopAiTrading = async (req, res) => {
    try {
        const response = await axios.post('http://13.211.77.105:8000/stop');
        res.status(200).json(response.data);
        console.log("거래 중지");
    } catch (error) {
        console.error('AI 전략 중지 실패:', error);
        res.status(500).json({
            message: 'AI 전략 중지 중 오류가 발생했습니다.',
            error: error.message
        });
    }
}

const getAiStatus = async (req, res) => {
    try {
        const response = await axios.get('http://13.211.77.105:8000/status');
        res.status(200).json(response.data);
    } catch (error) {
        console.error('알고리즘 로그 조회 중 오류 발생:', error);
        res.status(500).json({
            message: '알고리즘 로그 조회 중 오류가 발생했습니다.',
            error: error.message
        });
    }
};

module.exports = {
    getTradingLog,
    getAlgorithmLogs,
    startAiTrading,
    stopAiTrading,
    getAiStatus
};
