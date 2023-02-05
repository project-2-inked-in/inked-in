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

// @desc Profile user EDIT
// @route GET users/profile/edit
// @access Private
router.get('/profile/edit', isLoggedIn, async function (req, res, next) {
    const user = req.session.currentUser;
    console.log("TEST USER", user)
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
router.post('/profile/edit', fileUploader.single('profileImage'), isLoggedIn, async function (req, res, next) {
    const { city, tattooNumber, profileDescription, tattooStyle, studio, nextJourneys } = req.body;
    const user = req.session.currentUser;
    console.log('user123', user)
    console.log('This is req.file.path', req.file)
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
        await Tattoo.create({user: userSession._id, tattooPhotoStyle, year, tattooer, place, tattooImage: req.file.path})
        res.redirect('/users/profile')
    } catch (error) {
        next(error) 
    }
});

// @desc Photos user EDIT 
// @route GET users/profile/edit/:id
// @access Private
router.get('/profile/edit/:photoId', isLoggedIn, async function (req, res, next) {
    const { photoId } = req.params;
    const user = req.session.currentUser;
    try {
        const photoData = await Tattoo.findById(photoId);
        const styles = ['traditionalOldSchool', 'realism', 'watercolor', 'tribal', 'newSchool', 'neoTraditional', 'japanese', 'blackwork', 'dotwork', 'geometric', 'illustrative', 'sketch', 'anime', 'lettering', 'minimalism', 'surrealism', 'trashPolka', 'blackAndGrey', 'ignorant', 'other'];
        const selectStyles = photoData.tattooPhotoStyle;
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
        res.render('editPhotosContent', { user, tattooerUser, photoData, resultSelectStyles, resultNoSelect })
    } if (user.userRole == "user") {
        const userUser = user.userRole;
        res.render('editPhotosContent', { user, userUser, photoData });
        } 
    } catch (error) {
        next(error)
    }
});

// @desc Profile user EDIT
// @route POST users/profile/edit/:id
// @access Private
router.post('/profile/edit/:photoId', isLoggedIn, async function (req, res, next) {
    const { tattooPhotoStyle, year, place, tattooer } = req.body;
    const { photoId } = req.params;
    const user = req.session.currentUser;
    console.log('user123', user)
    try {
        await Tattoo.findByIdAndUpdate(photoId, {tattooPhotoStyle, year, place, tattooer }, { new: true });
        //res.render('auth/profile', userInDB);
        res.redirect('/users/profile')
    } catch (error) {
        next(error);
    }
});

// @desc Photos user DELETE 
// @route GET users/profile/delete/:id
// @access Private
router.get('/profile/delete/:photoId', isLoggedIn, async function (req, res, next) {
    const { photoId } = req.params;
    const user = req.session.currentUser;
    try {
        const photoData = await Tattoo.findByIdAndDelete(photoId);
        res.redirect('/users/profile');
    } catch (error) {
        next(error)
    }
});

module.exports = router;