const router = require('express').Router();
const User = require('../models/User');
const Tattoo = require('../models/Tattoo');
const Like = require('../models/Like');
const { isLoggedIn } = require('../middlewares');
const fileUploader = require('../config/cloudinary.config');

// @desc User give likes
// @route GET likes/tattooId
// @access Private
router.get('/:tattooId', isLoggedIn, async (req, res, next) => {
  const user = req.session.currentUser;
  const { tattooId } = req.params;
  try {
    const isLiked = await Like.findOne({ user: user._id, tattoo: tattooId });
    if (isLiked) {
      // console.log('ja té el meu like!')
      res.redirect('/welcome');
    } else {
      // console.log('no té el meu like!')
      await Like.create({ user: user._id, tattoo: tattooId });
      res.redirect('/welcome');
    }
  } catch (error) {
    next(error)
  }
});

// @desc Users delete their likes
// @route GET likes/delete/tattooId
// @access Private
router.get('/delete/:tattooId', isLoggedIn, async (req, res, next) => {
  const user = req.session.currentUser;
  const { tattooId } = req.params;
  try {
    const findLikeAndDelete = await Like.findOneAndDelete({ user: user._id, tattoo: tattooId });
    // const likeToDelete = await Like.findByIdAndDelete(findLike._id);
    console.log('jborrrar likeeeeee!', findLikeAndDelete)
    res.redirect('/welcome');
  } catch (error) {
    next(error)
  }
});



module.exports = router;