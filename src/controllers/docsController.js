const { success } = require('../utils/response');

const INTERFACE_GROUPS = [
  {
    key: 'templates',
    title: '模板',
    description: '模板列表、详情、分类筛选与关键词搜索。',
  },
  {
    key: 'auth',
    title: '认证',
    description: '登录与当前用户信息获取。',
  },
  {
    key: 'designs',
    title: '作品',
    description: '用户作品的创建、查询与删除。',
  },
  {
    key: 'spider',
    title: '采集',
    description: '采集素材的写入与最近记录查询。',
  },
];

const INTERFACES = [
  {
    id: 'templates-list',
    group: 'templates',
    method: 'GET',
    path: '/api/templates',
    title: '获取模板列表',
    description: '返回全部 mock 模板数据，可用于模板列表页初始化。',
    authRequired: false,
    queryParams: [],
    pathParams: [],
    requestBodyExample: null,
    responseNotes: '返回模板数组。响应结构统一为 { code, message, data }。',
  },
  {
    id: 'templates-detail',
    group: 'templates',
    method: 'GET',
    path: '/api/templates/:id',
    title: '获取模板详情',
    description: '按模板 ID 返回单个模板详情，不存在时返回 404。',
    authRequired: false,
    queryParams: [],
    pathParams: [
      {
        name: 'id',
        required: true,
        description: '模板 ID，例如 template-001。',
      },
    ],
    requestBodyExample: null,
    responseNotes: '成功返回单个模板对象；模板不存在时返回错误信息。',
  },
  {
    id: 'templates-category',
    group: 'templates',
    method: 'GET',
    path: '/api/templates/category/:name',
    title: '按分类获取模板',
    description: '根据分类名称筛选模板，路径参数会先做 decodeURIComponent 处理。',
    authRequired: false,
    queryParams: [],
    pathParams: [
      {
        name: 'name',
        required: true,
        description: '分类名称，大小写不敏感，支持 URL 编码。',
      },
    ],
    requestBodyExample: null,
    responseNotes: '返回匹配分类的模板数组；分类参数格式错误时返回 400。',
  },
  {
    id: 'templates-search',
    group: 'templates',
    method: 'GET',
    path: '/api/templates/search',
    title: '搜索模板',
    description: '按标题、分类、描述和标签做关键字包含搜索。',
    authRequired: false,
    queryParams: [
      {
        name: 'kw',
        required: false,
        description: '搜索关键词；为空时直接返回空数组。',
      },
    ],
    pathParams: [],
    requestBodyExample: null,
    responseNotes: '返回匹配模板数组，未提供 kw 时返回空数组。',
  },
  {
    id: 'categories-list',
    group: 'templates',
    method: 'GET',
    path: '/api/categories',
    title: '获取分类列表',
    description: '返回所有模板分类数据。',
    authRequired: false,
    queryParams: [],
    pathParams: [],
    requestBodyExample: null,
    responseNotes: '返回分类数组。',
  },
  {
    id: 'auth-login',
    group: 'auth',
    method: 'POST',
    path: '/api/auth/login',
    title: '用户登录',
    description: '校验 mock 用户名和密码，成功后返回固定 token 与用户信息。',
    authRequired: false,
    queryParams: [],
    pathParams: [],
    requestBodyExample: {
      username: 'test',
      password: '123456',
    },
    responseNotes: '成功返回 token: mock-token-test-user；凭证错误时返回 401。',
  },
  {
    id: 'auth-info',
    group: 'auth',
    method: 'GET',
    path: '/api/auth/info',
    title: '获取当前用户信息',
    description: '从 Authorization 请求头中读取 Bearer token 并返回当前用户。',
    authRequired: true,
    authHint: 'Authorization: Bearer mock-token-test-user',
    queryParams: [],
    pathParams: [],
    requestBodyExample: null,
    responseNotes: '未登录、token 缺失或 token 无效时返回 401。',
  },
  {
    id: 'designs-create',
    group: 'designs',
    method: 'POST',
    path: '/api/designs',
    title: '创建作品',
    description: '基于模板创建用户作品，templateId 与 title 为必填。',
    authRequired: true,
    authHint: 'Authorization: Bearer mock-token-test-user',
    queryParams: [],
    pathParams: [],
    requestBodyExample: {
      templateId: 'template-001',
      title: '春季活动海报',
      cover: 'https://example.com/cover.jpg',
      content: {
        texts: ['限时优惠', '全场五折'],
      },
    },
    responseNotes: '成功返回新作品对象并使用 201 状态码；模板不存在返回 404。',
  },
  {
    id: 'designs-list',
    group: 'designs',
    method: 'GET',
    path: '/api/designs',
    title: '获取作品列表',
    description: '返回当前登录用户的全部作品。',
    authRequired: true,
    authHint: 'Authorization: Bearer mock-token-test-user',
    queryParams: [],
    pathParams: [],
    requestBodyExample: null,
    responseNotes: '仅返回当前用户 userId 对应的数据。',
  },
  {
    id: 'designs-delete',
    group: 'designs',
    method: 'DELETE',
    path: '/api/designs/:id',
    title: '删除作品',
    description: '删除当前登录用户指定 ID 的作品。',
    authRequired: true,
    authHint: 'Authorization: Bearer mock-token-test-user',
    queryParams: [],
    pathParams: [
      {
        name: 'id',
        required: true,
        description: '作品 ID。',
      },
    ],
    requestBodyExample: null,
    responseNotes: '删除成功返回被删除对象；作品不存在时返回 404。',
  },
  {
    id: 'spider-create-assets',
    group: 'spider',
    method: 'POST',
    path: '/api/spider/assets',
    title: '写入采集素材',
    description: '支持单条或批量写入采集素材，依赖唯一索引实现幂等去重。',
    authRequired: false,
    queryParams: [],
    pathParams: [],
    requestBodyExample: {
      items: [
        {
          title: '春节海报',
          imageUrl: 'https://example.com/poster.jpg',
          sourceUrl: 'https://www.chuangkit.com/designtools/designindex',
          pageType: '设计模板缩略图',
        },
      ],
    },
    responseNotes: 'title、imageUrl 必填；单次最多 100 条；成功返回 count 和 items。',
  },
  {
    id: 'spider-list-assets',
    group: 'spider',
    method: 'GET',
    path: '/api/spider/assets',
    title: '查询采集素材',
    description: '按最新入库顺序返回采集记录，可通过 limit 控制数量。',
    authRequired: false,
    queryParams: [
      {
        name: 'limit',
        required: false,
        description: '返回数量，默认 20，最大 100。',
      },
    ],
    pathParams: [],
    requestBodyExample: null,
    responseNotes: '返回数据库中的素材记录列表。',
  },
];

function getInterfaces(req, res) {
  return res.json(
    success({
      groups: INTERFACE_GROUPS,
      interfaces: INTERFACES,
    })
  );
}

module.exports = {
  getInterfaces,
};
