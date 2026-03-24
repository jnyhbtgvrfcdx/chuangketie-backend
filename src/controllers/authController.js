const users = require('../data/mockUsers');
const { success, fail } = require('../utils/response');
const { TEST_TOKEN } = require('../utils/token');

function login(req, res) {
  const { username, password } = req.body;
  const user = users.find((item) => item.username === username && item.password === password);

  if (!user) {
    return res.status(401).json(fail('用户名或密码错误', 401));
  }

  return res.json(
    success(
      {
        token: TEST_TOKEN,
        user: {
          id: user.id,
          username: user.username,
          nickname: user.nickname,
          avatar: user.avatar,
        },
      },
      '登录成功'
    )
  );
}

function getAuthInfo(req, res) {
  const user = req.user;

  return res.json(
    success({
      id: user.id,
      username: user.username,
      nickname: user.nickname,
      avatar: user.avatar,
    })
  );
}

module.exports = {
  login,
  getAuthInfo,
};
