const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

const User = require('../models/user');

const sendError = (res, err) => {
  if (err.name === 'ValidationError') {
    res.status(400);
    res.send({
      message: 'Переданы некорректные данные при создании пользователя',
    });
    return;
  }
  if (err.name === 'TypeError') {
    res.status(404);
    res.send({
      message: 'Пользователь по указанному _id не найден.',
    });
    return;
  }
  if (err.name === 'CastError') {
    res.status(404);
    res.send({
      message: 'Пользователь по указанному _id не найден.',
    });
    return;
  }
  if (err.message === 'noFoundEmail') {
    res.status(401);
    res.send({
      message: 'Задан некорректный email.',
    });
    return;
  }
  res.status(500);
  res.send(err.message);
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    sendError(res, err);
  }
};

const getUserById = async (req, res) => {
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
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(400);
      res.send({
        message: 'Пользователь по указанному _id не найден.',
      });
      return;
    }
    sendError(res, err);
  }
};

const createUser = async (req, res) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;
    if (!validator.isEmail(email)) {
      res.status(400);
      res.send({
        message: 'Задан некорректный email.',
      });
      return;
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    });
    res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400);
      res.send({
        message: 'Переданы некорректные данные при создании пользователя',
      });
      return;
    }
    res.status(500);
    res.send(err.message);
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    );
    res.send(user);
  } catch (err) {
    sendError(res, err);
  }
};

const updateAvatar = async (req, res) => {
  try {
    const userId = req.user._id;
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true },
    );
    res.send(user);
  } catch (err) {
    sendError(res, err);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!validator.isEmail(email)) {
      throw new Error('noFoundEmail');
    }
    const user = await User.findOne({ email }).select('+password').orFail(new Error('noFoundEmail'));
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      throw new Error('noFoundEmail');
    }
    const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
    res.cookie('authorization', token, {
      maxAge: 3600000 * 24 * 7,
      httpOnly: true,
    }).send({ _id: user._id });
  } catch (err) {
    sendError(res, err);
  }
};

const getUser = async (req, res) => {
  try {
    const { _id } = req.user;
    const { email } = await User.findById(_id);
    res.send({
      _id,
      email,
    });
  } catch (err) {
    sendError(res, err);
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
