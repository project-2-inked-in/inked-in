const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Tattoo = require('../models/Tattoo');
const Review = require('../models/Review')
const { isLoggedIn } = require('../middlewares');

// @desc Get Reviews view
// @route GET /reviews/tattooerId
// @access Private
router.get('/:tattooerId', isLoggedIn, async (req, res, next) => {
    const { tattooerId } = req.params;
    const user = req.session.currentUser;
    try {
        const tattooer = await User.findById(tattooerId);
        const reviews = await Review.find({ tattooerId: tattooerId }).populate('userId');
        const userCanedit = [];
        const userCanTedit = [];
        reviews.filter(review => {
            if (user._id.includes(review.userId._id)) {
                userCanedit.push(review)
            } 
            else {
                userCanTedit.push(review)
            } 
        });
        const userNoReview = !(tattooerId === user._id );
        res.render('reviews/reviews', { user, tattooer, reviews, userCanedit, userCanTedit, userNoReview}); 
    } catch (error) {
        next(error)
    }
});

// @desc Reviews data to database
// @route POST /reviews/tattooerId
// @access Private
router.post('/:tattooerId', isLoggedIn, async (req, res, next) => {
    const { stars, comment } = req.body;
    const user = req.session.currentUser;
    const { tattooerId } = req.params;
    try {
    await Review.create({ stars, comment, userId: user._id, tattooerId: tattooerId });
    res.redirect(`/reviews/${tattooerId}`)
    } catch (error) {
        next(error)
    }
});

// @desc Edit Reviews view
// @route GET /reviews/edit/tattooerId
// @access Private
router.get('/edit/:reviewId', isLoggedIn, async (req, res, next) => {
    const { reviewId } = req.params;
    const user = req.session.currentUser;
    try {
        const review = await Review.findById(reviewId);
        res.render('reviews/editReview', { review, user });
    } catch (error) {
        next(error)
    }
});

// @desc Edit Reviews data to database
// @route POST /reviews/edit/tattooerId
// @access Private
router.post('/edit/:reviewId', isLoggedIn, async (req, res, next) => {
    const { stars, comment } = req.body;
    const { reviewId } = req.params;
    const user = req.session.currentUser;
    try {
        const editedReview = await Review.findByIdAndUpdate(reviewId, { stars, comment }, { new: true });
        res.redirect(`/reviews/${tattooerId}`); //Aquí tiene que ir la ID del tatuador,
    } catch (error) {
        next(error)
    }
});

module.exports = router;