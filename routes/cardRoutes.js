const express = require("express");
const cardRoutes = express.Router();
const { getCards } = require("../controllers/users");

cardRoutes.get("/", getCards);

module.exports = cardRoutes;
