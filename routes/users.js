const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Tattoo = require('../models/Tattoo')
const fileUploader = require('../config/cloudinary.config');
const { isLoggedIn } = require('../middlewares');
const Review = require('../models/Review');
const Like = require('../models/Like');
const Favorite = require('../models/Favorite');
const Contact = require('../models/Contact');


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
    const styles = ['traditionalOldSchool', 'realism', 'watercolor', 'tribal', 'newSchool', 'neoTraditional', 'japanese', 'blackwork', 'dotwork', 'geometric', 'illustrative', 'sketch', 'anime', 'lettering', 'minimalism', 'surrealism', 'trashPolka', 'blackAndGrey', 'ignorant', 'other'];
    const resultNoSelect = [];
    if(user.userRole === "tattooer") {
        styles.filter(style => {
            if (!tattooStyle.includes(style)) {
                resultNoSelect.push(style)
            };
        });
    };
    if (profileDescription.length > 120) {
        if (user.userRole === "tattooer") {
            const tattooerUser = user.userRole; 
            if (typeof tattooStyle != "object") {
                const tattooStyleArr = [tattooStyle]
                res.render('auth/editProfile', { user, resultSelectStyles: tattooStyleArr , resultNoSelect, tattooerUser, error: `Description just allow 120 characters` });
                return;
            } else {
                res.render('auth/editProfile', { user, resultSelectStyles: tattooStyle, resultNoSelect, tattooerUser, error: `Description just allow 120 characters` }); 
                return;    
            }
        } else {
        res.render('auth/editProfile', { user, tattooerUser, error: `Description just allow 120 characters` });
            return;
        };
    };
    try {
        if (req.file === undefined) {
            const userInDB = await User.findByIdAndUpdate(user._id, {city, tattooNumber, profileDescription, tattooStyle, studio, nextJourneys }, { new: true });  
            req.session.currentUser = userInDB;
        } else {
            const userInDB = await User.findByIdAndUpdate(user._id, { profileImage: req.file.path, city, tattooNumber, profileDescription, tattooStyle, studio, nextJourneys }, { new: true });
            req.session.currentUser = userInDB;
        }
        res.redirect('/users/profile')
    } catch (error) {
        next(error);
    }
});

// @desc Unsubscribe profile user EDIT
// @route GET users/unsubscribe
// @access Private
router.get('/unsubscribe', isLoggedIn, async (req, res, next) => {
    const user = req.session.currentUser;
    try {
        await Tattoo.deleteMany({ user: user._id });
        await Review.deleteMany({ userId: user._id });
        await Like.deleteMany({ user: user._id });
        await Favorite.deleteMany({ user: user._id });
        await Contact.deleteMany({ user: user._id });
        await User.deleteOne({ _id: user._id });
        req.session.destroy((err) => {
            if (err) {
                next(err)
            } else {
                res.clearCookie('inked-in-cookie');
                res.redirect('/auth/signup');
            }
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;