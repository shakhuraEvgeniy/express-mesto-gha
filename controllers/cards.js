const Card = require('../models/card');
const BedRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

// const sendError = (res, err) => {
//   if (err.name === 'ValidationError') {
//     res.status(400);
//     res.send({
//       message: 'Переданы некорректные данные при создании карточки',
//     });
//     return;
//   }
//   if (err.message === 'noFoundId') {
//     res.status(404);
//     res.send({
//       message: 'Карточка с указанным _id не найдена.',
//     });
//     return;
//   }
//   if (err.name === 'CastError') {
//     res.status(400);
//     res.send({
//       message: 'Передан несуществующий _id карточки.',
//     });
//   }
// };

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.send(cards);
  } catch (e) {
    next(e);
  }
};

const createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const owner = req.user._id;
    const card = await Card.create({ name, link, owner });
    res.send(card);
  } catch (e) {
    if (e.name === 'ValidationError') {
      const err = new BedRequestError('Переданы некорректные данные при создании карточки');
      next(err);
      return;
    }
    next(e);
  }
};

const deleteCard = async (req, res, next) => {
  try {
    const card = await Card.findOneAndRemove({ _id: req.params.cardId, owner: req.user._id }).orFail(new Error('noFoundId'));
    res.send(card);
  } catch (e) {
    if (e.name === 'CastError') {
      const err = new BedRequestError('Карточка с указанным _id не найдена.');
      next(err);
      return;
    }
    next(e);
  }
};

const likeCard = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: userId } },
      { new: true, runValidators: true },
    ).orFail(new NotFoundError('Карточка с указанным _id не найдена.'));
    res.send(card);
  } catch (e) {
    if (e.name === 'ValidationError') {
      const err = new BedRequestError('Переданы некорректные данные для постановки/снятии лайка.');
      next(err);
      return;
    }
    next(e);
  }
};

const dislikeCard = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: userId } },
      { new: true, runValidators: true },
    ).orFail(new NotFoundError('Карточка с указанным _id не найдена.'));
    res.send(card);
  } catch (e) {
    if (e.name === 'ValidationError') {
      const err = new BedRequestError('Переданы некорректные данные для постановки/снятии лайка.');
      next(err);
      return;
    }
    next(e);
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
