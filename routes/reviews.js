const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Tattooer = require('../models/Tattoo');
const Review = require('../models/Review')
const { isLoggedIn } = require('../middlewares');

// @desc Get Reviews
// @route GET /users/reviews
// @access Private
router.get('/reviews/:tattoerId', isLoggedIn, async function (req, res, next) {
    const { tattooerId } = req.params;
    const user = req.session.currentUser;
    try {
        const tattooer = await Tattooer.findById(tattooerId).populate('reviews');
        const reviews = await Review.find({ tattooer: tattooerId });
        res.render('detail', { user, reviews });
    } catch (error) {
        next(error)
    }
});

// @desc Reviews
// @route POST /users/reviews
// @access Private
router.post('/reviews/:tattooerId', isLoggedIn, async function (req, res, next) {
    const { stars, comment } = req.body;
    const { username } = req.session.currentUser;
    const { tattooerId } = req.params;
    try {
    await Review.create({ stars, comment, username, tattooer: tattooerId });
    res.redirect(`/profile/${tattooerId}`)
    } catch (error) {
        next(error)
    }
});

// @desc Edit Reviews
// @route GET /users/reviews/edit
// @access Private
router.get('/reviews/edit/:tattoerId', isLoggedIn, async function (req, res, next) {
    const { tattooerId } = req.params;
    try {
        const review = await Review.findById(tattooerId);
        res.render('editReview', review);
    } catch (error) {
        next(error)
    }
});

// @desc Edit Reviews
// @route POST /users/reviews/edit
// @access Private
router.post('/reviews/edit/:tattoerId', isLoggedIn, async function (req, res, next) {
    const { stars, comment } = req.body;
    const { tattooerId } = req.params;
    try {
        const editedReview = await Review.findByIdAndUpdate(tattooerId, { stars, comment }, { new: true });
        res.redirect(`/reviews/${editedReview._id}`);
    } catch (error) {
        next(error)
    }
});

module.exports = router;