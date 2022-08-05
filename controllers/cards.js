const Card = require("../models/card");

const getCards = async (req, res) => {
  const cards = await Card.find({});
  res.send(cards);
};

const createCard = async (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  const card = await Card.create({ name, link, owner });
  res.send(card);
};

const deleteCard = async (req, res) => {
  const card = await Card.findByIdAndRemove(req.params.cardId);
  res.send(card);
};

const likeCard = async (req, res) => {
  const userId = req.user._id;
  const card = await Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: userId } },
    { new: true }
  );
  res.send(card);
};

const dislikeCard = async (req, res) => {
  const userId = req.user._id;
  const card = await Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: userId } },
    { new: true }
  );
  res.send(card);
};

module.exports = { getCards, createCard, deleteCard, likeCard, dislikeCard };
