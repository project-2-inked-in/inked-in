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
      console.log('ja té el meu like!')
      res.redirect('/welcome');
    } else {
      console.log('no té el meu like!')
      await Like.create({ user: user._id, tattoo: tattooId });
      res.redirect('/welcome');
    }
  } catch (error) {
    next(error)
  }
});

// @desc Sends user data to database to update user info
// @route POST tattoo/upload
// @access Private
// router.post('/upload', fileUploader.single('tattooImage'), isLoggedIn,  async (req, res, next) => {
//     const { tattooPhotoStyle, year, tattooer, place } = req.body;
//     const userSession = req.session.currentUser;
//     try {
//         if (year > 2023) {
//         res.render('tattooesPhotos/uploadContent', { error: "This year is impossible dude!" })
//         return;
//     } else {
//         await Tattoo.create({user: userSession._id, tattooPhotoStyle, year, tattooer, place, tattooImage: req.file.path})
//             res.redirect('/users/profile')
//             }
//     } catch (error) {
//         next(error) 
//     }
// });



module.exports = router;