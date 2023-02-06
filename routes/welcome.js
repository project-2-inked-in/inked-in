const router = require('express').Router();
const User = require('../models/User');
const Tattoo = require('../models/Tattoo');
const { isLoggedIn } = require('../middlewares');

// @desc    App home page
// @route   GET /welcome
// @access  Private
router.get('/', isLoggedIn, async (req, res, next) => {
  const user = req.session.currentUser;
  try {
    const allTattooes = await Tattoo.find({}).populate('user');
    const justTattooersPhotos = allTattooes.filter(({ user }) => user.userRole == 'tattooer');
    res.render('welcome', { user, justTattooersPhotos});
  } catch (error) {
    next(error)
  }
});

module.exports = router;
