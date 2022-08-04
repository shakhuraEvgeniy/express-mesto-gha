const express = require("express");
const mongoose = require("mongoose");
const { PORT = 3000 } = process.env;
const routes = require('./routes/index')

const app = express();

mongoose.connect("mongodb://localhost:27017/mestodb");

app.use((req, res, next) => {
  req.user = {
    _id: '62ec0a47f3980ad8bdea7def'
  };

  next();
});
app.use(routes)

app.listen(PORT, () => {
  console.log(`Server listen on port ${PORT}`);
});
