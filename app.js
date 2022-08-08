const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

const { PORT = 3000 } = process.env;
const routes = require('./routes/index');

const app = express();

app.use(helmet());
app.use(apiLimiter);
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '62ec0a47f3980ad8bdea7def',
  };
  next();
});
app.use(routes);

app.listen(PORT, () => {
  console.log(`Server listen on port ${PORT}`);
});
