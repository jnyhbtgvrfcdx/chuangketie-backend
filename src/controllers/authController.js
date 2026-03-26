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

function register(req, res) {
  const { username, password, nickname } = req.body;

  if (!username || !password) {
    return res.status(400).json(fail('用户名和密码为必填项', 400));
  }

  if (username.length < 2 || username.length > 20) {
    return res.status(400).json(fail('用户名长度需在 2-20 个字符之间', 400));
  }

  if (password.length < 6) {
    return res.status(400).json(fail('密码长度不能少于 6 个字符', 400));
  }

  const exists = users.find((item) => item.username === username);
  if (exists) {
    return res.status(409).json(fail('用户名已存在', 409));
  }

  const newUser = {
    id: `user-${Date.now()}`,
    username,
    password,
    nickname: nickname || username,
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(username)}`,
  };

  users.push(newUser);

  const token = `mock-token-${newUser.id}`;

  return res.status(201).json(
    success(
      {
        token,
        user: {
          id: newUser.id,
          username: newUser.username,
          nickname: newUser.nickname,
          avatar: newUser.avatar,
        },
      },
      '注册成功'
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
  register,
  getAuthInfo,
};
