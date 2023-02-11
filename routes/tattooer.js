const router = require('express').Router();
const User = require('../models/User');
const Tattoo = require('../models/Tattoo');
const Like = require('../models/Like');
const { isLoggedIn } = require('../middlewares');
const { ifTattooerOut } = require('../middlewares');




// @desc User can see tattooer detail profile
// @route GET tattooer/:id
// @access Private
router.get('/:tattooerId', isLoggedIn, ifTattooerOut, async (req, res, next) => {
  const user = req.session.currentUser;
  const { tattooerId } = req.params;
  try {
    const allTattooerData = await Tattoo.findOne({ user: tattooerId }).populate('user');
    const allTattoPhotos = await Tattoo.find({ user: tattooerId });
    const justTattooersPhotosAndLike =  await Promise.all( allTattoPhotos.map( async (tattooo) => {
      let tatu = tattooo.toObject();
      const like = await Like.findOne({ user: user._id, tattoo: tatu._id })
      if (like != null) {
        tatu.isLikedPhoto = true;
      } else {
        tatu.isLikedPhoto = false;
      }
      return tatu
    }));
    //
    res.render('tattooesPhotos/tattooer', { user, allTattooerData, allTattoPhotos, tattooerId, justTattooersPhotosAndLike })
  } catch (error) {
    next(error)
  }
});

module.exports = router;