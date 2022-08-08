const Card = require('../models/card');

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    res.send(cards);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400);
      res.send({
        message: 'Переданы некорректные данные при создании карточки',
      });
      return;
    }
    res.status(500);
    res.send(err.message);
  }
};

const createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const owner = req.user._id;
    const card = await Card.create({ name, link, owner });
    res.send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400);
      res.send({
        message: 'Переданы некорректные данные при создании карточки',
      });
      return;
    }
    res.status(500);
    res.send(err.message);
  }
};

const deleteCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndRemove(req.params.cardId).orFail(new Error('noFoundId'));
    res.send(card);
  } catch (err) {
    if (err.message === 'noFoundId') {
      res.status(404);
      res.send({
        message: 'Карточка с указанным _id не найдена.',
      });
      return;
    }
    if (err.name === 'CastError') {
      res.status(400);
      res.send({
        message: 'Карточка с указанным _id не найдена.',
      });
      return;
    }
    res.status(500);
    res.send(err.message);
  }
};

const likeCard = async (req, res) => {
  try {
    const userId = req.user._id;
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: userId } },
      { new: true, runValidators: true },
    ).orFail(new Error('noFoundId'));
    res.send(card);
  } catch (err) {
    if (err.message === 'noFoundId') {
      res.status(404);
      res.send({
        message: 'Передан несуществующий _id карточки.',
      });
      return;
    }
    if (err.name === 'ValidationError') {
      res.status(400);
      res.send({
        message: 'Переданы некорректные данные для постановки/снятии лайка.',
      });
      return;
    }
    if (err.name === 'CastError') {
      res.status(400);
      res.send({
        message: 'Передан несуществующий _id карточки.',
      });
      return;
    }
    res.status(500);
    res.send(err.message);
  }
};

const dislikeCard = async (req, res) => {
  try {
    const userId = req.user._id;
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: userId } },
      { new: true, runValidators: true },
    ).orFail(new Error('noFoundId'));
    res.send(card);
  } catch (err) {
    if (err.message === 'noFoundId') {
      res.status(404);
      res.send({
        message: 'Передан несуществующий _id карточки.',
      });
      return;
    }
    if (err.name === 'ValidationError') {
      res.status(400);
      res.send({
        message: 'Переданы некорректные данные для постановки/снятии лайка.',
      });
      return;
    }
    if (err.name === 'CastError') {
      res.status(400);
      res.send({
        message: 'Передан несуществующий _id карточки.',
      });
      return;
    }
    res.status(500);
    res.send(err.message);
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
