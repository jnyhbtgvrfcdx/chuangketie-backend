# 创客贴后端 Mock 服务

## 启动

```bash
npm install
npm run dev
```

生产启动：

```bash
npm start
```

服务默认运行在 `http://localhost:3000`。

## 测试账号

- 用户名：`test`
- 密码：`123456`
- token：登录后返回固定 mock token

## 已实现接口

- `GET /api/templates`
- `GET /api/templates/:id`
- `GET /api/templates/category/:name`
- `GET /api/templates/search?kw=`
- `GET /api/categories`
- `POST /api/auth/login`
- `GET /api/auth/info`
- `POST /api/designs`
- `GET /api/designs`
- `DELETE /api/designs/:id`

作品接口需要在请求头中传入：

```text
Authorization: Bearer mock-token-test-user
```
