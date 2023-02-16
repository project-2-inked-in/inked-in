const router = require('express').Router();
const User = require('../models/User');
const Tattoo = require('../models/Tattoo');
const Like = require('../models/Like');
const Favorite = require('../models/Favorite');
const { isLoggedIn } = require('../middlewares');

// @desc    App home page
// @route   GET /welcome
// @access  Private
router.get('/', isLoggedIn, async (req, res, next) => {
  const user = req.session.currentUser;
  try {
    const allTattooes = await Tattoo.find({}).populate('user').sort({ createdAt: -1 });
    const justTattooersPhotos = allTattooes.filter(({ user }) => user.userRole == 'tattooer');
    const justTattooersPhotosAndLike = await Promise.all(justTattooersPhotos.map(async (tattooo) => {
      // Transform your mongoose object to standard javascript object 
      let tatu = tattooo.toObject();
      const like = await Like.findOne({ user: user._id, tattoo: tatu._id })
      if (like != null) {
        tatu.isLikedPhoto = true;
      } else {
        tatu.isLikedPhoto = false;
      }
      const findLikes = await Like.find({ tattoo: tatu._id });
      tatu.numberLikes = findLikes.length;

      const findFav = await Favorite.findOne({ user: user._id, tattoo: tatu._id });
      if (findFav != null) {
        tatu.isFavPhoto = true;
      } else {
        tatu.isFavPhoto = false;
      }
      return tatu;
    }));
    res.render('welcome', { user, justTattooersPhotosAndLike});
  } catch (error) {
    next(error)
  }
});

module.exports = router;