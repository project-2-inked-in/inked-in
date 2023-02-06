const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Tattoo = require('../models/Tattoo');
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
    //const { username } = req.query;
    const { tattooPhotoStyle } = req.query;
    const user = req.session.currentUser;
    try {
        const tattoo = await Tattoo.find({ tattooPhotoStyle: { $in: tattooPhotoStyle }}).populate('user');
    //     const tattooUserName = tattoo.filter((userName) => {
    //         return userName.user.username == username
    // });
        res.render('search', { tattoo, user, /*tattooUserName*/ });
    } catch (error) {
        next(error)
    }
});

module.exports = router;