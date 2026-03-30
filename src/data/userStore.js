const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'users.json');

// 初始默认用户数据
const DEFAULT_USERS = [
  {
    id: 'user-test-001',
    username: 'admin',
    password: '123456',
    nickname: '测试用户',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Test',
    phone: '',
    email: '',
  },
];

// 从文件加载用户数据
function loadUsers() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('加载用户数据失败:', error.message);
  }
  
  // 文件不存在或读取失败，使用默认数据并保存
  saveUsers(DEFAULT_USERS);
  return DEFAULT_USERS;
}

// 保存用户数据到文件
function saveUsers(users) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (error) {
    console.error('保存用户数据失败:', error.message);
  }
}

// 初始化用户数据
let users = loadUsers();

// 获取所有用户
function getUsers() {
  return users;
}

// 根据 ID 查找用户
function findUserById(id) {
  return users.find(user => user.id === id);
}

// 根据用户名查找用户
function findUserByUsername(username) {
  return users.find(user => user.username === username);
}

// 添加用户
function addUser(user) {
  users.push(user);
  saveUsers(users);
  return user;
}

// 更新用户信息
function updateUser(id, updates) {
  const index = users.findIndex(user => user.id === id);
  if (index === -1) {
    return null;
  }
  
  users[index] = { ...users[index], ...updates };
  saveUsers(users);
  return users[index];
}

// 重置为默认数据（可选功能）
function resetUsers() {
  users = [...DEFAULT_USERS];
  saveUsers(users);
  return users;
}

module.exports = {
  getUsers,
  findUserById,
  findUserByUsername,
  addUser,
  updateUser,
  resetUsers,
};
