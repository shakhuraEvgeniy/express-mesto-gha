const User = require("../models/user");

const getUsers = async (req, res) => {
  const users = await User.find({});
  res.send(users);
};

const getUserById = async (req, res) => {
  const user = await User.findById(req.params.userId);
  res.send(user);
};

const createUser = async (req, res) => {
  const { name, about, avatar } = req.body;
  const user = await User.create({ name, about, avatar });
  res.send(user);
};

const updateUser = async (req, res) => {
  const userId = req.user._id;
  const { name, about } = req.body;
  const user = await User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true }
  );
  res.send(user);
};

const updateAvatar = async (req, res) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  const user = await User.findByIdAndUpdate(userId, { avatar }, { new: true });
  res.send(user);
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
};
