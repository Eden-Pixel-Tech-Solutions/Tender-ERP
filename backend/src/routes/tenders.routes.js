const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const {
  getTenders,
  toggleInterested
} = require('../controllers/tenders.controller');

router.get('/', auth, getTenders);
router.patch('/:bidNumber/interest', auth, toggleInterested);

module.exports = router;
