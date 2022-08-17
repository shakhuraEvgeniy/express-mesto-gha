const validation = (v) => {
  const regex = /^https?:\/\/[\w-~:/?#[\]@!$&'()*+,;=]*/i;
  return v.match(regex);
};

module.exports = validation;
