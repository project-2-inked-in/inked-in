const router = require('express').Router();
const User = require('../models/User');
const Tattoo = require('../models/Tattoo');
const Like = require('../models/Like');
const Favorite = require('../models/Favorite');
const { isLoggedIn } = require('../middlewares');

// @desc User can se their favorites
// @route GET favorites/
// @access Private
router.get('/', isLoggedIn, async (req, res, next) => {
  const user = req.session.currentUser;
  try {
    const myFavorite = await Favorite.find({ user: user._id }).populate('tattoo');
    const findTattooerNames = await Promise.all(myFavorite.map(async (elem) => {
      let tatooInfo = elem.toObject();
      const findUserName = await User.findById(tatooInfo.tattoo.user)
      tatooInfo.tattooerName = findUserName.username;
      return tatooInfo
    }));
    console.log("hulaaaa", findTattooerNames)
    res.render('favorites/myFavorites', { user, findTattooerNames});
  } catch (error) {
    next(error)
  }
});

// @desc User choose favorites
// @route GET favorites/tattooId
// @access Private
router.get('/:tattooId', isLoggedIn, async (req, res, next) => {
  const user = req.session.currentUser;
  const { tattooId } = req.params;
  try {
    const isFavorite = await Favorite.findOne({ user: user._id, tattoo: tattooId });
    if (isFavorite) {
      res.redirect('back');
    } else {
      await Favorite.create({ user: user._id, tattoo: tattooId });
      res.redirect('back');
    }
  } catch (error) {
    next(error)
  }
});

// @desc Users delete their favorites
// @route GET favorites/delete/tattooId
// @access Private
router.get('/delete/:tattooId', isLoggedIn, async (req, res, next) => {
  const user = req.session.currentUser;
  const { tattooId } = req.params;
  try {
    await Favorite.findOneAndDelete({ user: user._id, tattoo: tattooId });
    res.redirect('back');
  } catch (error) {
    next(error)
  }
});



module.exports = router;