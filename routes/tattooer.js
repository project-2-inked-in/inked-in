const router = require('express').Router();
const User = require('../models/User');
const Tattoo = require('../models/Tattoo');
const { isLoggedIn } = require('../middlewares');

// @desc User can see tattooer detail profile
// @route GET tattooer/:id
// @access Private
router.get('/:tattoerId', isLoggedIn, async (req, res, next) => {
  const user = req.session.currentUser;
  const {tattoerId } = req.params;
  try {
    const allTattooerData = await Tattoo.findOne({ user: tattoerId }).populate('user');
    const allTattoPhotos = await Tattoo.find({ user: tattoerId })

    res.render('tattooer', { user, allTattooerData, allTattoPhotos })
  } catch (error) {
    next(error)
  }
});

// @desc Profile user
// @route GET user/profile
// @access Private
router.get('/profile', isLoggedIn, async function (req, res, next) {
    const user = req.session.currentUser;
    try {
        const dataUser = await Tattoo.find({ user: user._id });
            if (user.userRole == "tattooer") {
        const tattooerUser = user.userRole
        res.render('auth/profile', { user, tattooerUser, dataUser });
    } else {
        res.render('auth/profile', { user, dataUser }); 
    }
    } catch (error) {
        next(error) 
    }
});

module.exports = router;