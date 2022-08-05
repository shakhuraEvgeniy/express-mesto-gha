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
  const { name, abour, avatar } = req.body;
  const user = await User.create({ name, abour, avatar });
  res.send(user);
};

module.exports = { getUsers, getUserById, createUser };
