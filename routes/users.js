const express = require('express');
const router = express.Router();
const User = require('../models/User');
// const isLoggedIn = require('../middlewares')

// @desc Profile user
// @route GET user/profile
// @access Private
router.get('/profile', /*middleware here */ function (req, res, next) {
    const user = req.session.currentUser;
    if (user.userRole == "tattooer") {
        const tattooerUser = user.userRole
        console.log('This is tattooer user', tattooerUser)
        console.log('This is user', user )
        res.render('auth/profile', { user, tattooerUser });
    } else {
       res.render('auth/profile', { user }); 
    } 
});


// @desc Profile user EDIT
// @route GET user/profile/edit
// @access Private
router.get('/profile/edit', /*middleware here */ function (req, res, next) {
    const user = req.session.currentUser;
    console.log(user)
    res.render('editProfile', {user});
});

// @desc Profile user EDIT
// @route POST user/profile/edit
// @access Private
router.post('/profile/edit', /*middleware here */ async function (req, res, next) {
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

module.exports = router;