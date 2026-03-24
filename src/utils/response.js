function success(data, message = 'ok') {
  return {
    code: 0,
    message,
    data,
  };
}

function fail(message = 'fail', code = 1, data = null) {
  return {
    code,
    message,
    data,
  };
}

module.exports = {
  success,
  fail,
};
