const router = require('express').Router();
const User = require('../models/User');
const Tattoo = require('../models/Tattoo');
const { isLoggedIn } = require('../middlewares');
const { ifTattooerOut } = require('../middlewares');


// @desc User can see tattooer detail profile
// @route GET tattooer/:id
// @access Private
router.get('/:tattooerId', isLoggedIn, ifTattooerOut, async (req, res, next) => {
  const user = req.session.currentUser;
  const {tattooerId } = req.params;
  try {
    const allTattooerData = await Tattoo.findOne({ user: tattooerId }).populate('user');
    const allTattoPhotos = await Tattoo.find({ user: tattooerId });
    res.render('tattooesPhotos/tattooer', { user, allTattooerData, allTattoPhotos, tattooerId })
  } catch (error) {
    next(error)
  }
});

// // @desc Profile user
// // @route GET user/profile
// // @access Private
// router.get('/profile', isLoggedIn, async (req, res, next) => {
//     const user = req.session.currentUser;
//     try {
//         const dataUser = await Tattoo.find({ user: user._id });
//             if (user.userRole == "tattooer") {
//         const tattooerUser = user.userRole
//         res.render('auth/profile', { user, tattooerUser, dataUser });
//     } else {
//         res.render('auth/profile', { user, dataUser }); 
//     }
//     } catch (error) {
//         next(error) 
//     }
// });

module.exports = router;