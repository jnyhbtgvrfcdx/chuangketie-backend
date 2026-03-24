const templates = require('../data/mockTemplates');
const categories = require('../data/mockCategories');
const { success } = require('../utils/response');

function getTemplates(req, res) {
  return res.json(success(templates));
}

function getTemplateDetail(req, res, next) {
  const template = templates.find((item) => item.id === req.params.id);

  if (!template) {
    return next({ status: 404, message: '模板不存在' });
  }

  return res.json(success(template));
}

function getTemplatesByCategory(req, res, next) {
  let categoryName;

  try {
    categoryName = decodeURIComponent(req.params.name).trim().toLowerCase();
  } catch (error) {
    return next({ status: 400, message: '分类名称格式不正确' });
  }

  const list = templates.filter((item) => item.category.toLowerCase() === categoryName);

  return res.json(success(list));
}

function searchTemplates(req, res) {
  const keyword = (req.query.kw || '').trim().toLowerCase();

  if (!keyword) {
    return res.json(success([]));
  }

  const list = templates.filter((item) => {
    const haystacks = [item.title, item.category, item.description, ...(item.tags || [])]
      .join(' ')
      .toLowerCase();

    return haystacks.includes(keyword);
  });

  return res.json(success(list));
}

function getCategories(req, res) {
  return res.json(success(categories));
}

module.exports = {
  getTemplates,
  getTemplateDetail,
  getTemplatesByCategory,
  searchTemplates,
  getCategories,
};
