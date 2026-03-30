const userStore = require('../data/userStore');
const { success, fail } = require('../utils/response');
const { TEST_TOKEN } = require('../utils/token');

function serializeUser(user) {
  return {
    id: user.id,
    username: user.username,
    nickname: user.nickname,
    avatar: user.avatar,
    phone: user.phone || '',
    email: user.email || '',
  };
}

function login(req, res) {
  const { username, password } = req.body;
  console.log('[已连接] POST /auth/login');
  console.log('[请求数据] username:', username, 'password:', password);
  const user = userStore.findUserByUsername(username);

  if (!user || user.password !== password) {
    return res.status(401).json(fail('用户名或密码错误', 401));
  }

  // 测试账号使用固定 token，其他用户使用动态 token
  const token = user.id === 'user-test-001' ? TEST_TOKEN : `mock-token-${user.id}`;

  return res.json(
    success(
      {
        token,
        user: serializeUser(user),
      },
      '登录成功'
    )
  );
}

function register(req, res) {
  const { username, password, nickname } = req.body;
  console.log('[已连接] POST /auth/register');
  console.log('[请求数据] username:', username, 'password:', password, 'nickname:', nickname);

  if (!username || !password) {
    return res.status(400).json(fail('用户名和密码为必填项', 400));
  }

  if (username.length < 2 || username.length > 20) {
    return res.status(400).json(fail('用户名长度需在 2-20 个字符之间', 400));
  }

  if (password.length < 6) {
    return res.status(400).json(fail('密码长度不能少于 6 个字符', 400));
  }

  const exists = userStore.findUserByUsername(username);
  if (exists) {
    return res.status(409).json(fail('用户名已存在', 409));
  }

  const newUser = userStore.addUser({
    id: `user-${Date.now()}`,
    username,
    password,
    nickname: nickname || username,
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(username)}`,
    phone: '',
    email: '',
  });

  const token = `mock-token-${newUser.id}`;

  return res.status(201).json(
    success(
      {
        token,
        user: serializeUser(newUser),
      },
      '注册成功'
    )
  );
}

function getAuthInfo(req, res) {
  console.log('[已连接] GET /auth/info');
  console.log('[请求数据] userId:', req.user?.id);
  const user = req.user;

  return res.json(success(serializeUser(user)));
}

function updateProfile(req, res) {
  const { nickname, avatar } = req.body || {};
  const user = req.user;
  console.log('[已连接] PUT /auth/profile');
  console.log('[请求数据] userId:', user?.id, 'nickname:', nickname, 'avatar:', avatar ? '(base64图片已省略)' : avatar);
  const updates = {};

  if (nickname !== undefined) {
    const trimmedNickname = typeof nickname === 'string' ? nickname.trim() : '';

    if (!trimmedNickname) {
      return res.status(400).json(fail('昵称不能为空', 400));
    }

    if (trimmedNickname.length > 20) {
      return res.status(400).json(fail('昵称不能超过20个字符', 400));
    }

    updates.nickname = trimmedNickname;
  }

  if (avatar !== undefined) {
    if (typeof avatar !== 'string' || !avatar.trim()) {
      return res.status(400).json(fail('头像不能为空', 400));
    }

    updates.avatar = avatar;
  }

  // 更新并持久化用户数据
  const updatedUser = userStore.updateUser(user.id, updates);
  
  if (!updatedUser) {
    return res.status(500).json(fail('更新用户信息失败', 500));
  }

  return res.json(success(serializeUser(updatedUser), '个人资料更新成功'));
}

// 绑定手机号
function bindPhone(req, res) {
  const { phone, code } = req.body;
  const user = req.user;
  console.log('[已连接] POST /auth/bind-phone');
  console.log('[请求数据] userId:', user?.id, 'phone:', phone, 'code:', code);

  // 验证手机号格式
  if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
    return res.status(400).json(fail('请输入正确的手机号', 400));
  }

  // 模拟验证码验证（演示环境，任意 6 位数字即可）
  if (!code || !/^\d{6}$/.test(code)) {
    return res.status(400).json(fail('请输入 6 位验证码', 400));
  }

  // 更新手机号
  const updatedUser = userStore.updateUser(user.id, { phone });
  
  if (!updatedUser) {
    return res.status(500).json(fail('绑定手机号失败', 500));
  }

  return res.json(success(serializeUser(updatedUser), '手机号绑定成功'));
}

// 发送验证码（模拟）
function sendSmsCode(req, res) {
  const { phone } = req.body;
  console.log('[已连接] POST /auth/sms/send');
  console.log('[请求数据] phone:', phone);

  if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
    return res.status(400).json(fail('请输入正确的手机号', 400));
  }

  // 演示环境，直接返回成功
  return res.json(success({ phone }, '验证码已发送'));
}

// 绑定邮箱
function bindEmail(req, res) {
  const { email, code } = req.body;
  const user = req.user;
  console.log('[已连接] POST /auth/bind-email');
  console.log('[请求数据] userId:', user?.id, 'email:', email, 'code:', code);

  // 验证邮箱格式
  if (!email || !/^[\w.-]+@[\w.-]+\.\w+$/.test(email)) {
    return res.status(400).json(fail('请输入正确的邮箱地址', 400));
  }

  // 模拟验证码验证（演示环境，任意 6 位数字即可）
  if (!code || !/^\d{6}$/.test(code)) {
    return res.status(400).json(fail('请输入 6 位验证码', 400));
  }

  // 更新邮箱
  const updatedUser = userStore.updateUser(user.id, { email });
  
  if (!updatedUser) {
    return res.status(500).json(fail('绑定邮箱失败', 500));
  }

  return res.json(success(serializeUser(updatedUser), '邮箱绑定成功'));
}

// 发送邮箱验证码（模拟）
function sendEmailCode(req, res) {
  const { email } = req.body;
  console.log('[已连接] POST /auth/email/send');
  console.log('[请求数据] email:', email);

  if (!email || !/^[\w.-]+@[\w.-]+\.\w+$/.test(email)) {
    return res.status(400).json(fail('请输入正确的邮箱地址', 400));
  }

  // 演示环境，直接返回成功
  return res.json(success({ email }, '验证码已发送'));
}

// 修改密码
function changePassword(req, res) {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const user = req.user;
  console.log('[已连接] POST /auth/change-password');
  console.log('[请求数据] userId:', user?.id, 'oldPassword: ******', 'newPassword: ******', 'confirmPassword: ******');

  // 验证旧密码
  if (!oldPassword) {
    return res.status(400).json(fail('请输入当前密码', 400));
  }

  if (oldPassword !== user.password) {
    return res.status(400).json(fail('当前密码不正确', 400));
  }

  // 验证新密码
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json(fail('新密码长度不能少于 6 个字符', 400));
  }

  // 确认密码
  if (newPassword !== confirmPassword) {
    return res.status(400).json(fail('两次输入的密码不一致', 400));
  }

  // 更新密码
  const updatedUser = userStore.updateUser(user.id, { password: newPassword });
  
  if (!updatedUser) {
    return res.status(500).json(fail('修改密码失败', 500));
  }

  return res.json(success(null, '密码修改成功'));
}

module.exports = {
  login,
  register,
  getAuthInfo,
  updateProfile,
  bindPhone,
  sendSmsCode,
  bindEmail,
  sendEmailCode,
  changePassword,
};
