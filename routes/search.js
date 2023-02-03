const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Tattoo = require('../models/Tattoo');
const { isLoggedIn } = require('../middlewares');

// @desc Search view
// @route GET /search
// @access Private
router.get('/', isLoggedIn, function (req, res, next) {
    const user = req.session.currentUser;
    res.render('search', {user});
});

// @desc get search query 
// @route GET /search
// @access Private
router.get('/tattooer', isLoggedIn, async function (req, res, next) {
    console.log('caca')
    //const { username } = req.query;
    const { tattooPhotoStyle } = req.query;
    console.log('this is tattooerResult', tattooPhotoStyle)
    //console.log('this is username1', username)
    const user = req.session.currentUser;
    try {
        const tattoo = await Tattoo.find({ tattooPhotoStyle: tattooPhotoStyle }).populate('user');
    //     const tattooUserName = tattoo.filter((userName) => {
    //         console.log(userName)
    //         return userName.user.username == username
    // });
        // console.log('this is USERNAME', tattooUserName)
        // console.log('this is TATTOO', tattoo)
        res.render('search', { tattoo, user, /*tattooUserName*/ });
    } catch (error) {
        next(error)
    }
});

module.exports = router;