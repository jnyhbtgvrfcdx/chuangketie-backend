const users = require('../data/mockUsers');
const { TEST_TOKEN, getTokenFromHeader } = require('../utils/token');
const { fail } = require('../utils/response');

function authMiddleware(req, res, next) {
  const token = getTokenFromHeader(req.headers.authorization);

  if (!token) {
    return res.status(401).json(fail('未登录或 token 缺失', 401));
  }

  if (token !== TEST_TOKEN) {
    return res.status(401).json(fail('token 无效', 401));
  }

  const currentUser = users[0];
  req.user = currentUser;
  return next();
}

module.exports = authMiddleware;
