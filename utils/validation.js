const BadRequestError = require('../errors/BadRequestError');

const validation = (url) => {
  const regex = /^https?:\/\/[\w-~:/?#[\]@!$&'()*+,;=]*/i;
  if (!url.match(regex)) {
    throw new BadRequestError('Ошибка в url аватара');
  }
  return url;
};

module.exports = validation;
