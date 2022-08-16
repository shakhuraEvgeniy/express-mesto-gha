const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const BedRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

const { NODE_ENV, JWT_SECRET } = process.env;

const User = require('../models/user');
const ConflictError = require('../errors/ConflictError');

// const sendError = (res, err) => {
//   if (err.name === 'ValidationError') {
//     res.status(400);
//     res.send({
//       message: 'Переданы некорректные данные при создании пользователя',
//     });
//     return;
//   }
//   if (err.name === 'TypeError') {
//     res.status(404);
//     res.send({
//       message: 'Пользователь по указанному _id не найден.',
//     });
//     return;
//   }
//   if (err.name === 'CastError') {
//     res.status(404);
//     res.send({
//       message: 'Пользователь по указанному _id не найден.',
//     });
//     return;
//   }
//   if (err.message === 'noFoundEmail') {
//     res.status(401);
//     res.send({
//       message: 'Задан некорректный email.',
//     });
//   }
// };

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (e) {
    next(e);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const {
      name, about, avatar, _id,
    } = await User.findById(req.params.userId);
    res.send({
      name,
      about,
      avatar,
      _id,
    });
  } catch (e) {
    if (e.name === 'CastError') {
      const err = new BedRequestError('Пользователь по указанному _id не найден.');
      next(err);
      return;
    }
    next(e);
  }
};

const createUser = async (req, res, next) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;
    if (!validator.isEmail(email)) {
      throw new BedRequestError('Задан некорректный email.');
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    });
    res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
      _id: user._id,
    });
  } catch (e) {
    if (e.code === 11000) {
      const err = new ConflictError('Пользователь с данным email уже зарегистрирован');
      next(err);
      return;
    }
    if (e.name === 'ValidationError') {
      const err = new BedRequestError('Переданы некорректные данные при создании пользователя');
      next(err);
      return;
    }
    next(e);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    );
    res.send(user);
  } catch (e) {
    if (e.name === 'ValidationError') {
      const err = new BedRequestError('Переданы некорректные данные при обновлении пользователя');
      next(err);
      return;
    }
    if (e.name === 'CastError') {
      const err = new NotFoundError('Пользователь по указанному _id не найден.');
      next(err);
      return;
    }
    next(e);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true },
    );
    res.send(user);
  } catch (e) {
    if (e.name === 'ValidationError') {
      const err = new BedRequestError('Переданы некорректные данные при обновлении аватара.');
      next(err);
      return;
    }
    if (e.name === 'CastError') {
      const err = new NotFoundError('Пользователь по указанному _id не найден.');
      next(err);
      return;
    }
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!validator.isEmail(email)) {
      throw new NotFoundError('Задан некорректный email или пароль.');
    }
    const user = await User.findOne({ email }).select('+password').orFail(new Error('noFoundEmail'));
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      throw new NotFoundError('Задан некорректный email или пароль.');
    }
    const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
    res.cookie('authorization', token, {
      maxAge: 3600000 * 24 * 7,
      httpOnly: true,
    }).send({ _id: user._id });
  } catch (e) {
    next(e);
  }
};

const getUser = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { email } = await User.findById(_id);
    res.send({
      _id,
      email,
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
  login,
  getUser,
};
