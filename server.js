const express = require('express');
const cors = require('cors');
const router = require('./routes/ExchangeRoutes');
const userRouter = require('./routes/UserRoutes');
const PORT = process.env.PORT || 8000;
const app = express();
require('dotenv').config();

const allowedOrigins = [
  'http://localhost:5173',
  'https://capstone2025-fe.vercel.app/',
  'https://capstone2025-9fwc6j2in-jungchangwoos-projects.vercel.app',
  'https://capstone2025-fe-git-develop-jungchangwoos-projects.vercel.app',
  'https://nexbit.p-e.kr'
];


const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api', router);
app.use('/user', userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
