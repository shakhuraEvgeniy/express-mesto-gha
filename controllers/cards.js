const Card = require("../models/card");

const getCards = async (req, res) => {
  const cards = await Card.find({});
  res.send(cards);
};

const createCard = async (req, res) => {
  const { name, link } = req.body;
  const card = await Card.create({ name, link });
  res.send(card);
};

const deleteCard = async (req, res) => {
  const card = await card.findByIdAndRemove(req.params.cardId);
  res.send(card);
};

module.exports = { getCards, createCard, deleteCard };
