const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Tattoo = require('../models/Tattoo');
const Like = require('../models/Like');
const Favorite = require('../models/Favorite');
const { isLoggedIn } = require('../middlewares');

// @desc Search view
// @route GET /search
// @access Private
router.get('/', isLoggedIn, (req, res, next) => {
    const user = req.session.currentUser;
    res.render('search', {user});
});

// @desc get search query 
// @route GET /search
// @access Private
router.get('/tattooer', isLoggedIn, async (req, res, next) => {
    const { tattooPhotoStyle, place } = req.query;
    const user = req.session.currentUser;
    try {
        let tattoo;
            if (place.length === 0) {
                tattoo = await Tattoo.find({ tattooPhotoStyle: { $in: tattooPhotoStyle } }).populate('user');
            } else if (tattooPhotoStyle === undefined) {
                tattoo = await Tattoo.find({ place: { $in: place } }).populate('user');
            } else {
                tattoo = await Tattoo.find({ tattooPhotoStyle: { $in: tattooPhotoStyle }, place: { $in: place } }).populate('user');
            }
            const tattooesResult =  await Promise.all( tattoo.map( async (tattooo) => {
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
                return tatu
            }));
            if (tattooesResult.length === 0) {
                const tattooNull = true;
                res.render('search', { tattooNull, user, tattooPhotoStyle, place});
            } else {
                res.render('search', { tattooesResult, user, tattooPhotoStyle, place});
                }
    } catch (error) {
        next(error)
    }
});

module.exports = router;
