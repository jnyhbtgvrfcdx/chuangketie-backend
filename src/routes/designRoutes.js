const express = require('express');
const {
  createDesign,
  getDesigns,
  deleteDesign,
} = require('../controllers/designController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use('/designs', authMiddleware);
router.post('/designs', createDesign);
router.get('/designs', getDesigns);
router.delete('/designs/:id', deleteDesign);

module.exports = router;
