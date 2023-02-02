const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Tattooer = require('../models/Tattoo')
const fileUploader = require('../config/cloudinary.config');
const { isLoggedIn } = require('../middlewares');

// @desc Profile user
// @route GET user/profile
// @access Private
router.get('/profile', isLoggedIn, async function (req, res, next) {
    const user = req.session.currentUser;
    try {
        const dataUser = await Tattooer.find({ user: user._id });
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

// @desc Profile user EDIT
// @route GET users/profile/edit
// @access Private
router.get('/profile/edit', isLoggedIn, function (req, res, next) {
    const user = req.session.currentUser;
    console.log(user)
    res.render('auth/editProfile', {user});
});

// @desc Profile user EDIT
// @route POST users/profile/edit
// @access Private
router.post('/profile/edit', isLoggedIn, async function (req, res, next) {
    const { username } = req.body;
    const user = req.session.currentUser;
    try {
        const userInDB = await User.findByIdAndUpdate(user._id, { username }, { new: true });
        req.session.currentUser = userInDB;
        res.redirect('users/profile');
    } catch (error) {
        next(error);
    }
});

// @desc User upload photo and photo info
// @route GET users/upload
// @access Private
router.get('/upload', isLoggedIn, (req, res, next) => {
    const user = req.session.currentUser;
    if (user.userRole == "tattooer") {
        const tattooerUser = user.userRole;
        res.render('uploadContent', { user, tattooerUser })
    } if (user.userRole == "user") {
        const userUser = user.userRole;
        res.render('uploadContent', { user, userUser }); 
    }  
});

// @desc Sends user data to database to update user info
// @route POST users/upload
// @access Private
router.post('/upload', fileUploader.single('tattooImage'), isLoggedIn,  async (req, res, next) => {
    const { tattooPhotoStyle, year, tattooer, place } = req.body;
    const userSession = req.session.currentUser;
    try {
        await Tattooer.create({user: userSession._id, tattooPhotoStyle, year, tattooer, place, tattooImage: req.file.path})
        res.redirect('/users/profile')
    } catch (error) {
        next(error) 
    }
});

module.exports = router;