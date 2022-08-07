const User = require("../models/user");

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    if (err.name === "ValidationError") {
      res.status(400);
      res.send({
        message: "Переданы некорректные данные при создании пользователя",
      });
      return;
    }
    res.status(500);
    res.send(err.message);
  }
};

const getUserById = async (req, res) => {
  try {
    const { name, about, avatar, _id } = await User.findById(req.params.userId);
    res.send({ name, about, avatar, _id });
  } catch (err) {
    if (err.name === 'TypeError'){
      res.status(404);
      res.send({
        message: "Пользователь по указанному _id не найден.",
      });
      return;
    }
    if (err.name === "CastError") {
      res.status(400);
      res.send({
        message: "Пользователь по указанному _id не найден.",
      });
      return;
    }
    res.status(500);
    res.send(err.message);
  }
};

const createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const user = await User.create({ name, about, avatar });
    res.send(user);
  } catch (err) {
    if (err.name === "ValidationError") {
      res.status(400);
      res.send({
        message: "Переданы некорректные данные при создании пользователя",
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
      { new: true, runValidators: true }
    );
    res.send(user);
  } catch (err) {
    if (err.name === "ValidationError") {
      res.status(400);
      res.send({
        message: "Переданы некорректные данные при создании пользователя",
      });
      return;
    }
    if (err.name === "CastError") {
      res.status(404);
      res.send({
        message: "Пользователь по указанному _id не найден.",
      });
      return;
    }
    res.status(500);
    res.send(err.message);
  }
};

const updateAvatar = async (req, res) => {
  try {
    const userId = req.user._id;
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true }
    );
    res.send(user);
  } catch (err) {
    if (err.name === "ValidationError") {
      res.status(400);
      res.send({
        message: "Переданы некорректные данные при создании пользователя",
      });
      return;
    }
    if (err.name === "CastError") {
      res.status(404);
      res.send({
        message: "Пользователь по указанному _id не найден.",
      });
      return;
    }
    res.status(500);
    res.send(err.message);
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
};
