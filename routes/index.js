const express = require('express');

const routes = express.Router();
const userRoutes = require('./userRoutes');
const cardRoutes = require('./cardRoutes');
const auth = require('../middlewares/auth');
const {
  login, createUser,
} = require('../controllers/users');

routes.post('/signin', express.json(), login);
routes.post('/signup', express.json(), createUser);
routes.use(auth);
routes.use('/users', userRoutes);
routes.use('/cards', cardRoutes);
routes.use('*', (req, res) => {
  res.status(404);
  res.send({
    message: 'Запрошена несуществующая страница.',
  });
});

module.exports = routes;
