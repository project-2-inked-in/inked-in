const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Tattoo = require('../models/Tattoo')
const fileUploader = require('../config/cloudinary.config');
const { isLoggedIn } = require('../middlewares');
const { isLoggedTattooer } = require('../middlewares');

// @desc Profile user
// @route GET user/profile
// @access Private
router.get('/profile', isLoggedIn, async (req, res, next) => {
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

// @desc Profile user EDIT
// @route GET users/profile/edit
// @access Private
router.get('/profile/edit', isLoggedIn, async (req, res, next) => {
    const user = req.session.currentUser;
    try {
        const styles = ['traditionalOldSchool', 'realism', 'watercolor', 'tribal', 'newSchool', 'neoTraditional', 'japanese', 'blackwork', 'dotwork', 'geometric', 'illustrative', 'sketch', 'anime', 'lettering', 'minimalism', 'surrealism', 'trashPolka', 'blackAndGrey', 'ignorant', 'other'];
        const selectStyles = user.tattooStyle;
        const resultSelectStyles = [];
        const resultNoSelect = [];
        styles.filter(style => {
            if (selectStyles.includes(style)) {
                resultSelectStyles.push(style)
            } else {
                resultNoSelect.push(style)
            }
        });
        if (user.userRole === "tattooer") {
        const tattooerUser = user.userRole;
        res.render('auth/editProfile', { user, tattooerUser, resultNoSelect, resultSelectStyles })
    } else {
        res.render('auth/editProfile', { user })
    }
    } catch (error) {
        
    }
});

// @desc Profile user EDIT
// @route POST users/profile/edit
// @access Private
router.post('/profile/edit', fileUploader.single('profileImage'), isLoggedIn, async (req, res, next) => {
    const { city, tattooNumber, profileDescription, tattooStyle, studio, nextJourneys } = req.body;
    const user = req.session.currentUser;
    try {
        if (req.file === undefined) {
            const userInDB = await User.findByIdAndUpdate(user._id, {city, tattooNumber, profileDescription, tattooStyle, studio, nextJourneys }, { new: true });  
            req.session.currentUser = userInDB;
        } else {
            const userInDB = await User.findByIdAndUpdate(user._id, { profileImage: req.file.path, city, tattooNumber, profileDescription, tattooStyle, studio, nextJourneys }, { new: true });
            req.session.currentUser = userInDB;
        }
        //res.render('auth/profile', userInDB);
        res.redirect('/users/profile')
    } catch (error) {
        next(error);
    }
});

module.exports = router;