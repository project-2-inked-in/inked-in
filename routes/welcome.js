const router = require('express').Router();
const User = require('../models/User');

// @desc    App home page
// @route   GET /welcome
// @access  Private
router.get('/', (req, res, next) => {
  res.render('welcome');
});

module.exports = router;
