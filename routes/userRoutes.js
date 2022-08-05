const express = require("express");
const userRoutes = express.Router();
const { getUsers, getUserById, createUser } = require("../controllers/users");

userRoutes.get("/", getUsers);
userRoutes.get("/:userId", getUserById);
userRoutes.post("/", express.json(), createUser);


module.exports = userRoutes;
