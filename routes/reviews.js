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
    res.redirect(`/tattooer/${tattooerId}`)
    } catch (error) {
        next(error)
    }
});

// @desc Edit Reviews view
// @route GET /reviews/edit/tattooerId
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

// @desc Edit Reviews data to database
// @route POST /reviews/edit/tattooerId
// @access Private
router.post('/edit/:tattoerId', isLoggedIn, async (req, res, next) => {
    const { stars, comment } = req.body;
    const { tattooerId } = req.params;
    try {
        const editedReview = await Review.findByIdAndUpdate(tattooerId, { stars, comment }, { new: true });
        res.redirect(`/${editedReview._id}`);
    } catch (error) {
        next(error)
    }
});

module.exports = router;