const express = require('express');
const { getInterfaces } = require('../controllers/docsController');

const router = express.Router();

router.get('/docs/interfaces', getInterfaces);

module.exports = router;
