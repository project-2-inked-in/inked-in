const router = require('express').Router();
const User = require('../models/User');

// @desc    App home page
// @route   GET /welcome
// @access  Private
router.get('/', (req, res, next) => {
  const user = req.session.currentUser;
  res.render('welcome', user);
});

module.exports = router;
