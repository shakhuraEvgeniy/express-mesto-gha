const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { cookie } = req.headers;

  if (!cookie || !cookie.startsWith('authorization=')) {
    throw new UnauthorizedError('Необходима авторизация');
  }
  const token = cookie.replace('authorization=', '');
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (e) {
    const err = new UnauthorizedError('Необходима авторизация');
    next(err);
  }
  req.user = payload;
  next();
};
