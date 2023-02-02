const router = require('express').Router();
const User = require('../models/User');
const Tattoo = require('../models/Tattoo');
const { isLoggedTattooer } = require('../middlewares');
const { isLoggedIn } = require('../middlewares');

// @desc    App home page
// @route   GET /welcome
// @access  Private
//No sé perquè aquí està aquest middleware, però la cosa és que no
//funciona
router.get('/', isLoggedIn, isLoggedTattooer, async (req, res, next) => {
  const user = req.session.currentUser;
  console.log('This is from welcome', user)
  try {
    const allTattooes = await Tattoo.find({}).populate('user');
    const justTattooersPhotos = allTattooes.filter(({ user }) => user.userRole == 'tattooer');
    res.render('welcome', { user, justTattooersPhotos});
  } catch (error) {
    next(error)
  }
});

module.exports = router;
