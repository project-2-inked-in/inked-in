const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Tattooer = require('../models/Tattoo');
const Review = require('../models/Review')
const { isLoggedIn } = require('../middlewares');

// @desc Get Reviews
// @route GET /users/reviews
// @access Private
router.get('/:tattooerId', isLoggedIn, async (req, res, next) => {
    const { tattooerId } = req.params;
    const user = req.session.currentUser;
    try {
        const tattooer = await Tattooer.findById(tattooerId).populate('reviews');
        const reviews = await Review.find({ tattooer: tattooerId });
        res.render('reviews/detail', { user, reviews });
    } catch (error) {
        next(error)
    }
});

// @desc Reviews
// @route POST /users/reviews
// @access Private
router.post('/:tattooerId', isLoggedIn, async (req, res, next) => {
    const { stars, comment } = req.body;
    const { username } = req.session.currentUser;
    const { tattooerId } = req.params;
    try {
    await Review.create({ stars, comment, username, tattooer: tattooerId });
    res.redirect('/tattooer/${tattooerId}')
    } catch (error) {
        next(error)
    }
});

// @desc Edit Reviews
// @route GET /users/reviews/edit
// @access Private
router.get('/edit/:tattoerId', isLoggedIn, async (req, res, next) => {
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
router.post('/edit/:tattoerId', isLoggedIn, async (req, res, next) => {
    const { stars, comment } = req.body;
    const { tattooerId } = req.params;
    try {
        const editedReview = await Review.findByIdAndUpdate(tattooerId, { stars, comment }, { new: true });
        res.redirect('/${editedReview._id}');
    } catch (error) {
        next(error)
    }
});

module.exports = router;