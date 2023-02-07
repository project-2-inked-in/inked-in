const router = require('express').Router();
const { isLoggedButOut } = require('../middlewares');

// @desc    App first page
// @route   GET /
// @access  Public
router.get('/', isLoggedButOut, (req, res, next) => {
  res.render('index');
});

module.exports = router;
