const express = require('express');
const cors = require('cors');
const router = require('./routes/ExchangeRoutes');
const PORT = process.env.PORT || 8000;
const app = express();

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());


app.use('/api', router);
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
