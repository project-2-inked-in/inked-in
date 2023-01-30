const router = require('express').Router();

// @desc    App first page
// @route   GET /
// @access  Public
router.get('/', (req, res, next) => {
  res.render('index');
});

module.exports = router;
