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

接口展示页：`http://localhost:3000/interfaces`
接口清单数据源：`http://localhost:3000/api/docs/interfaces`

## MySQL 配置

新增采集数据入库功能后，需要先配置以下环境变量：

```bash
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=chuangkit
DB_CONNECTION_LIMIT=10
```

### 建表 SQL

```sql
CREATE TABLE IF NOT EXISTS official_site_assets (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  image_url VARCHAR(1000) NOT NULL,
  source_url VARCHAR(1000) DEFAULT NULL,
  page_type VARCHAR(100) DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_source_image (source_url, image_url),
  KEY idx_created_at (created_at)
);
```

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
- `POST /api/spider/assets`
- `GET /api/spider/assets`

作品接口需要在请求头中传入：

```text
Authorization: Bearer mock-token-test-user
```

## 采集数据接口

### POST /api/spider/assets

支持单条或批量写入，统一返回 `{ code, message, data }`。

单条示例：

```json
{
  "title": "春节海报",
  "imageUrl": "https://example.com/poster.jpg",
  "sourceUrl": "https://www.chuangkit.com/designtools/designindex",
  "pageType": "设计模板缩略图"
}
```

批量示例：

```json
{
  "items": [
    {
      "title": "春节海报",
      "imageUrl": "https://example.com/poster.jpg",
      "sourceUrl": "https://www.chuangkit.com/designtools/designindex",
      "pageType": "设计模板缩略图"
    }
  ]
}
```

校验规则：

- `title`、`imageUrl` 为必填
- `imageUrl`、`sourceUrl` 必须是合法 HTTP/HTTPS URL
- 单次最多提交 100 条
- 依赖唯一索引 `(source_url, image_url)` 做幂等去重

### GET /api/spider/assets

查询最近入库的采集记录，可通过 `limit` 控制返回数量：

```text
GET /api/spider/assets?limit=20
```

## 爬虫调用方式

当前爬虫脚本位于：

```text
D:\zmm\sb-li-wenqi\scripts\chuangkit_image_urls.py
```

抓取并输出本地 JSON：

```bash
python D:/zmm/sb-li-wenqi/scripts/chuangkit_image_urls.py
```

抓取后直接提交到后端：

```bash
python D:/zmm/sb-li-wenqi/scripts/chuangkit_image_urls.py --submit --backend-url http://localhost:3000/api/spider/assets
```

## 验证步骤

1. 执行 `npm install`
2. 配置 MySQL 环境变量
3. 执行上方建表 SQL
4. 启动后端服务并访问 `GET /`
5. 调用 `POST /api/spider/assets` 验证单条和批量写入
6. 调用 `GET /api/spider/assets` 验证查询结果
7. 运行爬虫脚本并确认数据成功写入数据库
