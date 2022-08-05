const express = require("express");
const routes = express.Router();
const userRoutes = require("./userRoutes");
const cardRoutes = require("./cardRoutes");

routes.use("/users", userRoutes);
routes.use("/cards", cardRoutes);

module.exports = routes;
