const templates = require('../data/mockTemplates');
const designs = require('../data/mockDesigns');
const { success } = require('../utils/response');

function getDesigns(req, res) {
  const list = designs.filter((item) => item.userId === req.user.id);
  return res.json(success(list));
}

function createDesign(req, res, next) {
  const { templateId, title, cover, content } = req.body;

  if (!templateId || !title) {
    return next({ status: 400, message: 'templateId 和 title 为必填项' });
  }

  const template = templates.find((item) => item.id === templateId);

  if (!template) {
    return next({ status: 404, message: '关联模板不存在' });
  }

  const now = new Date().toISOString();
  const newDesign = {
    id: `design-${Date.now()}`,
    userId: req.user.id,
    templateId,
    title,
    cover: cover || template.cover,
    content: content || {},
    createdAt: now,
    updatedAt: now,
  };

  designs.unshift(newDesign);
  return res.status(201).json(success(newDesign, '作品创建成功'));
}

function deleteDesign(req, res, next) {
  const index = designs.findIndex((item) => item.id === req.params.id && item.userId === req.user.id);

  if (index === -1) {
    return next({ status: 404, message: '作品不存在' });
  }

  const [removed] = designs.splice(index, 1);
  return res.json(success(removed, '作品删除成功'));
}

module.exports = {
  getDesigns,
  createDesign,
  deleteDesign,
};
