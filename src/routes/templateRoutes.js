const express = require('express');
const {
  getTemplates,
  getTemplateDetail,
  getTemplatesByCategory,
  searchTemplates,
  getCategories,
} = require('../controllers/templateController');

const router = express.Router();

router.get('/templates/search', searchTemplates);
router.get('/templates/category/:name', getTemplatesByCategory);
router.get('/templates/:id', getTemplateDetail);
router.get('/templates', getTemplates);
router.get('/categories', getCategories);

module.exports = router;
