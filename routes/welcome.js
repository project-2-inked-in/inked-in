const router = require('express').Router();
const User = require('../models/User');
const Tattoo = require('../models/Tattoo');
const Like = require('../models/Like');
const { isLoggedIn } = require('../middlewares');

// @desc    App home page
// @route   GET /welcome
// @access  Private
router.get('/', isLoggedIn, async (req, res, next) => {
  const user = req.session.currentUser;
  try {
    const allTattooes = await Tattoo.find({}).populate('user');
    const justTattooersPhotos = allTattooes.filter(({ user }) => user.userRole == 'tattooer');
    const justTattooersPhotosAndLike = await Promise.all(justTattooersPhotos.map(async (tattooo) => {
      // Transform your mongoose object to standard javascript object 
      let tatu = tattooo.toObject();
      const like = await Like.findOne({ user: user._id, tattoo: tatu._id })
      if (like != null) {
        tatu.isLikedPhoto = true;
        tatu.numberLikes = []
      } else {
        tatu.isLikedPhoto = false;
      }
      return tatu
    }));
    // const Likes = await Promise.all(justTattooersPhotos.map(async (photoTattoo) => {
    //   const findLikes = await Like.find({ tattoo: photoTattoo._id });
    //   const likesPerPhoto = findLikes.length
    //   return likesPerPhoto
    // }));
    res.render('welcome', { user, justTattooersPhotosAndLike});
  } catch (error) {
    next(error)
  }
});

module.exports = router;