const router = require('express').Router();
const User = require('../models/User');
const Tattoo = require('../models/Tattoo');
const { isLoggedIn } = require('../middlewares');
const fileUploader = require('../config/cloudinary.config');

// @desc User upload photo and photo info
// @route GET tattoo/upload
// @access Private
router.get('/upload', isLoggedIn, (req, res, next) => {
    const user = req.session.currentUser;
    if (user.userRole == "tattooer") {
        const tattooerUser = user.userRole;
        res.render('tattooesPhotos/uploadContent', { user, tattooerUser })
    } if (user.userRole == "user") {
        const userUser = user.userRole;
        res.render('tattooesPhotos/uploadContent', { user, userUser }); 
    }  
});

// @desc Sends user data to database to update user info
// @route POST tattoo/upload
// @access Private
router.post('/upload', fileUploader.single('tattooImage'), isLoggedIn,  async (req, res, next) => {
    const { tattooPhotoStyle, year, tattooer, place } = req.body;
    const userSession = req.session.currentUser;
    try {
        if (year > 2023) {
        res.render('tattooesPhotos/uploadContent', { error: "This year is impossible dude!" })
        return;
    } else {
        await Tattoo.create({user: userSession._id, tattooPhotoStyle, year, tattooer, place, tattooImage: req.file.path})
            res.redirect('/users/profile')
            }
    } catch (error) {
        next(error) 
    }
});

// @desc Photos user EDIT 
// @route GET tattoo/edit/:id
// @access Private
router.get('/edit/:photoId', isLoggedIn, async (req, res, next) => {
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
        res.render('tattooesPhotos/editPhotosContent', { user, tattooerUser, photoData, resultSelectStyles, resultNoSelect })
    } if (user.userRole == "user") {
        const userUser = user.userRole;
        res.render('tattooesPhotos/editPhotosContent', { user, userUser, photoData });
        } 
    } catch (error) {
        next(error)
    }
});

// @desc Photos user EDIT
// @route POST tattoo/edit/:id
// @access Private
router.post('/edit/:photoId', isLoggedIn, async (req, res, next) => {
    const { tattooPhotoStyle, year, place, tattooer } = req.body;
    const { photoId } = req.params;
    const user = req.session.currentUser;

    try {
        await Tattoo.findByIdAndUpdate(photoId, {tattooPhotoStyle, year, place, tattooer }, { new: true });
        //res.render('auth/profile', userInDB);
        res.redirect('/users/profile')
    } catch (error) {
        next(error);
    }
});

// @desc Photos user DELETE 
// @route GET tattoo/profile/delete/:id
// @access Private
router.get('/delete/:photoId', isLoggedIn, async(req, res, next) => {
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