const users = require('../data/mockUsers');
const { TEST_TOKEN, getTokenFromHeader } = require('../utils/token');
const { fail } = require('../utils/response');

function findUserByToken(token) {
  if (token === TEST_TOKEN) {
    return users[0];
  }
  return users.find((item) => item.id && token === `mock-token-${item.id}`);
}

function authMiddleware(req, res, next) {
  const token = getTokenFromHeader(req.headers.authorization);

  if (!token) {
    return res.status(401).json(fail('未登录或 token 缺失', 401));
  }

  const currentUser = findUserByToken(token);
  if (!currentUser) {
    return res.status(401).json(fail('token 无效', 401));
  }

  req.user = currentUser;
  return next();
}

module.exports = authMiddleware;
