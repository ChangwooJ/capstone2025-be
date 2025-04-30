const express = require('express');
const { postSignUp, postLogin, getUserInfo } = require('../handlers/userHandler');
const getMyWallet = require('../handlers/userWalletHandler');
const userRouter = express.Router();

userRouter.post('/signup', postSignUp);
userRouter.post('/login', postLogin);
userRouter.get('/info', getUserInfo);
userRouter.get('/mywallet', getMyWallet);

module.exports = userRouter;
