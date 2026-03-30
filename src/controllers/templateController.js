const templateStore = require('../data/templateStore');
const categories = require('../data/mockCategories');
const { success, fail } = require('../utils/response');

// 获取模版列表
function getTemplates(req, res) {
  const { category, search, page = 1, limit = 20 } = req.query;
  
  console.log('[已连接] GET /templates');
  console.log('[请求数据] category:', category, 'search:', search, 'page:', page, 'limit:', limit);
  
  const result = templateStore.getTemplatesByFilter(
    category || undefined,
    search || undefined,
    parseInt(page, 10),
    parseInt(limit, 10)
  );
  
  return res.json(success({
    templates: result.list,
    total: result.total,
    page: result.page,
    limit: result.limit,
    totalPages: result.totalPages,
  }));
}

// 搜索单个模版
function searchTemplates(req, res) {
  const { kw } = req.query;
  
  console.log('[已连接] GET /templates/search');
  console.log('[请求数据] keyword:', kw);
  
  if (!kw) {
    return res.status(400).json(fail('请输入搜索关键词', 400));
  }
  
  const results = templateStore.searchTemplates(kw);
  
  return res.json(success({
    templates: results,
    total: results.length,
  }));
}

// 获取单个模版详情
function getTemplateById(req, res) {
  const { id } = req.params;
  
  console.log('[已连接] GET /templates/:id');
  console.log('[请求数据] templateId:', id);
  
  const template = templateStore.getTemplateById(id);
  
  if (!template) {
    return res.status(404).json(fail('模版不存在', 404));
  }
  
  return res.json(success(template));
}

// 获取分类列表
function getCategories(req, res) {
  console.log('[已连接] GET /categories');
  
  return res.json(success({
    categories: categories,
    total: categories.length,
  }));
}

// 添加模版（需要认证）
function addTemplate(req, res) {
  const { name, thumbnail, category, width, height, description, tags } = req.body;
  
  console.log('[已连接] POST /templates');
  console.log('[请求数据] name:', name, 'category:', category);
  
  if (!name || !thumbnail || !category) {
    return res.status(400).json(fail('模版名称、缩略图和分类为必填项', 400));
  }
  
  const newTemplate = templateStore.addTemplate({
    name,
    thumbnail,
    category,
    width: width || 1080,
    height: height || 1528,
    description: description || '',
    tags: tags || [],
  });
  
  return res.status(201).json(success(newTemplate, '模版创建成功'));
}

// 更新模版（需要认证）
function updateTemplate(req, res) {
  const { id } = req.params;
  const updates = req.body;
  
  console.log('[已连接] PUT /templates/:id');
  console.log('[请求数据] templateId:', id, 'updates:', JSON.stringify(updates));
  
  const updated = templateStore.updateTemplate(id, updates);
  
  if (!updated) {
    return res.status(404).json(fail('模版不存在', 404));
  }
  
  return res.json(success(updated, '模版更新成功'));
}

// 删除模版（需要认证）
function deleteTemplate(req, res) {
  const { id } = req.params;
  
  console.log('[已连接] DELETE /templates/:id');
  console.log('[请求数据] templateId:', id);
  
  const deleted = templateStore.deleteTemplate(id);
  
  if (!deleted) {
    return res.status(404).json(fail('模版不存在', 404));
  }
  
  return res.json(success(null, '模版删除成功'));
}

module.exports = {
  getTemplates,
  searchTemplates,
  getTemplateById,
  getCategories,
  addTemplate,
  updateTemplate,
  deleteTemplate,
};
