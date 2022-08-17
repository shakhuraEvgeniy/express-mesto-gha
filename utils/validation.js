const validation = (v) => {
  const regex = /^https?:\/\/[\w-~:/?#[\]@!$&'()*+,;=]*/i;
  if (v.match(regex)) {
    return v;
  }
  return false;
};

module.exports = validation;
