const express = require('express');
const { createSpiderAssets, getSpiderAssets } = require('../controllers/spiderController');

const router = express.Router();

router.post('/spider/assets', createSpiderAssets);
router.get('/spider/assets', getSpiderAssets);

module.exports = router;
