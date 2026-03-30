const express = require('express');
const {
  getTemplates,
  searchTemplates,
  getTemplateById,
  getCategories,
  addTemplate,
  updateTemplate,
  deleteTemplate,
} = require('../controllers/templateController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// 公开接口
router.get('/templates', getTemplates);
router.get('/templates/search', searchTemplates);
router.get('/templates/:id', getTemplateById);
router.get('/categories', getCategories);

// 需要认证的接口
router.post('/templates', authMiddleware, addTemplate);
router.put('/templates/:id', authMiddleware, updateTemplate);
router.delete('/templates/:id', authMiddleware, deleteTemplate);

module.exports = router;
