const express = require('express');
const { postSignUp, postLogin, getUserInfo } = require('../handlers/userHandler');
const { getMyWallet, getMyAsset } = require('../handlers/userWalletHandler');
const { getTradingLog, getAlgorithmLogs, startAiTrading, stopAiTrading, getAiStatus } = require('../handlers/userAlgorismApi');
const { getOrderList } = require('../handlers/TransactionHandler');
const userRouter = express.Router();

userRouter.post('/signup', postSignUp);
userRouter.post('/login', postLogin);
userRouter.get('/info', getUserInfo);
userRouter.get('/mywallet', getMyWallet);
userRouter.get('/myasset', getMyAsset);
userRouter.get('/tradinglog', getTradingLog);
userRouter.get('/logs', getAlgorithmLogs);
userRouter.post('/ai/start', startAiTrading);
userRouter.post('/ai/stop', stopAiTrading);
userRouter.get('/ai/status', getAiStatus);
userRouter.get('/mytradelogs', getOrderList);

module.exports = userRouter;
