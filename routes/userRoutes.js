const express = require('express');

const userRoutes = express.Router();
const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getUser,
} = require('../controllers/users');

userRoutes.get('/', getUsers);
userRoutes.patch('/me', express.json(), updateUser);
userRoutes.get('/me', getUser);
userRoutes.patch('/me/avatar', express.json(), updateAvatar);
userRoutes.get('/:userId', getUserById);

module.exports = userRoutes;
