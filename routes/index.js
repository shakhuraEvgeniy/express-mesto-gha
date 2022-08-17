const express = require('express');
const { celebrate, Joi } = require('celebrate');

const routes = express.Router();
const userRoutes = require('./userRoutes');
const cardRoutes = require('./cardRoutes');
const auth = require('../middlewares/auth');
const {
  login, createUser,
} = require('../controllers/users');
const NotFoundError = require('../errors/NotFoundError');
const validation = require('../utils/validation');

routes.post('/signin', express.json(), celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
routes.post('/signup', express.json(), celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(validation),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);
routes.use(auth);
routes.use('/users', userRoutes);
routes.use('/cards', cardRoutes);
routes.use('*', (req, res, next) => {
  const err = new NotFoundError('Запрошена несуществующая страница.');
  next(err);
});

module.exports = routes;
