const userStore = require('../data/userStore');
const { TEST_TOKEN, getTokenFromHeader } = require('../utils/token');
const { fail } = require('../utils/response');

function findUserByToken(token) {
  // 测试账号使用固定 token
  if (token === TEST_TOKEN) {
    return userStore.findUserById('user-test-001');
  }
  
  // 其他用户使用动态 token
  // token 格式: mock-token-{userId}
  if (token.startsWith('mock-token-')) {
    const userId = token.replace('mock-token-', '');
    return userStore.findUserById(userId);
  }
  
  return null;
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
