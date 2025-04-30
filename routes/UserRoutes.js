const express = require('express');
const { postSignUp, postLogin, getUserInfo } = require('../handlers/userHandler');
const userRouter = express.Router();

userRouter.post('/signup', postSignUp);
userRouter.post('/login', postLogin);
userRouter.get('/info', getUserInfo);

module.exports = userRouter;
