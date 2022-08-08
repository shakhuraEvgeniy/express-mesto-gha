const express = require('express');

const routes = express.Router();
const userRoutes = require('./userRoutes');
const cardRoutes = require('./cardRoutes');

routes.use('/users', userRoutes);
routes.use('/cards', cardRoutes);
routes.use('*', (req, res) => {
  res.status(404);
  res.send({
    message: 'Запрошена несуществующая страница.',
  });
});

module.exports = routes;
